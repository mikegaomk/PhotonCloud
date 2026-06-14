"""
光芯片互动平台后端 - FastAPI + GDSFactory 集成
与 GDSFactory/PDK 生态无缝对接

运行方式: uvicorn main:app --reload --port 8000
要求: Python >= 3.10, 安装 requirements.txt
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
import os
import json
import tempfile

app = FastAPI(
    title="光芯片互动平台 API",
    description="FastAPI + GDSFactory 后端，提供 PDK 管理、器件生成、S 参数计算等功能",
    version="1.0.0",
)

# CORS - 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Router
from auth import router as auth_router, get_current_user, init_default_users
app.include_router(auth_router)

# News Router
from app.routers.news import router as news_router
app.include_router(news_router)

@app.on_event("startup")
async def startup():
    init_default_users()
    # Start RSS scheduler
    from app.services.scheduler import news_scheduler
    news_scheduler.start()
    # Run first fetch immediately
    import asyncio
    asyncio.create_task(news_scheduler.run_pipeline())

# ===================================================================
# Data Models
# ===================================================================

class WaveguideParams(BaseModel):
    width: float = Field(0.5, description="波导宽度 (μm)", ge=0.1, le=5.0)
    length: float = Field(100.0, description="波导长度 (μm)", ge=1.0, le=10000.0)
    layer: tuple = (1, 0)

class MZIParams(BaseModel):
    delta_length: float = Field(10.0, description="臂长差 (μm)")
    arm_length: float = Field(200.0, description="臂长 (μm)")
    splitter: str = Field("mmi1x2", description="分束器类型: mmi1x2, y_branch, coupler")

class RingParams(BaseModel):
    radius: float = Field(10.0, description="环半径 (μm)", ge=3.0, le=100.0)
    gap: float = Field(0.2, description="耦合间隙 (μm)", ge=0.05, le=1.0)
    coupling_length: float = Field(5.0, description="耦合长度 (μm)")

class GratingParams(BaseModel):
    period: float = Field(0.63, description="光栅周期 (μm)")
    duty_cycle: float = Field(0.5, description="占空比", ge=0.2, le=0.8)
    n_periods: int = Field(20, description="周期数", ge=5, le=100)
    taper_length: float = Field(200.0, description="锥形过渡长度 (μm)")

class SParamRequest(BaseModel):
    component: str = Field(..., description="器件类型")
    freq_start: float = Field(1e9, description="起始频率 (Hz)")
    freq_end: float = Field(67e9, description="终止频率 (Hz)")
    n_points: int = Field(500, description="频率点数")
    params: dict = Field(default_factory=dict, description="器件参数")

class PDKUpload(BaseModel):
    name: str
    foundry: str
    version: str
    description: str

class IPBlackboxConfig(BaseModel):
    component_name: str
    protection_level: str = Field(..., description="blackbox | greybox | whitebox")
    expose_s_params: bool = True
    expose_layout: bool = False
    nda_required: bool = True
    nda_type: str = "standard"


# ===================================================================
# GDSFactory Integration Endpoints
# ===================================================================

@app.get("/")
async def root():
    return {"message": "光芯片互动平台 API", "version": "1.0.0", "gdsfactory": "integrated"}


@app.get("/api/pdk/components")
async def list_pdk_components(pdk: str = Query("generic", description="PDK名称")):
    """列出 PDK 中所有可用的参数化器件 (PCell)"""
    try:
        import gdsfactory as gf
        
        # 获取 gdsfactory 内置器件库
        cells = list(gf.components.cells.keys())
        
        # 按类别分组
        categories = {
            "waveguides": [c for c in cells if "straight" in c or "bend" in c or "waveguide" in c],
            "couplers": [c for c in cells if "coupler" in c or "mmi" in c],
            "rings": [c for c in cells if "ring" in c],
            "gratings": [c for c in cells if "grating" in c],
            "modulators": [c for c in cells if "mzi" in c or "phase_shifter" in c],
            "pads": [c for c in cells if "pad" in c],
            "routing": [c for c in cells if "route" in c],
            "other": [],
        }
        
        categorized = set()
        for cat_cells in categories.values():
            categorized.update(cat_cells)
        categories["other"] = [c for c in cells if c not in categorized]
        
        return {
            "pdk": pdk,
            "total_components": len(cells),
            "categories": {k: {"count": len(v), "components": v[:20]} for k, v in categories.items()},
        }
    except ImportError:
        return _mock_components(pdk)


@app.post("/api/gds/waveguide")
async def generate_waveguide(params: WaveguideParams):
    """生成波导 GDS 文件"""
    try:
        import gdsfactory as gf
        
        c = gf.components.straight(length=params.length, cross_section="strip")
        
        # 导出 GDS
        output_path = _temp_gds_path("waveguide")
        c.write_gds(output_path)
        
        return FileResponse(output_path, filename="waveguide.gds", media_type="application/octet-stream")
    except ImportError:
        return _mock_gds_response("waveguide", params.dict())


@app.post("/api/gds/mzi")
async def generate_mzi(params: MZIParams):
    """生成 MZI 干涉仪 GDS 文件"""
    try:
        import gdsfactory as gf
        
        c = gf.components.mzi(
            delta_length=params.delta_length,
            length_x=params.arm_length,
        )
        
        output_path = _temp_gds_path("mzi")
        c.write_gds(output_path)
        
        return FileResponse(output_path, filename="mzi.gds", media_type="application/octet-stream")
    except ImportError:
        return _mock_gds_response("mzi", params.dict())


@app.post("/api/gds/ring")
async def generate_ring(params: RingParams):
    """生成微环谐振器 GDS 文件"""
    try:
        import gdsfactory as gf
        
        c = gf.components.ring_single(
            radius=params.radius,
            gap=params.gap,
            length_x=params.coupling_length,
        )
        
        output_path = _temp_gds_path("ring")
        c.write_gds(output_path)
        
        return FileResponse(output_path, filename="ring_resonator.gds", media_type="application/octet-stream")
    except ImportError:
        return _mock_gds_response("ring", params.dict())


@app.post("/api/gds/grating_coupler")
async def generate_grating(params: GratingParams):
    """生成光栅耦合器 GDS 文件"""
    try:
        import gdsfactory as gf
        
        c = gf.components.grating_coupler_elliptical(
            period=params.period,
            n_periods=params.n_periods,
            taper_length=params.taper_length,
        )
        
        output_path = _temp_gds_path("grating")
        c.write_gds(output_path)
        
        return FileResponse(output_path, filename="grating_coupler.gds", media_type="application/octet-stream")
    except ImportError:
        return _mock_gds_response("grating_coupler", params.dict())


@app.post("/api/gds/custom")
async def generate_custom_component(component_name: str = Query(...), params: dict = {}):
    """通过器件名称和参数动态生成任意 GDSFactory 器件"""
    try:
        import gdsfactory as gf
        
        if component_name not in gf.components.cells:
            raise HTTPException(status_code=404, detail=f"Component '{component_name}' not found in PDK")
        
        cell_func = gf.components.cells[component_name]
        c = cell_func(**params)
        
        output_path = _temp_gds_path(component_name)
        c.write_gds(output_path)
        
        return FileResponse(output_path, filename=f"{component_name}.gds", media_type="application/octet-stream")
    except ImportError:
        return _mock_gds_response(component_name, params)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ===================================================================
# S-Parameter Generation
# ===================================================================

@app.post("/api/sparam/generate")
async def generate_s_parameters(request: SParamRequest):
    """
    自动生成器件 S 参数
    基于 GDSFactory compact model 或解析计算
    """
    try:
        import numpy as np
        
        freqs = np.linspace(request.freq_start, request.freq_end, request.n_points)
        
        # 根据器件类型计算 S 参数
        if request.component == "mzi":
            s_params = _compute_mzi_sparams(freqs, request.params)
        elif request.component == "ring":
            s_params = _compute_ring_sparams(freqs, request.params)
        elif request.component == "coupler":
            s_params = _compute_coupler_sparams(freqs, request.params)
        elif request.component == "phase_shifter":
            s_params = _compute_phase_shifter_sparams(freqs, request.params)
        elif request.component == "grating_coupler":
            s_params = _compute_grating_sparams(freqs, request.params)
        else:
            # 通用 2 端口透射模型
            s_params = _compute_generic_sparams(freqs, request.params)
        
        # 生成 Touchstone 格式
        touchstone = _format_touchstone(freqs, s_params, request.component)
        
        return {
            "component": request.component,
            "n_ports": s_params["n_ports"],
            "n_points": request.n_points,
            "freq_range": [request.freq_start, request.freq_end],
            "touchstone_preview": touchstone[:2000],
            "data_summary": {
                "s21_max_dB": float(np.max(s_params.get("s21_dB", [0]))),
                "s21_min_dB": float(np.min(s_params.get("s21_dB", [-30]))),
                "s11_max_dB": float(np.max(s_params.get("s11_dB", [-10]))),
                "bandwidth_3dB_GHz": float(s_params.get("bw_3dB", 0) / 1e9),
            },
        }
    except ImportError:
        return _mock_sparam_response(request)


@app.get("/api/sparam/download/{component}")
async def download_s_parameters(
    component: str,
    freq_start: float = 1e9,
    freq_end: float = 67e9,
    n_points: int = 500,
    format: str = "touchstone",
):
    """下载 S 参数文件 (.sNp / .csv)"""
    import numpy as np
    
    freqs = np.linspace(freq_start, freq_end, n_points)
    s_params = _compute_generic_sparams(freqs, {})
    touchstone = _format_touchstone(freqs, s_params, component)
    
    # 写入临时文件
    n_ports = s_params["n_ports"]
    ext = f".s{n_ports}p" if format == "touchstone" else ".csv"
    output_path = os.path.join(tempfile.gettempdir(), f"{component}{ext}")
    
    with open(output_path, "w") as f:
        f.write(touchstone)
    
    return FileResponse(output_path, filename=f"{component}{ext}")


# ===================================================================
# PDK Management
# ===================================================================

@app.post("/api/pdk/upload")
async def upload_pdk(file: UploadFile = File(...), name: str = "", foundry: str = "", version: str = "", user: dict = Depends(get_current_user)):
    """上传 PDK 包并自动解析（需要登录）"""
    if not file.filename.endswith(('.zip', '.tar.gz', '.pdk')):
        raise HTTPException(status_code=400, detail="Unsupported format. Use .zip, .tar.gz, or .pdk")
    
    # 保存文件
    upload_dir = os.path.join(tempfile.gettempdir(), "pdk_uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # 解析 PDK 结构 (模拟)
    return {
        "status": "uploaded",
        "filename": file.filename,
        "size_mb": len(content) / 1024 / 1024,
        "parsed": {
            "cells_found": 0,  # 实际会解析 GDS
            "models_found": 0,
            "drc_rules_found": 0,
            "layers_defined": 0,
        },
        "message": "PDK 已上传，正在后台解析组件库...",
    }


@app.get("/api/pdk/list")
async def list_pdks():
    """列出所有已注册的 PDK"""
    return {
        "pdks": [
            {"name": "generic", "version": "built-in", "description": "GDSFactory 内置通用 PDK", "components": 200},
            {"name": "CUMEC-SiPh180", "version": "3.2.1", "description": "CUMEC 180nm SOI 硅光", "components": 128},
            {"name": "SiOPT-SiN800", "version": "2.1.0", "description": "SiOPT 800nm SiN 低损耗", "components": 56},
        ]
    }


@app.get("/api/pdk/{pdk_name}/layers")
async def get_pdk_layers(pdk_name: str):
    """获取 PDK 层定义"""
    # GDSFactory PDK 层映射
    layers = {
        "generic": {
            "WG": (1, 0), "SLAB150": (2, 0), "SLAB90": (3, 0),
            "DEVREC": (68, 0), "PORT": (1, 10), "PORTE": (1, 11),
            "HEATER": (47, 0), "M1": (41, 0), "M2": (45, 0),
            "VIAC": (40, 0), "N": (20, 0), "P": (21, 0),
            "NP": (22, 0), "PP": (23, 0), "NPP": (24, 0), "PPP": (25, 0),
            "GE": (5, 0), "LABEL": (201, 0),
        }
    }
    return {"pdk": pdk_name, "layers": layers.get(pdk_name, layers["generic"])}


# ===================================================================
# IP Blackbox & NDA
# ===================================================================

@app.post("/api/ip/blackbox")
async def configure_ip_blackbox(config: IPBlackboxConfig, user: dict = Depends(get_current_user)):
    """配置 IP 黑盒化设置（需要登录）"""
    return {
        "status": "configured",
        "component": config.component_name,
        "protection": config.protection_level,
        "exposed": {
            "s_parameters": config.expose_s_params,
            "layout_gds": config.expose_layout,
            "compact_model": config.protection_level != "blackbox",
            "design_parameters": config.protection_level == "whitebox",
        },
        "nda": {
            "required": config.nda_required,
            "type": config.nda_type,
        },
    }


@app.get("/api/ip/nda/status")
async def get_nda_status():
    """获取 NDA 状态追踪"""
    return {
        "active_ndas": [
            {"id": "NDA-001", "party": "CompanyA", "foundry": "CUMEC", "expires": "2027-12-31", "status": "active", "ip_count": 5},
            {"id": "NDA-002", "party": "UniversityB", "foundry": "SiOPT", "expires": "2026-12-31", "status": "active", "ip_count": 12},
        ],
        "pending_requests": 3,
        "expired": 1,
    }


# ===================================================================
# Version Control
# ===================================================================

@app.get("/api/pdk/{pdk_name}/versions")
async def get_pdk_versions(pdk_name: str):
    """获取 PDK 版本历史"""
    return {
        "pdk": pdk_name,
        "versions": [
            {"version": "3.2.1", "date": "2026-06-01", "tag": "stable", "changes": "+12 components", "commits": 8},
            {"version": "3.2.0", "date": "2026-05-15", "tag": "stable", "changes": "新增 TiN heater", "commits": 15},
            {"version": "3.1.0", "date": "2026-04-20", "tag": "stable", "changes": "添加 SiN 层", "commits": 23},
        ],
        "branches": ["main", "develop", "feature/new-pd-model"],
    }


@app.post("/api/pdk/{pdk_name}/release")
async def create_pdk_release(pdk_name: str, version: str = "", changelog: str = "", user: dict = Depends(get_current_user)):
    """创建新的 PDK 版本发布（需要登录）"""
    return {
        "status": "released",
        "pdk": pdk_name,
        "version": version,
        "changelog": changelog,
        "timestamp": "2026-06-07T00:00:00Z",
    }


# ===================================================================
# Helper Functions
# ===================================================================

def _temp_gds_path(name: str) -> str:
    return os.path.join(tempfile.gettempdir(), f"{name}.gds")


def _compute_mzi_sparams(freqs, params):
    import numpy as np
    delta_L = params.get("delta_length", 10.0)  # μm
    n_eff = params.get("n_eff", 2.45)
    loss_per_cm = params.get("loss_dB_per_cm", 2.0)
    
    c = 3e8
    wavelength = c / freqs  # m
    delta_L_m = delta_L * 1e-6
    
    phi = 2 * np.pi * n_eff * delta_L_m / wavelength
    transmission = np.cos(phi / 2) ** 2
    loss = 10 ** (-loss_per_cm * delta_L / 10000 / 10)
    
    s21_linear = np.sqrt(transmission * loss)
    s21_dB = 20 * np.log10(np.maximum(s21_linear, 1e-10))
    s11_dB = 20 * np.log10(np.maximum(1 - s21_linear, 1e-10))
    
    bw_idx = np.where(s21_dB >= s21_dB.max() - 3)[0]
    bw_3dB = freqs[bw_idx[-1]] - freqs[bw_idx[0]] if len(bw_idx) > 1 else 0
    
    return {"n_ports": 4, "s21_dB": s21_dB.tolist(), "s11_dB": s11_dB.tolist(), "bw_3dB": bw_3dB}


def _compute_ring_sparams(freqs, params):
    import numpy as np
    radius = params.get("radius", 10.0)  # μm
    kappa = params.get("coupling", 0.15)
    n_eff = params.get("n_eff", 2.45)
    loss = params.get("loss_dB_per_cm", 3.0)
    
    c = 3e8
    L = 2 * np.pi * radius * 1e-6
    alpha = np.exp(-loss * 100 * L / 2)
    t = np.sqrt(1 - kappa**2)
    wavelength = c / freqs
    
    phi = 2 * np.pi * n_eff * L / wavelength
    through = (t**2 + (alpha)**2 - 2*t*alpha*np.cos(phi)) / (1 + (t*alpha)**2 - 2*t*alpha*np.cos(phi))
    s21_dB = 10 * np.log10(np.maximum(through, 1e-10))
    s11_dB = np.full_like(s21_dB, -30.0)
    
    return {"n_ports": 4, "s21_dB": s21_dB.tolist(), "s11_dB": s11_dB.tolist(), "bw_3dB": 0}


def _compute_coupler_sparams(freqs, params):
    import numpy as np
    kappa = params.get("coupling", 0.5)
    length = params.get("length", 10.0)
    
    cross = np.full(len(freqs), kappa**2)
    through = 1 - cross
    s21_dB = 10 * np.log10(np.maximum(through, 1e-10))
    s11_dB = np.full_like(s21_dB, -25.0)
    
    return {"n_ports": 4, "s21_dB": s21_dB.tolist(), "s11_dB": s11_dB.tolist(), "bw_3dB": freqs[-1] - freqs[0]}


def _compute_phase_shifter_sparams(freqs, params):
    import numpy as np
    vpi_l = params.get("vpi_l", 2.5)  # V·cm
    length = params.get("length", 3.0)  # mm
    loss = params.get("loss_dB_per_cm", 5.0)
    
    total_loss = loss * length / 10
    s21_linear = 10 ** (-total_loss / 20)
    s21_dB = np.full(len(freqs), 20 * np.log10(s21_linear))
    
    # Bandwidth roll-off (RC limited)
    f_3dB = params.get("bandwidth_GHz", 40.0) * 1e9
    roll_off = 1 / np.sqrt(1 + (freqs / f_3dB) ** 2)
    s21_dB = s21_dB + 20 * np.log10(roll_off)
    s11_dB = np.full_like(s21_dB, -15.0)
    
    return {"n_ports": 2, "s21_dB": s21_dB.tolist(), "s11_dB": s11_dB.tolist(), "bw_3dB": f_3dB}


def _compute_grating_sparams(freqs, params):
    import numpy as np
    center_freq = params.get("center_freq", 193.5e12)  # Hz (C-band)
    bandwidth = params.get("bandwidth_nm", 40.0) * 1e-9 * (3e8 / 1.55e-6**2)
    peak_efficiency = params.get("peak_efficiency", 0.5)
    
    detuning = (freqs - center_freq) / (bandwidth / 2)
    efficiency = peak_efficiency * np.exp(-detuning**2 / 2)
    s21_dB = 10 * np.log10(np.maximum(efficiency, 1e-10))
    s11_dB = 10 * np.log10(np.maximum(1 - efficiency, 1e-10))
    
    bw_idx = np.where(s21_dB >= s21_dB.max() - 3)[0]
    bw_3dB = freqs[bw_idx[-1]] - freqs[bw_idx[0]] if len(bw_idx) > 1 else 0
    
    return {"n_ports": 2, "s21_dB": s21_dB.tolist(), "s11_dB": s11_dB.tolist(), "bw_3dB": bw_3dB}


def _compute_generic_sparams(freqs, params):
    import numpy as np
    insertion_loss = params.get("insertion_loss_dB", 3.0)
    bandwidth = params.get("bandwidth_GHz", 50.0) * 1e9
    
    roll_off = 1 / np.sqrt(1 + (freqs / bandwidth) ** 4)
    s21_dB = -insertion_loss + 20 * np.log10(roll_off)
    s11_dB = np.full_like(s21_dB, -15.0) + 5 * np.log10(1 + (freqs / bandwidth)**2)
    
    return {"n_ports": 2, "s21_dB": s21_dB.tolist(), "s11_dB": s11_dB.tolist(), "bw_3dB": bandwidth}


def _format_touchstone(freqs, s_params, component):
    import numpy as np
    n_ports = s_params["n_ports"]
    header = f"""! Touchstone Format
