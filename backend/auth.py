"""
用户认证模块 - JWT Token 认证
支持注册、登录、Token 刷新、角色权限控制
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import hashlib
import secrets
import json
import os

router = APIRouter(prefix="/api/auth", tags=["认证"])

# ===================================================================
# Configuration
# ===================================================================

SECRET_KEY = os.environ.get("AUTH_SECRET_KEY", "photonics-platform-dev-secret-key-2026")
TOKEN_EXPIRE_HOURS = 24
REFRESH_TOKEN_EXPIRE_DAYS = 30
DB_FILE = os.path.join(os.path.dirname(__file__), "users_db.json")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ===================================================================
# Models
# ===================================================================

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    password: str = Field(..., min_length=6, max_length=128)
    display_name: str = Field(..., min_length=1, max_length=50)
    email: str
    role: str = Field("engineer", description="engineer | researcher | manager | student")
    organization: str = Field("", max_length=100)

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

class UserProfile(BaseModel):
    id: str
    username: str
    display_name: str
    email: str
    role: str
    organization: str
    avatar: str
    joined_at: str
    permissions: list

class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

# ===================================================================
# Simple File-Based User Store (replace with DB in production)
# ===================================================================

def _load_users() -> dict:
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            return json.load(f)
    return {"users": {}, "tokens": {}}

def _save_users(data: dict):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def _hash_password(password: str) -> str:
    return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()

def _generate_token() -> str:
    return secrets.token_urlsafe(32)

def _get_role_permissions(role: str) -> list:
    perms = {
        "student": ["read", "forum.post", "forum.reply"],
        "engineer": ["read", "forum.post", "forum.reply", "pdk.download", "design.use", "sparam.generate"],
        "researcher": ["read", "forum.post", "forum.reply", "pdk.download", "pdk.upload", "design.use", "sparam.generate", "ip.view"],
        "manager": ["read", "forum.post", "forum.reply", "pdk.download", "pdk.upload", "pdk.manage", "design.use", "sparam.generate", "ip.view", "ip.manage", "nda.manage", "version.release"],
        "admin": ["*"],
    }
    return perms.get(role, perms["student"])

# ===================================================================
# Auth Dependency
# ===================================================================

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """验证 Token 并返回当前用户"""
    db = _load_users()
    token_data = db.get("tokens", {}).get(token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check expiry
    expires_at = datetime.fromisoformat(token_data["expires_at"])
    if datetime.now() > expires_at:
        # Remove expired token
        del db["tokens"][token]
        _save_users(db)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="令牌已过期，请重新登录",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = token_data["user_id"]
    user = db["users"].get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在")
    
    return user

async def require_permission(permission: str):
    """权限检查依赖工厂"""
    async def checker(user: dict = Depends(get_current_user)):
        perms = _get_role_permissions(user.get("role", "student"))
        if "*" not in perms and permission not in perms:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"权限不足：需要 '{permission}' 权限",
            )
        return user
    return checker

# ===================================================================
# Endpoints
# ===================================================================

@router.post("/register", response_model=TokenResponse)
async def register(data: UserRegister):
    """用户注册"""
    db = _load_users()
    
    # Check duplicate
    for uid, user in db["users"].items():
        if user["username"] == data.username:
            raise HTTPException(status_code=400, detail="用户名已存在")
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="邮箱已被注册")
    
    # Create user
    user_id = secrets.token_hex(8)
    avatars = {"engineer": "👨‍🔬", "researcher": "👩‍🎓", "manager": "👔", "student": "🧑‍🎓"}
    
    user = {
        "id": user_id,
        "username": data.username,
        "password_hash": _hash_password(data.password),
        "display_name": data.display_name,
        "email": data.email,
        "role": data.role,
        "organization": data.organization,
        "avatar": avatars.get(data.role, "🧑‍🔬"),
        "joined_at": datetime.now().isoformat(),
        "is_active": True,
    }
    
    db["users"][user_id] = user
    
    # Generate tokens
    access_token = _generate_token()
    refresh_token = _generate_token()
    
    db.setdefault("tokens", {})[access_token] = {
        "user_id": user_id,
        "type": "access",
        "expires_at": (datetime.now() + timedelta(hours=TOKEN_EXPIRE_HOURS)).isoformat(),
    }
    db["tokens"][refresh_token] = {
        "user_id": user_id,
        "type": "refresh",
        "expires_at": (datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)).isoformat(),
    }
    
    _save_users(db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=TOKEN_EXPIRE_HOURS * 3600,
        user=_safe_user(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    """用户登录（OAuth2 兼容）"""
    db = _load_users()
    password_hash = _hash_password(form.password)
    
    # Find user
    target_user = None
    for uid, user in db["users"].items():
        if user["username"] == form.username and user["password_hash"] == password_hash:
            target_user = user
            break
    
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not target_user.get("is_active", True):
        raise HTTPException(status_code=403, detail="账号已被禁用")
    
    # Generate tokens
    access_token = _generate_token()
    refresh_token = _generate_token()
    
    db.setdefault("tokens", {})[access_token] = {
        "user_id": target_user["id"],
        "type": "access",
        "expires_at": (datetime.now() + timedelta(hours=TOKEN_EXPIRE_HOURS)).isoformat(),
    }
    db["tokens"][refresh_token] = {
        "user_id": target_user["id"],
        "type": "refresh",
        "expires_at": (datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)).isoformat(),
    }
    
    _save_users(db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=TOKEN_EXPIRE_HOURS * 3600,
        user=_safe_user(target_user),
    )


@router.post("/login/json", response_model=TokenResponse)
async def login_json(data: UserLogin):
    """JSON 格式登录（前端友好）"""
    db = _load_users()
    password_hash = _hash_password(data.password)
    
    target_user = None
    for uid, user in db["users"].items():
        if user["username"] == data.username and user["password_hash"] == password_hash:
            target_user = user
            break
    
    if not target_user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    access_token = _generate_token()
    refresh_token = _generate_token()
    
    db.setdefault("tokens", {})[access_token] = {
        "user_id": target_user["id"],
        "type": "access",
        "expires_at": (datetime.now() + timedelta(hours=TOKEN_EXPIRE_HOURS)).isoformat(),
    }
    db["tokens"][refresh_token] = {
        "user_id": target_user["id"],
        "type": "refresh",
        "expires_at": (datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)).isoformat(),
    }
    
    _save_users(db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=TOKEN_EXPIRE_HOURS * 3600,
        user=_safe_user(target_user),
    )


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """刷新 Access Token"""
    db = _load_users()
    token_data = db.get("tokens", {}).get(refresh_token)
    
    if not token_data or token_data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="无效的刷新令牌")
    
    expires_at = datetime.fromisoformat(token_data["expires_at"])
    if datetime.now() > expires_at:
        raise HTTPException(status_code=401, detail="刷新令牌已过期，请重新登录")
    
    # Generate new access token
    new_access_token = _generate_token()
    db["tokens"][new_access_token] = {
        "user_id": token_data["user_id"],
        "type": "access",
        "expires_at": (datetime.now() + timedelta(hours=TOKEN_EXPIRE_HOURS)).isoformat(),
    }
    
    _save_users(db)
    
    user = db["users"].get(token_data["user_id"])
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "expires_in": TOKEN_EXPIRE_HOURS * 3600,
        "user": _safe_user(user) if user else None,
    }


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """退出登录（注销 Token）"""
    db = _load_users()
    if token in db.get("tokens", {}):
        del db["tokens"][token]
        _save_users(db)
    return {"message": "已退出登录"}


@router.get("/me", response_model=UserProfile)
async def get_me(user: dict = Depends(get_current_user)):
    """获取当前用户信息"""
    return UserProfile(
        id=user["id"],
        username=user["username"],
        display_name=user["display_name"],
        email=user["email"],
        role=user["role"],
        organization=user.get("organization", ""),
        avatar=user.get("avatar", "🧑‍🔬"),
        joined_at=user.get("joined_at", ""),
        permissions=_get_role_permissions(user["role"]),
    )


@router.put("/me/password")
async def change_password(data: PasswordChange, user: dict = Depends(get_current_user)):
    """修改密码"""
    if user["password_hash"] != _hash_password(data.old_password):
        raise HTTPException(status_code=400, detail="原密码错误")
    
    db = _load_users()
    db["users"][user["id"]]["password_hash"] = _hash_password(data.new_password)
    _save_users(db)
    
    return {"message": "密码修改成功"}


@router.get("/users")
async def list_users(user: dict = Depends(get_current_user)):
    """列出所有用户（仅管理员）"""
    if user.get("role") not in ("admin", "manager"):
        raise HTTPException(status_code=403, detail="权限不足")
    
    db = _load_users()
    return {
        "users": [_safe_user(u) for u in db["users"].values()],
        "total": len(db["users"]),
    }


# ===================================================================
# Helpers
# ===================================================================

def _safe_user(user: dict) -> dict:
    """移除敏感字段"""
    return {k: v for k, v in user.items() if k != "password_hash"}


# ===================================================================
# Initialize default admin user
# ===================================================================

def init_default_users():
    """初始化默认用户（首次运行）"""
    db = _load_users()
    if db["users"]:
        return  # Already initialized
    
    defaults = [
        {"username": "admin", "password": "admin123", "display_name": "管理员", "email": "admin@photonics.io", "role": "admin", "organization": "平台运营"},
        {"username": "zhangwei", "password": "demo123", "display_name": "张伟", "email": "zhangwei@photonics.com", "role": "engineer", "organization": "MFLEX 光电事业部"},
        {"username": "lina", "password": "demo123", "display_name": "李娜", "email": "lina@university.edu", "role": "researcher", "organization": "清华大学光电工程系"},
        {"username": "wangming", "password": "demo123", "display_name": "王明", "email": "wangming@silicon.io", "role": "engineer", "organization": "SiPh Technologies"},
    ]
    
    avatars = {"admin": "🛡️", "engineer": "👨‍🔬", "researcher": "👩‍🎓", "manager": "👔", "student": "🧑‍🎓"}
    
    for u in defaults:
        user_id = secrets.token_hex(8)
        db["users"][user_id] = {
            "id": user_id,
            "username": u["username"],
            "password_hash": _hash_password(u["password"]),
            "display_name": u["display_name"],
            "email": u["email"],
            "role": u["role"],
            "organization": u["organization"],
            "avatar": avatars.get(u["role"], "🧑‍🔬"),
            "joined_at": datetime.now().isoformat(),
            "is_active": True,
        }
    
    _save_users(db)
    print(f"✓ 初始化 {len(defaults)} 个默认用户")
