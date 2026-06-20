export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  sourceUrl: string
  date: string
  category: 'industry' | 'research' | 'policy' | 'funding' | 'product' | 'standard'
  region: 'global' | 'china' | 'us' | 'europe' | 'japan' | 'korea'
  chipTags: string[]
  importance: 'high' | 'medium' | 'low'
  content: string
}

export interface TechUpdate {
  id: string
  title: string
  description: string
  date: string
  type: 'breakthrough' | 'product-launch' | 'partnership' | 'funding' | 'standard' | 'milestone'
  region: 'global' | 'china' | 'us' | 'europe' | 'japan'
  relatedChips: string[]
}

export const categoryLabelsNews: Record<string, { label: string; color: string }> = {
  industry: { label: '产业动态', color: '#3b82f6' },
  research: { label: '科研突破', color: '#8b5cf6' },
  policy: { label: '政策法规', color: '#ef4444' },
  funding: { label: '投融资', color: '#f97316' },
  product: { label: '产品发布', color: '#22c55e' },
  standard: { label: '标准进展', color: '#6366f1' },
}

export const regionLabels: Record<string, { label: string; flag: string }> = {
  global: { label: '全球', flag: '🌍' },
  china: { label: '中国', flag: '🇨🇳' },
  us: { label: '美国', flag: '🇺🇸' },
  europe: { label: '欧洲', flag: '🇪🇺' },
  japan: { label: '日本', flag: '🇯🇵' },
  korea: { label: '韩国', flag: '🇰🇷' },
}

const NEWS_STORAGE_KEY = 'photonics_news'