# GHz S dB R 50
! Component: {component}
! Ports: {n_ports}
! Generated by: 光芯片互动平台 Backend (FastAPI + GDSFactory)
! Date: 2026-06-07
!
"""
    lines = [header]
    freqs_ghz = np.array(freqs) / 1e9
    s21 = np.array(s_params["s21_dB"])
    s11 = np.array(s_params["s11_dB"])
    
    for i in range(min(len(freqs_ghz), 50)):  # Preview first 50 points
        if n_ports == 2:
            lines.append(f"{freqs_ghz[i]:.4f}\t{s11[i]:.2f}\t0.0\t{s21[i]:.2f}\t-90.0\t{s21[i]:.2f}\t-90.0\t{s11[i]:.2f}\t0.0")
        else:
            lines.append(f"{freqs_ghz[i]:.4f}\t{s11[i]:.2f}\t0.0\t{s21[i]:.2f}\t-90.0\t{s21[i]:.2f}\t-90.0\t{s11[i]:.2f}\t0.0")
    
    return "\n".join(lines)


def _mock_components(pdk):
    """GDSFactory 未安装时的 mock 响应"""
    return {
        "pdk": pdk,
        "total_components": 200,
        "note": "GDSFactory not installed - showing mock data. Install with: pip install gdsfactory>=8",
        "categories": {
            "waveguides": {"count": 25, "components": ["straight", "bend_euler", "bend_circular", "taper", "waveguide"]},
            "couplers": {"count": 18, "components": ["coupler", "mmi1x2", "mmi2x2", "coupler_ring"]},
            "rings": {"count": 12, "components": ["ring_single", "ring_double", "ring_single_bus"]},
            "gratings": {"count": 8, "components": ["grating_coupler_elliptical", "grating_coupler_rectangular"]},
            "modulators": {"count": 10, "components": ["mzi", "mzi1x2", "mzi2x2", "phase_shifter_heater"]},
        },
    }


def _mock_gds_response(component, params):
    return JSONResponse({
        "status": "mock",
        "component": component,
        "params": params,
        "message": f"GDSFactory not available. In production, this returns a .gds file for '{component}'",
        "install": "pip install gdsfactory>=8 (requires Python>=3.10)",
    })


def _mock_sparam_response(request):
    return {
        "component": request.component,
        "n_ports": 2,
        "n_points": request.n_points,
        "freq_range": [request.freq_start, request.freq_end],
        "touchstone_preview": "! Mock S-parameter data\n# GHz S dB R 50\n1.0000\t-20.0\t0.0\t-3.0\t-90.0\n",
        "data_summary": {"s21_max_dB": -2.5, "s21_min_dB": -25.0, "s11_max_dB": -12.0, "bandwidth_3dB_GHz": 45.0},
        "note": "numpy not available - mock response",
    }


# ===================================================================
# Run
# ===================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
