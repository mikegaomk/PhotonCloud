# 光芯片互动平台后端

FastAPI + GDSFactory 集成后端，与 GDSFactory/PDK 生态无缝对接。

## 环境要求

- Python >= 3.10
- pip install -r requirements.txt

## 启动服务

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API 文档

启动后访问:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 功能模块

### 1. GDSFactory 器件生成

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/pdk/components` | GET | 列出 PDK 所有参数化器件 |
| `/api/gds/waveguide` | POST | 生成波导 GDS |
| `/api/gds/mzi` | POST | 生成 MZI 干涉仪 GDS |
| `/api/gds/ring` | POST | 生成微环谐振器 GDS |
| `/api/gds/grating_coupler` | POST | 生成光栅耦合器 GDS |
| `/api/gds/custom` | POST | 动态生成任意 GDSFactory 器件 |

### 2. S 参数自动生成

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/sparam/generate` | POST | 基于 compact model 生成 S 参数 |
| `/api/sparam/download/{component}` | GET | 下载 Touchstone/CSV 文件 |

支持器件：MZI, Ring, Coupler, Phase Shifter, Grating Coupler, Generic

### 3. PDK 管理

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/pdk/upload` | POST | 上传 PDK 包 (.zip/.tar.gz) |
| `/api/pdk/list` | GET | 列出所有已注册 PDK |
| `/api/pdk/{name}/layers` | GET | 获取层定义 |
| `/api/pdk/{name}/versions` | GET | 版本历史 |
| `/api/pdk/{name}/release` | POST | 创建新版本 |

### 4. IP 黑盒化 & NDA

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/ip/blackbox` | POST | 配置 IP 保护级别 |
| `/api/ip/nda/status` | GET | NDA 追踪状态 |

### 5. 多工具映射

通过 PDK 组件元数据，自动映射到:
- Lumerical INTERCONNECT (.lsf)
- Synopsys OptoDesigner (.oaLib)
- IPKISS (Python cells)
- KLayout (GDS + DRC)
- Cadence Virtuoso (CDF)

## GDSFactory 集成说明

本后端直接调用 `gdsfactory` 的参数化单元 (PCell) 生成 GDS：

```python
import gdsfactory as gf

# 所有 GDSFactory 内置器件均可通过 API 调用
c = gf.components.mzi(delta_length=10.0)
c.write_gds("mzi.gds")

# 也支持 PDK 特定器件
from gdsfactory.generic_tech import get_generic_pdk
pdk = get_generic_pdk()
pdk.activate()
```

## 前端对接

前端 (React) 通过 fetch 调用后端 API：
```typescript
const response = await fetch('http://localhost:8000/api/gds/mzi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ delta_length: 10, arm_length: 200 })
});
const blob = await response.blob();
// 下载 GDS 文件
```