const initialNews: NewsItem[] = [
  {
    id: 'auto_e9c1126c',
    title: 'Marvell and Tower pass 5M PIC milestone',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124510/Marvell_and_Tower_pass_5M_PIC_milestone',
    date: '2026-06-20',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Marvell and Tower pass 5M PIC milestone\n\nMarvell and Tower Semiconductor have shipped more than five million coherent photonic integrated circuits, underscoring the growing role of silicon photonics in AI-driven data center networks.\n\nMarvell Technology and Tower Semiconductor have announced the shipment of more than five million coherent photonic integrated circuits (PICs), marking a significant milestone for silicon photonics deployment in high-speed optical networking.\n\nThe coherent PICs are being supplied to Marvell customers worldwide and are designed to support the increasing bandwidth and energy-efficiency demands of AI-driven data center interconnect (DCI) infrastructure.\n\nThe companies said the milestone reflects growing adoption of coherent optical technologies, which `,
  },
  {
    id: 'auto_288cc1a5',
    title: 'Tower and Marvell reach PIC milestone',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124504/Tower_and_Marvell_reach_PIC_milestone',
    date: '2026-06-19',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: ``,
  },
  {
    id: 'auto_2965b657',
    title: 'Keysight expands photonics portfolio',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124491/Keysight_expands_photonics_portfolio',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: ``,
  },
  {
    id: 'auto_96e26afa',
    title: 'China launches photonic AI lab',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124483/China_launches_photonic_AI_lab',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonic Computing"],
    importance: 'high',
    content: ``,
  },
  {
    id: 'auto_d51dac38',
    title: 'PICs complement electronic circuits',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124465/PICs_complement_electronic_circuits',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: ``,
  },
  {
    id: 'auto_53a4d6e9',
    title: 'NTT launches $440M photonics fund',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124448/NTT_launches_440M_photonics_fund',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'high',
    content: ``,
  },
  {
    id: 'auto_0f52f027',
    title: 'PhotonVentures on PIC investment',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124437/PhotonVentures_on_PIC_investment',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: ``,
  },
  {
    id: 'n1',
    title: 'NVIDIA 宣布下一代 AI GPU 将全面采用 CPO 光互连',
    summary: 'NVIDIA 在 GTC 2026 上发布 Blackwell Ultra 架构路线图...',
    source: 'NVIDIA GTC 2026',
    sourceUrl: 'https://nvidia.com',
    date: '2026-06-02',
    category: 'product',
    region: 'us',
    chipTags: ['CPO', 'Silicon Photonics'],
    importance: 'high',
    content: `NVIDIA CEO 黄仁勋在 GTC 2026 主题演讲中宣布...`
  },
  {
    id: 'n999',
    title: '新闻标题',
    summary: '一两句摘要',
    source: '来源名称',
    sourceUrl: 'https://...',
    date: '2026-06-17',
    category: 'research',
    region: 'china',
    chipTags: ['Silicon Photonics', 'CPO'],
    importance: 'high',
    content: `详细内容，支持 Markdown 格式...`
  },
  {
    id: 'n1',
    title: 'NVIDIA 宣布下一代 AI GPU 将全面采用 CPO 光互连',
    summary: 'NVIDIA 在 GTC 2026 上发布 Blackwell Ultra 架构路线图，确认 2027 年 GPU 集群将标配 CPO 光 I/O，单 GPU 光互连带宽达 3.2 Tbps。',
    source: 'NVIDIA GTC 2026',
    sourceUrl: 'https://nvidia.com',
    date: '2026-06-02',
    category: 'product',
    region: 'us',
    chipTags: ['CPO', 'Silicon Photonics'],
    importance: 'high',
    content: `NVIDIA CEO 黄仁勋在 GTC 2026 主题演讲中宣布，下一代 Blackwell Ultra GPU 将原生支持 Co-Packaged Optics (CPO) 光互连。

## 关键信息

- 单 GPU 光 I/O 带宽：3.2 Tbps（4 个光引擎 × 800G）
- 合作伙伴：Ayar Labs（光引擎）、Broadcom（Switch ASIC）
- 互连拓扑：全光 NVLink，支持万卡级训练集群
- 功耗节省：相比电互连减少 40% I/O 功耗
- 量产时间线：2027 H2

## 产业影响

这标志着 CPO 从数据中心交换机扩展到 AI 加速器领域，将大幅拉动硅光 PIC、CW 激光器和光纤连接器需求。预计 2027-2028 年 CPO 市场将进入爆发期。`,
  },
  {
    id: 'n2',
    title: '铌奥光电完成 C 轮融资 15 亿元，加速 TFLN 量产',
    summary: '国内 TFLN 领军企业铌奥光电宣布完成 C 轮 15 亿元人民币融资，将用于建设首条 TFLN 调制器规模化产线，目标月产能 5000 片。',
    source: '36氪',
    sourceUrl: 'https://36kr.com',
    date: '2026-05-28',
    category: 'funding',
    region: 'china',
    chipTags: ['TFLN'],
    importance: 'high',
    content: `铌奥光电（NOEIC）宣布完成 C 轮 15 亿元融资，由国家集成电路产业投资基金二期领投，红杉中国、高瓴创投跟投。

## 融资用途

1. 建设 4 英寸 LNOI 晶圆产线（月产能 5000 片）
2. 100+ GHz TFLN IQ 调制器量产工艺开发
3. 与国内 DSP 厂商联合开发驱动方案
4. 800G/1.6T 相干模块送样认证

## 技术进展

- Vπ 已做到 1.1V（20mm 长度）
- EO 带宽 >110 GHz
- 插入损耗 <2.5 dB（含耦合）
- 已通过 Telcordia 可靠性认证

## 行业点评

TFLN 被视为中国在高端光芯片领域实现弯道超车的重要赛道。传统 InP 调制器被 Lumentum/Coherent 垄断，而 TFLN 中国在研发和产业化方面具备全球竞争力。`,
  },
  {
    id: 'n3',
    title: 'Intel 发布 Si₃N₄ 集成光放大器，增益达 30 dB',
    summary: 'Intel Labs 在 ECOC 2026 上展示了首款与硅光平台完全兼容的 Er:SiN 片上光放大器，净增益 30 dB，为 CPO 和光计算提供关键的片上功率补偿能力。',
    source: 'ECOC 2026',
    sourceUrl: 'https://intel.com',
    date: '2026-05-20',
    category: 'research',
    region: 'us',
    chipTags: ['Optical Amplifier', 'Silicon Photonics'],
    importance: 'high',
    content: `Intel Labs 在欧洲光通信大会 (ECOC 2026) 上发布了突破性的片上光放大器技术。

## 技术突破

- 材料：Er³⁺ 掺杂 Si₃N₄（共溅射工艺）
- 净增益：30 dB（器件长度 8 cm 螺旋波导）
- 噪声系数：4.5 dB
- 带宽：覆盖整个 C-band (1530-1565 nm)
- 泵浦：片上集成 980 nm 泵浦耦合
- 兼容性：与 Intel 硅光 PDK 完全集成

## 意义

片上光放大是长期制约集成光子规模化的瓶颈。30 dB 增益意味着：
- 光计算网络可支持 >100 级 MZI
- CPO 光引擎无需外部 EDFA 补偿
- 片上 WDM 系统可实现更多通道

Intel 表示将在 2027 年的硅光 PDK 中提供该器件的设计套件。`,
  },
  {
    id: 'n4',
    title: '中国科学院实现 200 光子量子计算优越性验证',
    summary: '中科大潘建伟团队在"九章三号"上实现 200 光子纠缠态操纵，相比经典超算快 10²⁴ 倍，刷新光量子计算世界记录。',
    source: 'Science (2026)',
    sourceUrl: 'https://science.org',
    date: '2026-05-15',
    category: 'research',
    region: 'china',
    chipTags: ['Quantum Photonics'],
    importance: 'high',
    content: `中国科学技术大学潘建伟、陆朝阳团队在 Science 发表论文，报道"九章三号"光量子计算机实现 200 光子的高斯玻色采样。

## 核心成果

- 光子数：200（九章一号 76 光子 → 二号 113 → 三号 200）
- 采样速率：比经典最快超算快 10²⁴ 倍
- 光子不可区分性：>97%（量子点确定性光源）
- 集成度：首次使用片上 SiN 干涉网络（320 模式）

## 技术进步

1. 量子点光源效率从 60% → 92%
2. 时间复用方案将有效光子数倍增
3. SNSPD 探测效率 >98%
4. 集成 SiN PIC 替代分立光学元件

## 意义

这是中国在量子计算领域持续保持全球领先的又一重大成果，也验证了集成光子平台在大规模量子系统中的可行性。`,
  },
  {
    id: 'n5',
    title: 'Broadcom 发布 Tomahawk 6：首款 CPO-native 交换芯片',
    summary: 'Broadcom 正式发布 Tomahawk 6 交换 ASIC，102.4 Tbps 容量，原生支持 CPO 光引擎接口，标志着 CPO 从概念走向标准产品。',
    source: 'Broadcom',
    sourceUrl: 'https://broadcom.com',
    date: '2026-05-10',
    category: 'product',
    region: 'us',
    chipTags: ['CPO', 'Silicon Photonics'],
    importance: 'high',
    content: `Broadcom 发布新一代以太网交换芯片 Tomahawk 6 (BCM78900)，首次原生集成 CPO 光引擎接口。

## 规格

- 交换容量：102.4 Tbps
- 端口：64 × 1.6T 或 128 × 800G
- 光引擎接口：16 个 CPO 光引擎位
- Die-to-die：UCIe 2.0 optical ready
- 工艺：3nm TSMC
- TDP：~450W

## CPO 集成方案

- 光引擎合作伙伴：Ayar Labs、Ranovus
- 单光引擎：6.4 Tbps (8×800G)
- 光源：外部 CW 激光器模块（共享）
- 连接器：blind-mate MPO-64

## 市场定位

面向 2027-2028 年超大规模数据中心和 AI 集群。Google、Microsoft、Meta 均已启动基于 Tomahawk 6 的 CPO 交换机设计。`,
  },
  {
    id: 'n6',
    title: '华为发布 800G 硅光相干模块，国产化率达 90%',
    summary: '华为光网络在 MWC Shanghai 2026 发布自研 800G ZR+ 硅光相干模块，核心器件包括硅光 PIC、DSP 和 CW 激光器均实现国产化。',
    source: 'MWC Shanghai 2026',
    sourceUrl: 'https://huawei.com',
    date: '2026-06-05',
    category: 'product',
    region: 'china',
    chipTags: ['Silicon Photonics', 'CW Laser'],
    importance: 'high',
    content: `华为光网络在 MWC Shanghai 2026 上正式发布自研 800G ZR+ 硅光相干光模块。

## 技术亮点

- 调制格式：DP-16QAM @ 96 Gbaud
- 硅光 PIC：自研，含 IQ 调制器 + 相干接收机 + VOA
- DSP：自研相干 DSP ASIC
- 光源：国产窄线宽 CW 激光器 (<50 kHz)
- 封装：QSFP-DD800
- 传输距离：DCI 120km 无补偿

## 国产化进展

- 硅光 PIC：华为海思 + 国内 foundry
- CW Laser：源杰科技/中科光芯
- DSP：华为海思自研
- 国产化率：约 90%

## 行业影响

这是中国首款完全自主可控的 800G 相干模块，打破了 Cisco/Acacia、Marvell 的技术垄断。对中国运营商和互联网企业的战略意义重大。`,
  },
  {
    id: 'n7',
    title: 'PsiQuantum 宣布首台容错光量子计算机原型完成制造',
    summary: 'PsiQuantum 宣布其基于融合型 (FBQC) 架构的光量子计算机原型已在 GlobalFoundries 完成制造，集成 100 万+ 光子器件。',
    source: 'PsiQuantum',
    sourceUrl: 'https://psiquantum.com',
    date: '2026-04-22',
    category: 'industry',
    region: 'us',
    chipTags: ['Quantum Photonics', 'Silicon Photonics'],
    importance: 'high',
    content: `PsiQuantum 宣布其容错光量子计算机原型 "Omega" 已在 GlobalFoundries 300mm 晶圆厂完成制造。

## 系统规模

- 光子 PIC 芯片：64 片（每片 ~16000 光子器件）
- 总器件数：>100 万
- 光纤延迟线：>100 km 超低损耗光纤
- SNSPD 数量：>4000 通道（0.8K 制冷）
- 控制 FPGA：数百个

## FBQC 架构亮点

- 不依赖确定性双光子门
- 融合成功率 >75%（超过容错阈值 50%）
- 模块化设计，可线性扩展
- 基于 GlobalFoundries 45CLO 硅光 PDK

## 下一步

- 2026 Q3：系统集成和首次运行
- 2027：实现量子纠错码验证
- 2029：目标 100 逻辑量子比特（容错）

## 意义

这是全球首台在商业级半导体工厂制造的百万器件级量子计算机，验证了光子路线的可制造性。`,
  },
  {
    id: 'n8',
    title: '工信部发布《光电子芯片产业发展行动计划（2026-2030）》',
    summary: '中国工信部联合发改委发布光电子芯片五年行动计划，目标 2030 年关键光芯片自主化率达 80%，设立 500 亿元专项基金。',
    source: '工信部',
    sourceUrl: 'https://miit.gov.cn',
    date: '2026-04-15',
    category: 'policy',
    region: 'china',
    chipTags: ['EML', 'CW Laser', 'Silicon Photonics', 'TFLN'],
    importance: 'high',
    content: `中国工业和信息化部联合国家发展改革委发布《光电子芯片产业发展行动计划（2026-2030）》。

## 核心目标

- 2030 年关键光芯片自主化率 ≥80%（当前约 40%）
- 培育 5 家以上世界级光芯片企业
- 建成 3-5 条光芯片规模化产线
- 光芯片产业规模突破 1000 亿元

## 重点方向

1. **高速调制器芯片**：EML (100G+)、TFLN (800G+)
2. **硅光集成**：自主硅光 PDK 和代工能力
3. **光源芯片**：窄线宽 CW、量子点激光器
4. **光放大器**：片上 EDFA、SOA 集成
5. **CPO 技术**：光电共封装全栈能力
6. **量子光子**：QKD 实用化、光量子计算

## 政策支持

- 设立 500 亿元光电子芯片专项基金
- 税收优惠：光芯片企业"五免五减半"
- 人才计划：每年培养 5000+ 光电子人才
- 标准体系：牵头制定 20+ 国际标准

## 产业界反应

多家上市公司股价大涨，光库科技、源杰科技、中际旭创等涨停。`,
  },
  {
    id: 'n9',
    title: 'Lightmatter 第二代光 AI 芯片突破 2000 TOPS',
    summary: 'Lightmatter 发布第二代光计算芯片 Envise 2.0，等效算力达 2000+ TOPS，能效 <0.5 pJ/MAC，首次在 GPT-2 推理中超越 NVIDIA A100。',
    source: 'Lightmatter',
    sourceUrl: 'https://lightmatter.co',
    date: '2026-05-05',
    category: 'product',
    region: 'us',
    chipTags: ['Photonic Computing'],
    importance: 'high',
    content: `Lightmatter 发布其第二代光 AI 加速器芯片 Envise 2.0。

## 核心指标

- 等效算力：2000+ TOPS (INT4)
- 能效：0.3-0.5 pJ/MAC
- 矩阵规模：256×256
- WDM 通道：16 波长并行
- 时钟频率：10 GHz 光学时钟
- 精度：等效 4-6 bit

## vs NVIDIA A100 (INT4 模式)

| 指标 | Envise 2.0 | A100 |
|------|-----------|------|
| TOPS | 2000+ | 624 |
| 能效 (TOPS/W) | 400+ | 2.5 |
| 延迟 (GPT-2 token) | 0.8 ms | 3.2 ms |
| 功耗 | 5W (光计算核心) | 250W |

## 技术改进

1. 非易失 PCM 权重：无需持续热调谐
2. 片上 Er:Al₂O₃ 放大器补偿级联损耗
3. 改进的 PD 阵列噪声设计
4. 16λ WDM 提升并行度 16×

## 商业进展

已与多家云厂商签署试用协议，预计 2027 年开始小批量部署。`,
  },
  {
    id: 'n10',
    title: 'IEEE 802.3df 1.6T Ethernet 标准正式发布',
    summary: 'IEEE 正式批准 802.3df 标准，定义 1.6 Terabit Ethernet 物理层规范，包括基于硅光和 TFLN 的 200G/lane 光接口。',
    source: 'IEEE',
    sourceUrl: 'https://ieee.org',
    date: '2026-04-01',
    category: 'standard',
    region: 'global',
    chipTags: ['Silicon Photonics', 'TFLN', 'EML'],
    importance: 'high',
    content: `IEEE 802.3df 工作组正式发布 1.6 Terabit Ethernet 标准。

## 标准要点

- 数据速率：1.6 Tbps（8×200G 或 16×100G）
- 光接口：
  - 1.6T-DR8：8λ × 200G PAM4, 500m
  - 1.6T-FR8：8λ × 200G PAM4, 2km
  - 1.6T-LR8：8λ × 200G PAM4, 10km
- 调制格式：200G/lane PAM4 (106.25 Gbaud)
- 光源选项：EML、SiPh MZM、TFLN MZM

## 技术挑战

- 106 Gbaud PAM4 要求 >70 GHz 器件带宽
- EML 难以达标 → SiPh/TFLN 成为主要方案
- DSP 功耗增加 → CPO 成为必要选项
- 光纤连接器需支持 16+ 通道

## 产业影响

1.6T 标准的发布将加速：
- TFLN 调制器的商用化
- CPO 光引擎的标准化
- 下一代 DSP ASIC 的开发
- 光纤连接器密度提升`,
  },
  {
    id: 'n11',
    title: '中际旭创 2026Q1 硅光模块出货量突破 1000 万只',
    summary: '中际旭创公布 2026 年第一季度业绩，400G/800G 硅光模块出货超 1000 万只，同比增长 180%，AI 集群需求驱动增长。',
    source: '中际旭创公告',
    sourceUrl: 'https://innolight.com',
    date: '2026-04-20',
    category: 'industry',
    region: 'china',
    chipTags: ['Silicon Photonics', 'EML'],
    importance: 'medium',
    content: `中际旭创（InnoLight）发布 2026 年 Q1 季度报告，硅光模块业务创历史新高。

## 业绩亮点

- 400G/800G 模块出货：>1000 万只
- 营收：人民币 180 亿元（同比 +180%）
- 毛利率：38%（同比 +5 个百分点）
- AI 客户占比：>60%

## 产品结构

- 800G DR8/FR4：占比 45%（增长最快）
- 400G DR4/FR4：占比 40%
- 1.6T 样品：已送样 Google、Microsoft
- CPO 光引擎：联合开发中

## 增长驱动

1. 全球 AI 训练集群建设（NVIDIA H100/B200）
2. 中国互联网厂商大模型基建
3. 800G 升级周期启动
4. 市占率从 25% 提升至 35%

## 展望

公司表示 2026 全年硅光模块出货有望突破 4000 万只，1.6T 模块预计 2027 年量产。`,
  },
  {
    id: 'n12',
    title: 'OIF 发布 CPO 互操作性测试规范 v2.0',
    summary: 'OIF（光互联网论坛）正式发布 CPO 互操作性测试规范 2.0 版，统一了光引擎与 ASIC 的电气和光学接口标准。',
    source: 'OIF',
    sourceUrl: 'https://oiforum.com',
    date: '2026-03-18',
    category: 'standard',
    region: 'global',
    chipTags: ['CPO', 'Silicon Photonics', 'CW Laser'],
    importance: 'medium',
    content: `OIF 发布 CPO 互操作性测试规范 v2.0，这是 CPO 标准化的重要里程碑。

## 规范要点

- 光引擎电气接口：UCIe 2.0 compatible (112G/lane NRZ)
- 光学接口：CW-WDM 8λ (O-band) 或 DWDM 8λ (C-band)
- 光源接口：标准化 CW 激光器模块 footprint
- 热接口：定义光引擎最大热阻 <1°C/W
- 连接器：blind-mate 光纤接口 (MPO-32/64)
- 测试方法：标准 eye mask、TDECQ、OMA

## 参与厂商

Broadcom、Intel、NVIDIA、Ayar Labs、Ranovus、Marvell、Cisco、Google、Microsoft、Meta 等 30+ 家企业参与制定。

## 意义

统一标准将促进 CPO 生态系统形成，使不同厂商的光引擎和 ASIC 可以互操作，降低系统集成风险和成本。`,
  },
  {
    id: 'n13',
    title: '硅光产业面临规模化挑战：CORNERSTONE 报告揭示 465 亿美元市场的关键瓶颈',
    summary: '硅光子技术预计到 2035 年将产生至少 465 亿美元收入，但众多企业在从研发走向量产的过程中面临严峻挑战。',
    source: 'New Electronics / CORNERSTONE',
    sourceUrl: 'https://www.newelectronics.co.uk/content/blogs/silicon-photonics-growth-risks-constrained-by-scale-up-challenges',
    date: '2026-06-17',
    category: 'industry',
    region: 'global',
    chipTags: ['Silicon Photonics', 'CPO'],
    importance: 'high',
    content: `CORNERSTONE 最新市场研究报告指出，硅光子技术正处于关键十字路口。

## 核心发现

- 硅光子技术预计到 2035 年将产生至少 465 亿美元收入
- 该技术日益被视为国家科技战略的关键组成部分
- 然而许多企业在从开发阶段迈向量产时遇到重大困难

## 主要挑战

- 制造良率从实验室到工厂的转化
- 测试和封装成本控制
- 设计工具和 PDK 生态系统不够成熟
- 人才短缺

## 市场趋势

AI 数据中心需求正在加速硅光产业化进程，CPO（共封装光学）和 800G/1.6T 模块成为主要增长驱动力。`,
  },
  {
    id: 'n14',
    title: '中国成立光子学国家实验室：以光芯片突破 AI 算力瓶颈',
    summary: '面对美国芯片出口管制，中国启动光子计算国家实验室，目标用光芯片为 AI 训练提供替代算力路径。',
    source: 'South China Morning Post',
    sourceUrl: 'https://www.scmp.com/tech/tech-war/article/3356901/facing-us-chip-curbs-china-launches-photonics-lab-power-ai-light',
    date: '2026-06-12',
    category: 'policy',
    region: 'china',
    chipTags: ['Photonic Computing', 'Silicon Photonics', 'AI Accelerator'],
    importance: 'high',
    content: `面对美国持续升级的芯片出口管制，中国正式启动光子计算国家实验室。

## 背景

全球科技公司竞相争夺训练和运行日益复杂 AI 模型所需的大规模算力。传统硅半导体在能耗和性能方面正逼近物理极限。

## 战略意义

- 光子计算提供了绕过传统芯片限制的替代路径
- 光芯片在特定 AI 工作负载上具有数量级的能效优势
- 中国希望在光子 AI 加速领域建立自主技术体系

## 研究方向

- 光子矩阵乘法加速器
- 光电混合 AI 推理芯片
- 硅光互连与光计算融合架构`,
  },
  {
    id: 'n15',
    title: '新型全集成光芯片：单片实现光生成、调控和探测',
    summary: '科学家创造出可在单个芯片上同时生成、引导和读取光信息的器件，是迈向超快低能耗计算的重大突破。',
    source: 'Science Daily',
    sourceUrl: 'https://www.sciencedaily.com/releases/2026/06/260601025343.htm',
    date: '2026-06-01',
    category: 'research',
    region: 'us',
    chipTags: ['Photonic Integration', 'Quantum Computing', 'AI Accelerator'],
    importance: 'high',
    content: `科学家创造了一种微型芯片，能在单一器件上同时生成、引导和读取光信息，标志着向超快、低能耗计算迈出重大一步。

## 技术突破

- 首次在单个芯片上集成光源、调制器和探测器
- 无需外部激光器或光耦合
- 适用于 AI 加速和量子计算

## 意义

这一成果解决了光子集成中的核心瓶颈——异构光源集成问题，为全光计算处理器的实现铺平道路。`,
  },
  {
    id: 'n16',
    title: 'ASU 获 NSF CAREER 奖：开发开源光电芯片设计自动化平台',
    summary: '亚利桑那州立大学获 NSF 资助，开发开源电子-光子协同设计自动化生态系统，推动下一代光芯片设计民主化。',
    source: 'Arizona State University',
    sourceUrl: 'https://ecee.engineering.asu.edu/2026/06/16/illuminating-the-future-of-photonic-ai-chip-design/',
    date: '2026-06-16',
    category: 'research',
    region: 'us',
    chipTags: ['EDA', 'Photonic Design', 'Open Source'],
    importance: 'medium',
    content: `亚利桑那州立大学 Fulton 工程学院获得 2026 年 NSF CAREER 奖，用于开发开源电子-光子设计自动化 (EPDA) 生态系统。

## 项目目标

- 建立开源的光子芯片 EDA 工具链
- 降低光子集成电路设计门槛
- 促进学术界和产业界的光芯片创新

## 意义

目前光子芯片设计工具主要由少数商业公司垄断，开源 EPDA 工具将使更多研究者和初创公司能够参与光子芯片设计，加速整个行业的创新速度。`,
  },
]

const initialUpdates: TechUpdate[] = [
  { id: 'u1', title: 'TSMC 开放 3nm 硅光 PDK', description: '台积电向客户开放基于 N3E 的硅光设计套件，支持 50+ GHz 调制器和 Ge-PD', date: '2026-06-01', type: 'milestone', region: 'global', relatedChips: ['Silicon Photonics'] },
  { id: 'u2', title: 'HyperLight TFLN 调制器获 $200M D轮融资', description: '估值达 $2B，计划 2027 年实现月产万片规模', date: '2026-05-25', type: 'funding', region: 'us', relatedChips: ['TFLN'] },
  { id: 'u3', title: '中科院成功研制 InAs 量子点激光器直接在 Si 上生长', description: '室温连续运行 >10000 小时，为硅光片上光源提供新路径', date: '2026-05-18', type: 'breakthrough', region: 'china', relatedChips: ['CW Laser', 'Silicon Photonics'] },
  { id: 'u4', title: 'Ayar Labs 与 Google 签署 CPO 量产合同', description: '首批 10 万套光引擎将用于 Google TPU v6 集群', date: '2026-05-12', type: 'partnership', region: 'us', relatedChips: ['CPO'] },
  { id: 'u5', title: '源杰科技 100G EML 芯片通过客户认证', description: '国产首款 100G/lane EML 通过 Tier-1 客户系统测试，计划 Q4 量产', date: '2026-05-08', type: 'product-launch', region: 'china', relatedChips: ['EML'] },
  { id: 'u6', title: 'Xanadu 发布 PennyLane 2.0 光量子编程框架', description: '支持混合光子-超导量子计算，新增 FBQC 模拟器', date: '2026-04-30', type: 'product-launch', region: 'global', relatedChips: ['Quantum Photonics'] },
  { id: 'u7', title: '华为与长飞光纤联合发布多芯光纤 CPO 方案', description: '单根光纤 32 芯，支持 CPO 光引擎 6.4 Tbps 单纤互连', date: '2026-04-25', type: 'partnership', region: 'china', relatedChips: ['CPO'] },
  { id: 'u8', title: 'Coherent 发布 S+C+L 120nm 超宽带 EDFA', description: '三波段一体化放大，总容量提升 3×，用于下一代海底系统', date: '2026-04-18', type: 'product-launch', region: 'us', relatedChips: ['Optical Amplifier'] },
  { id: 'u9', title: '日本 NTT IOWN 网络完成全光交换验证', description: '端到端光路径无 O-E-O 转换，延迟降低 200×', date: '2026-04-10', type: 'milestone', region: 'japan', relatedChips: ['Silicon Photonics', 'Optical Amplifier'] },
  { id: 'u10', title: '曦智科技光计算芯片获阿里云 AI 推理部署', description: '首次在商业云环境部署光计算加速器，推理效率提升 5×', date: '2026-04-05', type: 'partnership', region: 'china', relatedChips: ['Photonic Computing'] },
  { id: 'u11', title: 'Lumentum 发布 200mW 高功率窄线宽 CW 激光器', description: '线宽 <10 kHz，WPE 42%，专为 CPO 和相干系统设计', date: '2026-03-28', type: 'product-launch', region: 'us', relatedChips: ['CW Laser'] },
  { id: 'u12', title: '欧盟 Chips Act 追加 €2B 光子学专项', description: '覆盖硅光制造、TFLN 产业化和量子光子学', date: '2026-03-20', type: 'funding', region: 'europe', relatedChips: ['Silicon Photonics', 'TFLN', 'Quantum Photonics'] },
]

export function getNews(): NewsItem[] {
  const stored = localStorage.getItem(NEWS_STORAGE_KEY)
  if (stored) {
    try { return JSON.parse(stored) } catch { /* fall through */ }
  }
  localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(initialNews))
  return initialNews
}

export function getUpdates(): TechUpdate[] {
  return initialUpdates
}
