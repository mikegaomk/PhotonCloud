export interface TechArticle {
  id: string
  title: string
  summary: string
  content: string
  tags: string[]
}

export interface KeyPlayer {
  name: string
  country: string
  description: string
}

export interface TechMilestone {
  year: number
  event: string
}

export interface PhotonicsChip {
  id: string
  name: string
  fullName: string
  category: string
  color: string
  bgColor: string
  description: string
  applications: string[]
  keySpecs: { label: string; value: string; unit: string }[]
  advantages: string[]
  challenges: string[]
  trendData: { year: number; market: number }[]
  architectureDesc: string
  // Extended knowledge fields
  physicsExplanation: string
  workingPrinciple: string
  fabricationProcess: string[]
  keyMaterials: string[]
  designParameters: { param: string; description: string; typical: string }[]
  performanceMetrics: { metric: string; definition: string; importance: string }[]
  techMilestones: TechMilestone[]
  keyPlayers: KeyPlayer[]
  futureOutlook: string
  relatedStandards: string[]
  articles: TechArticle[]
}

export const photonicsChips: PhotonicsChip[] = [
  {
    id: 'eml',
    name: 'EML',
    fullName: 'Electro-absorption Modulated Laser',
    category: '有源光芯片',
    color: '#ef4444',
    bgColor: '#fef2f2',
    description:
      'EML 将 DFB 激光器和电吸收调制器（EAM）单片集成在同一 InP 衬底上，实现高速直接调制。广泛应用于 100G/400G 数据中心短距和中距互连。',
    applications: ['数据中心互连 (100G-400G)', '5G 前传', '城域网 DWDM', '接入网 PON'],
    keySpecs: [
      { label: '调制速率', value: '100', unit: 'Gbaud' },
      { label: '消光比', value: '>9', unit: 'dB' },
      { label: '输出功率', value: '2-6', unit: 'dBm' },
      { label: '工作波长', value: '1270-1330', unit: 'nm' },
      { label: '啁啾因子', value: '<1', unit: '' },
    ],
    advantages: [
      '单片集成，封装简单',
      '低啁啾，传输距离优于 DML',
      '功耗低于外调制方案',
      '成本效益高',
    ],
    challenges: [
      '调制带宽受限（vs MZM）',
      '温度敏感性需 TEC 控温',
      '超高速 (>100G) 需 DSP 辅助',
      'InP 晶圆良率与成本',
    ],
    trendData: [
      { year: 2020, market: 1.2 },
      { year: 2021, market: 1.5 },
      { year: 2022, market: 1.9 },
      { year: 2023, market: 2.4 },
      { year: 2024, market: 3.1 },
      { year: 2025, market: 3.8 },
      { year: 2026, market: 4.5 },
    ],
    architectureDesc: 'DFB Laser → EAM → Output Fiber (InP monolithic integration)',
    physicsExplanation: 'EML 基于 Franz-Keldysh 效应和量子限制 Stark 效应（QCSE）。当外加电场施加在多量子阱（MQW）吸收区时，带隙等效缩小，使得原本透明的波长开始被吸收，从而实现光强调制。DFB 激光器部分通过布拉格光栅选择单纵模，确保稳定的单波长输出。',
    workingPrinciple: '1. DFB 区注入电流 → 产生稳定 CW 光；\n2. EAM 区施加反偏电压 → QCSE 效应改变吸收系数；\n3. 高压时光被吸收（低电平），零偏时光透过（高电平）；\n4. 调制信号驱动 EAM 电压 → 光强随信号变化；\n5. DFB 和 EAM 之间通过隔离区电隔离，避免串扰。',
    fabricationProcess: [
      'MOCVD 外延生长 InGaAsP/InP 多量子阱结构',
      '电子束光刻定义 DFB 光栅',
      '对接生长（Butt-joint）或选区生长（SAG）连接 DFB 和 EAM',
      '脊波导刻蚀和侧壁钝化',
      'P/N 电极制作和隔离沟道',
      '解理、镀增透膜/高反膜',
      '芯片测试和筛选',
    ],
    keyMaterials: ['InP 衬底', 'InGaAsP 量子阱（1.3μm）', 'InGaAlAs 量子阱（1.55μm）', 'InP 包层', 'SiNx 钝化层'],
    designParameters: [
      { param: 'MQW 层数', description: '量子阱周期数，影响调制效率和插损', typical: '8-12 层' },
      { param: '光栅耦合系数 κ', description: 'DFB 光栅强度，决定单模稳定性', typical: '40-60 cm⁻¹' },
      { param: 'EAM 长度', description: '吸收区长度，权衡消光比和带宽', typical: '100-200 μm' },
      { param: '隔离区长度', description: 'DFB-EAM 电隔离长度', typical: '50-100 μm' },
      { param: 'MQW detuning', description: '量子阱 PL 峰与激射波长偏差', typical: '40-60 nm' },
    ],
    performanceMetrics: [
      { metric: '消光比 (ER)', definition: '高电平与低电平光功率之比', importance: '直接影响接收灵敏度，DR4 要求 >5 dB' },
      { metric: '啁啾因子 (α)', definition: '强度调制伴随的相位调制', importance: '啁啾+色散导致脉冲展宽，影响传输距离' },
      { metric: 'TDECQ', definition: '发射和色散眼闭合惩罚', importance: 'PAM4 信号质量核心指标，IEEE 标准 <3.4 dB' },
      { metric: 'OMA', definition: '光调制幅度', importance: '接收信号强度，影响 BER' },
      { metric: 'S21 带宽', definition: '电光调制响应 3dB 带宽', importance: '决定最大支持波特率' },
    ],
    techMilestones: [
      { year: 1990, event: '首次实现 EAM+DFB 单片集成' },
      { year: 2005, event: '10G EML 商用，成为电信骨干标配' },
      { year: 2015, event: '25G EML 量产，用于 100G CWDM4' },
      { year: 2018, event: '50G PAM4 EML 推动 200G/400G' },
      { year: 2022, event: '100G/lane EML 样品展示' },
      { year: 2025, event: 'EML 与 DSP 协同设计实现 800G DR4' },
    ],
    keyPlayers: [
      { name: 'Lumentum', country: '美国', description: '全球领先的 EML 芯片供应商' },
      { name: 'Coherent (II-VI)', country: '美国', description: 'InP 光芯片技术领导者' },
      { name: 'Mitsubishi Electric', country: '日本', description: '高速 EML 技术先驱' },
      { name: '海信宽带/源杰科技', country: '中国', description: '国产 EML 芯片代表' },
      { name: 'Macom', country: '美国', description: '高速光电器件' },
    ],
    futureOutlook: 'EML 在 400G 以下市场仍是性价比最优方案。800G 及以上将面临 TFLN 和硅光外调制方案的竞争。EML 的演进方向包括：(1) 高带宽 EML (>80 GHz) 配合 DSP 预补偿；(2) 与 SOA 集成提升功率预算；(3) 异质集成到硅光平台。预计到 2030 年，EML 仍将占据短距数据中心互连 >50% 的市场份额。',
    relatedStandards: ['IEEE 802.3bs (200G/400G)', 'IEEE 802.3cu (100G Lambda)', '100G Lambda MSA', 'QSFP-DD MSA', 'OIF CEI-112G'],
    articles: [
      {
        id: 'eml-chirp',
        title: 'EML 啁啾机理与优化',
        summary: '深入解析 EAM 的 α 因子来源及调控方法',
        content: `## 啁啾的物理来源

EAM 的啁啾来源于吸收系数变化伴随的折射率变化（Kramers-Kronig 关系）。α 因子定义为：

α = -2k₀ · (dn/dV) / (dg/dV)

其中 dn/dV 是折射率对电压的变化率，dg/dV 是增益（吸收）对电压的变化率。

## 优化策略

1. **MQW detuning 优化**：增大 PL 峰与工作波长的 detuning（>50nm），使 EAM 工作在吸收边的平坦区域，降低 α。
2. **应变量子阱**：引入压应变使重空穴带上移，优化跃迁选择定则。
3. **电场均匀性**：优化 MQW 内建电场分布，减少不均匀致宽效应。
4. **负啁啾设计**：通过特殊 MQW 结构实现负 α，利用标准光纤负色散进行脉冲压缩。`,
        tags: ['啁啾', 'QCSE', '量子阱', '色散'],
      },
      {
        id: 'eml-pam4',
        title: 'EML PAM4 信号完整性',
        summary: 'PAM4 调制下 EML 的非线性效应及 DSP 补偿',
        content: `## PAM4 对 EML 的挑战

PAM4 调制需要 4 个均匀间隔的光功率电平。但 EML 的 P-V 传输曲线天然非线性（指数型吸收），导致：
- 电平间距不均匀 → RLM (Ratio of Level Mismatch) 恶化
- 不同电平经历不同啁啾 → 各电平色散代价不同
- 大信号摆幅下非线性加剧

## DSP 补偿方案

1. **Tx 预加重 (FFE)**：3-5 tap FIR 滤波器补偿带宽不足
2. **Tx 非线性预补偿**：Look-up Table 或 Volterra 级数
3. **Rx MLSE**：最大似然序列估计，联合补偿 ISI+非线性
4. **Rx VNLE**：Volterra 非线性均衡器

## 典型系统指标
- 53 Gbaud PAM4 × 4λ = 400G
- BER < 2.4e-4 (KP4-FEC threshold)
- TDECQ < 3.4 dB`,
        tags: ['PAM4', 'DSP', '非线性', 'TDECQ'],
      },
    ],
  },
  {
    id: 'cw-laser',
    name: 'CW Laser',
    fullName: 'Continuous Wave Laser',
    category: '光源芯片',
    color: '#f97316',
    bgColor: '#fff7ed',
    description:
      'CW 激光器提供连续、稳定的光输出，作为外调制方案的光源。在硅光集成中，外部 CW 光源通过光纤耦合或混合集成为硅光芯片提供光增益。',
    applications: ['硅光外部光源', '相干通信本振', '光计算光源', 'LiDAR 种子源', '量子光学'],
    keySpecs: [
      { label: '输出功率', value: '20-200', unit: 'mW' },
      { label: '线宽', value: '<100', unit: 'kHz' },
      { label: 'RIN', value: '<-155', unit: 'dB/Hz' },
      { label: '波长稳定性', value: '±0.01', unit: 'nm' },
      { label: '壁插效率', value: '30-40', unit: '%' },
    ],
    advantages: [
      '超窄线宽，适合相干系统',
      '高功率稳定输出',
      '与硅光平台解耦，灵活集成',
      '可多通道共享（功率分配）',
    ],
    challenges: [
      '光纤耦合损耗',
      '需要精密温控',
      '混合集成工艺复杂',
      '功耗和散热管理',
    ],
    trendData: [
      { year: 2020, market: 0.8 },
      { year: 2021, market: 1.0 },
      { year: 2022, market: 1.3 },
      { year: 2023, market: 1.7 },
      { year: 2024, market: 2.2 },
      { year: 2025, market: 2.9 },
      { year: 2026, market: 3.6 },
    ],
    architectureDesc: 'III-V Gain Chip → Grating/Cavity → Fiber Coupling → External Modulator',
    physicsExplanation: 'CW 激光器基于受激辐射原理。III-V 族半导体（InP/InGaAsP）中注入电流产生载流子反转分布，当光在谐振腔中往返增益超过损耗时实现激射。外腔激光器通过外部光栅（FBG 或平面波导光栅）提供频率选择反馈，实现超窄线宽。',
    workingPrinciple: '1. 注入电流 → III-V 增益芯片产生宽带光放大；\n2. 外部光栅（FBG/SiN 光栅）提供波长选择反馈；\n3. 光在增益芯片和光栅之间往返形成激射；\n4. 长腔长（>10mm）降低 Schawlow-Townes 线宽；\n5. TEC 精确控温确保波长和功率稳定。',
    fabricationProcess: [
      'MOCVD 生长 III-V 增益芯片（SOA 结构）',
      '增益芯片端面镀 AR 膜（反射率 <0.01%）',
      '光栅制作（FBG/硅氮化物平面光栅）',
      '增益芯片与光栅精密对准和耦合',
      '光纤尾纤熔接或透镜耦合',
      '封装（Butterfly/Mini-Butterfly）',
      '热电冷却器 (TEC) 集成',
    ],
    keyMaterials: ['InP 增益介质', 'InGaAsP/InGaAlAs 有源区', 'Si₃N₄ 平面光栅（混合集成）', '光纤布拉格光栅 (FBG)', 'BiSbTe TEC 材料'],
    designParameters: [
      { param: '腔长', description: '外腔总光学长度，决定线宽和模式间距', typical: '10-50 mm' },
      { param: '增益带宽', description: '增益芯片 ASE 带宽', typical: '40-80 nm' },
      { param: '光栅反射率', description: '输出耦合器反射率', typical: '10-30%' },
      { param: 'AR 膜反射率', description: '增益芯片端面残余反射', typical: '<0.01%' },
      { param: '热调谐范围', description: '通过温度调节波长范围', typical: '±2-5 nm' },
    ],
    performanceMetrics: [
      { metric: '线宽', definition: '激光器输出的频率宽度 (FWHM)', importance: '相干通信要求 <100 kHz，超窄线宽利于高阶 QAM' },
      { metric: 'RIN', definition: '相对强度噪声', importance: '影响系统 SNR，要求 <-155 dB/Hz' },
      { metric: 'SMSR', definition: '边模抑制比', importance: '确保单模运行，要求 >45 dB' },
      { metric: 'WPE', definition: '壁插效率（电光转换效率）', importance: 'CPO 场景下直接影响系统功耗' },
      { metric: '频率稳定性', definition: '长期波长漂移', importance: 'DWDM 系统要求锁定在 ITU 网格' },
    ],
    techMilestones: [
      { year: 1995, event: '外腔半导体激光器 (ECL) 商用化' },
      { year: 2010, event: '窄线宽 (<100 kHz) CW 激光器用于相干通信' },
      { year: 2018, event: '硅光混合集成 CW 光源首次量产' },
      { year: 2022, event: '多通道 CW 光源阵列用于 CPO' },
      { year: 2025, event: '集成 Si₃N₄ 外腔实现 <1 kHz 线宽' },
    ],
    keyPlayers: [
      { name: 'Intel (Mobileye)', country: '美国', description: '硅光集成 CW 光源领导者' },
      { name: 'Lumentum', country: '美国', description: '高功率窄线宽激光器' },
      { name: 'NeoPhotonics (Lumentum)', country: '美国', description: '超窄线宽 ITLA' },
      { name: 'POET Technologies', country: '加拿大', description: '光引擎集成光源' },
      { name: '中科光芯', country: '中国', description: '国产 DFB/CW 激光器' },
    ],
    futureOutlook: 'CW 激光器是硅光和 CPO 生态的核心组件。未来趋势：(1) 与 SiN 外腔混合集成实现片上超窄线宽；(2) 多通道光源阵列共享光功率；(3) 量子点激光器在硅上直接生长；(4) WPE 提升至 >50% 降低 CPO 功耗。到 2030 年，集成 CW 光源市场将随硅光和 CPO 同步增长。',
    relatedStandards: ['OIF Implementation Agreement (ITLA)', 'IEEE 802.3 (光源要求)', 'Telcordia GR-468 (可靠性)', 'ITU-T G.694.1 (DWDM 波长网格)'],
    articles: [
      {
        id: 'cw-linewidth',
        title: '激光器线宽的物理极限与工程优化',
        summary: '从 Schawlow-Townes 极限到实际线宽压缩技术',
        content: `## Schawlow-Townes 线宽

半导体激光器的量子极限线宽为：

Δν = (hν · nsp · αm · vg) / (4π · P₀ · τ_rt²)

其中 nsp 是自发辐射因子，αm 是镜面损耗，P₀ 是腔内功率，τ_rt 是腔内往返时间。

## 线宽压缩方法

1. **增大腔长**：线宽 ∝ 1/L²，外腔结构可将线宽从 MHz 压缩到 kHz 级
2. **提高腔内功率**：线宽 ∝ 1/P，但受限于非线性效应
3. **降低损耗**：使用低损耗 SiN 波导作为外腔（<0.1 dB/cm）
4. **自注入锁定**：高 Q 微腔提供光学反馈
5. **PDH 锁定**：电子伺服锁定到超稳腔

## 实用指标
- DFB 激光器：1-10 MHz
- 外腔 ECL：10-100 kHz
- SiN 混合集成：1-10 kHz
- PDH 锁定：<1 Hz（实验室）`,
        tags: ['线宽', 'Schawlow-Townes', '外腔', 'SiN'],
      },
    ],
  },
  {
    id: 'tfln',
    name: 'TFLN',
    fullName: 'Thin Film Lithium Niobate',
    category: '调制器芯片',
    color: '#eab308',
    bgColor: '#fefce8',
    description:
      'TFLN（薄膜铌酸锂）利用 LiNbO₃ 的强电光效应（Pockels 效应），在亚微米波导中实现超高带宽、低压驱动的光调制。被视为下一代高速调制器的核心技术。',
    applications: ['800G/1.6T 相干光模块', '数据中心互连', '微波光子学', '量子信息', '光学频率梳'],
    keySpecs: [
      { label: '调制带宽', value: '>110', unit: 'GHz' },
      { label: 'Vπ', value: '<1.5', unit: 'V' },
      { label: '插入损耗', value: '<2', unit: 'dB' },
      { label: '消光比', value: '>35', unit: 'dB' },
      { label: '芯片长度', value: '10-20', unit: 'mm' },
    ],
    advantages: [
      '超高带宽 (>100 GHz)',
      '极低驱动电压 → 低功耗',
      '线性度极佳',
      '无载流子效应，无啁啾',
      '适合相干 IQ 调制',
    ],
    challenges: [
      '光纤-芯片耦合（模场匹配）',
      '薄膜制备和刻蚀工艺',
      '偏置点漂移需控制',
      '与 CMOS 驱动器的协同封装',
      '规模化量产良率',
    ],
    trendData: [
      { year: 2020, market: 0.1 },
      { year: 2021, market: 0.15 },
      { year: 2022, market: 0.3 },
      { year: 2023, market: 0.6 },
      { year: 2024, market: 1.2 },
      { year: 2025, market: 2.5 },
      { year: 2026, market: 4.0 },
    ],
    architectureDesc: 'CW Laser → TFLN MZM (IQ Modulator) → DSP Driver ASIC',
    physicsExplanation: 'TFLN 利用铌酸锂（LiNbO₃）的线性电光效应（Pockels 效应）。施加电场时晶体折射率发生线性变化：Δn = -½ · n³ · r₃₃ · E，其中 r₃₃ ≈ 31 pm/V 是最大电光系数。薄膜结构（厚度 ~300-600 nm）将光场高度限制在亚微米波导中，使得电场与光场高度重叠，大幅降低 Vπ。',
    workingPrinciple: '1. LNOI (LiNbO₃ on Insulator) 薄膜上刻蚀脊波导；\n2. 波导两侧布置共面微波电极 (CPW/GSG)；\n3. RF 信号施加到电极 → 电场穿透波导核心区；\n4. Pockels 效应改变波导相位 → MZI 两臂相位差调制；\n5. 相位差 → 干涉 → 强度调制。',
    fabricationProcess: [
      'Smart-Cut 或研磨减薄制备 LNOI 晶圆（LN/SiO₂/Si）',
      '电子束或 DUV 光刻定义波导图案',
      'Ar⁺ 等离子体刻蚀铌酸锂脊波导（ICP-RIE）',
      'SiO₂ 包层沉积',
      '金属电极制作（Au CPW 传输线）',
      '模斑转换器 (SSC) 制作',
      '端面抛光和光纤阵列对准',
    ],
    keyMaterials: ['X-cut LiNbO₃ 薄膜 (300-600 nm)', 'SiO₂ 下包层 (2-4 μm)', 'Si 载体衬底', 'Au 微波电极', 'SiO₂ 上包层'],
    designParameters: [
      { param: '薄膜厚度', description: 'LN 层厚度，影响模式约束和 Vπ', typical: '300-600 nm' },
      { param: '脊高/板厚比', description: '刻蚀深度比例，平衡约束和损耗', typical: '0.5-0.7' },
      { param: '电极间距', description: 'GSG 电极间距，权衡 Vπ 和微波损耗', typical: '3-8 μm' },
      { param: '调制长度', description: 'RF 电极有效作用长度', typical: '10-25 mm' },
      { param: '速度匹配', description: '光波群速度与微波相速度匹配', typical: 'Δn < 0.02' },
    ],
    performanceMetrics: [
      { metric: 'Vπ', definition: '实现 π 相移所需的驱动电压', importance: '越低越好，决定驱动器功耗和 CMOS 兼容性' },
      { metric: 'EO 带宽', definition: '电光响应 3dB 带宽', importance: '>100 GHz 支持超高波特率' },
      { metric: '插入损耗', definition: '光通过调制器的总损耗', importance: '影响链路预算，目标 <3 dB（含耦合）' },
      { metric: '消光比', definition: 'MZI 干涉最大/最小输出比', importance: '>30 dB 确保信号质量' },
      { metric: 'Vπ·L', definition: '半波电压-长度积', importance: '器件效率的本征度量，TFLN ~2 V·cm' },
    ],
    techMilestones: [
      { year: 2017, event: '哈佛团队首次展示 LNOI 高效 MZM (Nature)' },
      { year: 2019, event: '110 GHz 带宽 TFLN 调制器发表' },
      { year: 2021, event: '多家初创公司开始样品供货' },
      { year: 2023, event: '首款 TFLN IQ 调制器通过 800G 系统测试' },
      { year: 2025, event: 'TFLN 调制器开始小批量产，用于 1.6T 相干模块' },
      { year: 2026, event: '与 CMOS 驱动器 co-packaging 原型验证' },
    ],
    keyPlayers: [
      { name: 'HyperLight', country: '美国', description: '哈佛团队孵化，TFLN 调制器先驱' },
      { name: '铌奥光电 (NOEIC)', country: '中国', description: '中科院背景，TFLN 量产推进者' },
      { name: 'Polariton Technologies', country: '瑞士', description: '超高速光电调制器' },
      { name: '光之语光电', country: '中国', description: 'TFLN 芯片设计和制造' },
      { name: 'Xanadu / Psiquantum', country: '加拿大/美国', description: 'TFLN 用于量子光子学' },
    ],
    futureOutlook: 'TFLN 被视为超越硅光 MZM 和 InP 调制器的下一代技术。2026-2030 年关键发展：(1) Vπ 降至 <1V 实现 CMOS 直驱；(2) 与 Si 或 SiN 平台异质集成；(3) 量产良率提升至 >90%；(4) 成本随规模下降至与硅光可比；(5) 在 1.6T 和 3.2T 相干模块中成为主流选择。',
    relatedStandards: ['OIF 400ZR/ZR+', 'IEEE 802.3df (1.6T Ethernet)', 'OpenZR+ MSA', 'QSFP-DD800 MSA'],
    articles: [
      {
        id: 'tfln-fabrication',
        title: 'TFLN 制造工艺核心挑战',
        summary: '从晶圆制备到刻蚀，LNOI 工艺的关键难点',
        content: `## LNOI 晶圆制备

两种主要方法：
1. **Smart-Cut（离子注入剥离）**：He⁺/H⁺ 注入 LN → 键合到 SiO₂/Si → 退火剥离 → CMP 抛光。优点：厚度均匀（±5 nm），缺点：注入损伤需退火修复。
2. **研磨减薄**：直接键合后机械研磨+CMP。优点：无注入损伤，缺点：厚度均匀性较差。

## 刻蚀挑战

LiNbO₃ 是难刻蚀材料：
- 化学惰性强，湿法刻蚀速率极慢
- 干法刻蚀需要 Ar⁺ 物理轰击为主
- 侧壁粗糙度直接影响波导损耗
- 再沉积物（LiF, NbF₅）需要清洗

**最新进展**：优化的 ICP-RIE（Ar⁺ + 少量 F 基气体），可实现侧壁粗糙度 <1 nm RMS，波导损耗 <0.1 dB/cm。`,
        tags: ['LNOI', 'Smart-Cut', '刻蚀', '波导'],
      },
      {
        id: 'tfln-velocity-matching',
        title: 'TFLN 行波电极速度匹配设计',
        summary: '如何实现光波和微波的速度匹配以获得超宽带响应',
        content: `## 速度匹配原理

行波调制器的带宽受限于光波和微波的群速度失配：

BW ∝ 1 / |n_μ - n_g| · L

其中 n_μ 是微波有效折射率，n_g 是光波群折射率。对于 LN：
- 光波 n_g ≈ 2.2 (1550 nm)
- 微波 n_μ 取决于电极设计

## 设计策略

1. **SiO₂ 缓冲层**：降低微波折射率接近光波
2. **电极厚度优化**：厚 Au 电极 (>1 μm) 降低微波 n_eff
3. **结构型慢波**：T 型电极或容性加载降低微波相速
4. **衬底减薄**：去除 Si 衬底的高介电效应

## 最新成果
- 300+ GHz 带宽已在实验室验证
- 商用器件带宽 >110 GHz (3dB EO)
- VπL < 2 V·cm 在 67 GHz 带宽下实现`,
        tags: ['行波电极', '速度匹配', '带宽', 'CPW'],
      },
    ],
  },
  {
    id: 'silicon-photonics',
    name: 'Silicon Photonics',
    fullName: 'Silicon Photonics (SiPh)',
    category: '集成光芯片平台',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    description:
      '硅光子学利用成熟的 CMOS 晶圆代工技术，在 SOI（绝缘体上硅）衬底上集成光波导、调制器、探测器和无源器件。实现光电大规模集成，降低成本。',
    applications: ['数据中心光互连 (DR/FR)', '相干光模块', 'LiDAR', '生物传感', '量子计算接口'],
    keySpecs: [
      { label: '波导损耗', value: '<1', unit: 'dB/cm' },
      { label: '调制速率', value: '100+', unit: 'Gbaud' },
      { label: 'PD 响应度', value: '>0.8', unit: 'A/W' },
      { label: '集成密度', value: '>1000', unit: '器件/cm²' },
      { label: '制造工艺', value: '45-90', unit: 'nm' },
    ],
    advantages: [
      'CMOS 兼容，大规模量产',
      '高集成度，单芯片集成收发',
      '成本随规模降低',
      '成熟 EDA 和 PDK 生态',
    ],
    challenges: [
      '缺少原生光源（需外部/异质集成）',
      '载流子调制效率有限',
      '热光效应功耗',
      '光纤耦合封装成本',
    ],
    trendData: [
      { year: 2020, market: 1.5 },
      { year: 2021, market: 2.1 },
      { year: 2022, market: 3.0 },
      { year: 2023, market: 4.2 },
      { year: 2024, market: 5.8 },
      { year: 2025, market: 7.5 },
      { year: 2026, market: 9.8 },
    ],
    architectureDesc: 'SOI Wafer → Waveguides + MZM + Ge-PD + Grating Couplers → External CW Laser',
    physicsExplanation: '硅光基于 SOI (Silicon-on-Insulator) 平台。硅（n=3.48@1550nm）和 SiO₂（n=1.44）之间的大折射率差实现强光限制。调制利用载流子等离子色散效应（free carrier dispersion）：注入/耗尽载流子改变硅的折射率和吸收。探测利用 Ge 的窄带隙（0.67 eV）在 1310/1550 nm 吸收光子。',
    workingPrinciple: '1. 220nm Si 波导层在 SOI 上定义各种光学器件；\n2. 脊/条形波导传输光信号（单模条件 ~450nm 宽）；\n3. PN 结/PIN 结在波导中形成 → 载流子耗尽/注入改变相位；\n4. MZI 结构将相位调制转为强度调制；\n5. Ge 选区外延生长在 Si 上 → 形成光电探测器；\n6. 光栅耦合器或边缘耦合器连接外部光纤。',
    fabricationProcess: [
      'SOI 晶圆准备（220nm Si / 2μm BOX / Si 衬底）',
      '193nm DUV 或 EUV 光刻定义波导',
      '深硅刻蚀（全蚀）和浅蚀刻形成脊波导',
      '离子注入形成 PN 结调制器（多次注入形成 P++/P/N/N++）',
      '选区 Ge 外延生长（CVD, ~400°C）',
      'SiO₂ 上包层沉积',
      '多层金属互连和通孔',
      '深沟槽隔离和热调谐器 (TiN heater)',
    ],
    keyMaterials: ['SOI 晶圆 (Si 220nm / BOX 2μm)', 'Ge (探测器吸收层)', 'SiO₂ (包层/BOX)', 'TiN (热调谐加热器)', 'SiN (低损耗层/耦合器)'],
    designParameters: [
      { param: 'Si 波导尺寸', description: '单模波导截面', typical: '220nm × 450-500nm' },
      { param: 'PN 结位置', description: '结面相对波导中心偏移', typical: '0-50 nm offset' },
      { param: 'Ge PD 长度', description: '探测器吸收区长度', typical: '10-40 μm' },
      { param: '光栅耦合器周期', description: '二阶光栅周期', typical: '580-630 nm' },
      { param: 'Heater 效率', description: '热调谐器相移效率', typical: '~25 mW/π' },
    ],
    performanceMetrics: [
      { metric: '波导损耗', definition: '光在波导中传播的衰减', importance: '影响片上功率预算，目标 <1 dB/cm' },
      { metric: 'Ge-PD 响应度', definition: '单位光功率产生的光电流', importance: '直接影响接收灵敏度' },
      { metric: '调制效率 VπL', definition: 'MZM 的半波电压-长度积', importance: 'SiPh 典型 ~1-2.5 V·cm (耗尽型)' },
      { metric: '耦合损耗', definition: '光纤到芯片的单端耦合损耗', importance: '光栅 ~2-3 dB，边缘 ~1-1.5 dB' },
      { metric: '串扰隔离', definition: '相邻通道间信号泄漏', importance: 'WDM 系统要求 >20 dB' },
    ],
    techMilestones: [
      { year: 2004, event: 'Intel 首次展示 GHz 硅光调制器' },
      { year: 2010, event: '硅光平台首次商用（Luxtera/Cisco）' },
      { year: 2016, event: '100G PSM4/CWDM4 硅光模块量产' },
      { year: 2020, event: '400G DR4 硅光模块成为数据中心主流' },
      { year: 2023, event: '800G 硅光相干模块商用' },
      { year: 2025, event: '1.6T 硅光模块和 CPO 光引擎验证' },
    ],
    keyPlayers: [
      { name: 'Intel', country: '美国', description: '硅光平台先驱，自有 Fab 生产' },
      { name: 'Cisco (Acacia)', country: '美国', description: '相干硅光模块领导者' },
      { name: 'Marvell', country: '美国', description: '硅光 DSP+PIC 集成' },
      { name: 'GlobalFoundries', country: '美国', description: '硅光代工 (45CLO/90WG)' },
      { name: 'TSMC', country: '中国台湾', description: '先进硅光代工平台' },
      { name: '中际旭创/新易盛', country: '中国', description: '大规模硅光模块量产' },
    ],
    futureOutlook: '硅光是当前最成熟的集成光子平台。未来路线：(1) 与 III-V 异质集成实现片上光源；(2) 45nm/32nm 先进节点提升调制带宽；(3) 3D 堆叠与 CMOS 电路集成（monolithic/heterogeneous）；(4) SiN 低损耗层用于无源和滤波；(5) CPO 推动硅光从模块走向芯片级封装。2030 年硅光市场预计 >$20B。',
    relatedStandards: ['IEEE 802.3 bs/cd/df (Ethernet)', 'OIF CEI-112G/224G', 'CW-WDM MSA', 'AIM Photonics PDK', 'IMEC/GlobalFoundries iSiPP'],
    articles: [
      {
        id: 'siph-modulator',
        title: '硅光调制器：从载流子效应到高速设计',
        summary: '深入理解硅中的等离子色散效应及 MZM/微环调制器设计',
        content: `## 等离子色散效应

硅在通信波段没有线性电光效应（中心对称晶体），调制依赖于载流子浓度改变折射率：

Δn = -8.8×10⁻²² · ΔN_e - 8.5×10⁻¹⁸ · (ΔN_h)^0.8  (@ 1550nm)

## 调制方案对比

| 方案 | 速度 | 效率 | 损耗 |
|------|------|------|------|
| 载流子耗尽 | >50 GHz | VπL ~2.5 V·cm | 低 |
| 载流子注入 | <5 GHz | VπL ~0.1 V·cm | 高 |
| 载流子积累 | ~30 GHz | VπL ~1 V·cm | 中 |

## 高速设计要点

1. **行波电极设计**：阻抗匹配 50Ω，速度匹配 n_μ ≈ n_g(Si) ≈ 3.8
2. **串联推挽 (SPPD)**：双臂反向调制，降低等效 Vπ
3. **分段调制 (Segmented)**：多个短段并联驱动，降低 RC 限制
4. **微环调制 (MRM)**：高 Q 谐振增强效率，但带宽受限`,
        tags: ['硅光', '调制器', '等离子色散', 'MZM'],
      },
      {
        id: 'siph-ge-pd',
        title: 'Ge-on-Si 光电探测器技术',
        summary: 'Ge 在硅光平台上的外延生长和高速探测器设计',
        content: `## Ge 在 Si 上的挑战

Ge 和 Si 有 4.2% 的晶格失配，直接外延会产生大量穿透位错。解决方案：

1. **两步法生长**：低温种子层 (330°C) + 高温生长层 (600°C)
2. **循环退火**：900°C/450°C 循环减少位错密度至 ~10⁷ cm⁻²
3. **选区生长**：SiO₂ 开窗限制生长区域，利用缺陷过滤效应

## 高速 PD 设计

- **垂直 PIN 结构**：Ge 本征层厚 300-500 nm，P 型上层，N 型 Si 下层
- **波导耦合**：侧向或渐变耦合，耦合效率 >90%
- **带宽优化**：减薄吸收层（渡越时间）+ 减小面积（RC 限制）

## 性能指标
- 响应度：0.8-1.0 A/W @ 1310 nm, 0.6-0.9 A/W @ 1550 nm
- 暗电流：<10 nA (@ -1V)
- 3dB 带宽：>50 GHz
- 量子效率：>80%`,
        tags: ['Ge', '探测器', '外延', 'PIN'],
      },
    ],
  },
  {
    id: 'photonic-computing',
    name: 'Photonic Computing',
    fullName: 'Photonic Computing / Optical AI Accelerator',
    category: '光计算芯片',
    color: '#6366f1',
    bgColor: '#eef2ff',
    description:
      '光计算利用光的并行性和极低传播延迟，通过 MZI 网络、微环谐振器阵列或衍射光学元件实现矩阵乘法（MVM），加速 AI 推理中的线性运算。',
    applications: ['AI 推理加速', '神经网络前向传播', '信号处理（FFT/卷积）', '优化问题求解', '类脑计算'],
    keySpecs: [
      { label: '算力', value: '>100', unit: 'TOPS' },
      { label: '能效', value: '<1', unit: 'pJ/MAC' },
      { label: '延迟', value: '<1', unit: 'ns (光路)' },
      { label: '矩阵规模', value: '64×64 - 256×256', unit: '' },
      { label: '精度', value: '4-8', unit: 'bit' },
    ],
    advantages: [
      '极高并行度（光域波分+空分）',
      '超低延迟（光速传播）',
      '能效比电子计算高 1-2 个数量级',
      '带宽无瓶颈',
    ],
    challenges: [
      '精度受限（模拟计算噪声）',
      '非线性激活函数需光电转换',
      '编程/可重构性复杂',
      '热敏感性影响权重精度',
      '尚未形成标准化生态',
    ],
    trendData: [
      { year: 2020, market: 0.05 },
      { year: 2021, market: 0.1 },
      { year: 2022, market: 0.2 },
      { year: 2023, market: 0.5 },
      { year: 2024, market: 1.0 },
      { year: 2025, market: 2.0 },
      { year: 2026, market: 4.0 },
    ],
    architectureDesc: 'CW Laser Array → MZI Mesh / Microring Array → Photodetector Array → ADC → Digital Post-processing',
    physicsExplanation: '光计算利用光的线性叠加原理实现矩阵-向量乘法。输入向量编码为多个光通道的振幅/强度，权重矩阵编码为 MZI 网络的相位设置或微环的透射系数。光在传播过程中同时完成所有乘加运算（O(1) 延迟），PD 阵列读出结果。',
    workingPrinciple: '1. CW 激光器阵列提供多波长/多端口光输入；\n2. 调制器将输入向量编码为光振幅/强度；\n3. MZI mesh 实现酉矩阵变换（SVD 分解：U·Σ·V†）；\n4. 或微环权重库设置透射系数（对角矩阵 Σ）；\n5. 光信号经乘法和叠加后到达 PD 阵列；\n6. PD 将光功率转换为电流（平方律检测）；\n7. ADC 采样后进行数字后处理（非线性激活、量化）。',
    fabricationProcess: [
      '硅光或 SiN 平台制造光波导网络',
      'MZI 阵列或微环阵列的热调谐器集成',
      '片上调制器制作（输入编码）',
      'Ge-PD 阵列集成（输出读出）',
      '多层金属互连连接控制电路',
      'Wire-bond 或 Flip-chip 连接控制 ASIC',
      '多通道光纤阵列封装',
    ],
    keyMaterials: ['SOI 晶圆 (硅光平台)', 'Si₃N₄ (低损耗平台)', 'TiN 加热器 (相位调谐)', 'Ge (探测器)', 'Phase-change materials (PCM, 非易失权重)'],
    designParameters: [
      { param: 'MZI 网络规模', description: '矩阵维度 N×N', typical: '16×16 到 256×256' },
      { param: '相位精度', description: '单个 MZI 相位设置精度', typical: '8-10 bit (DAC)' },
      { param: '光串扰', description: '相邻路径间的泄漏', typical: '<-25 dB' },
      { param: 'PD 动态范围', description: '输出光电检测的有效范围', typical: '>30 dB' },
      { param: '热串扰', description: '相邻 heater 间的热耦合', typical: '<5% nearest-neighbor' },
    ],
    performanceMetrics: [
      { metric: 'TOPS (Tera Operations Per Second)', definition: '每秒万亿次运算', importance: '衡量绝对计算吞吐量' },
      { metric: 'TOPS/W', definition: '每瓦特算力', importance: '能效指标，光计算目标 >100 TOPS/W' },
      { metric: '等效精度', definition: '考虑噪声后的有效计算位数', importance: '决定能否替代 INT8/INT4 电子计算' },
      { metric: '可编程延迟', definition: '权重重配置时间', importance: 'PCM 为 ns 级，热调谐为 μs 级' },
      { metric: '片上损耗预算', definition: '从输入到输出的总光损耗', importance: '限制网络规模的瓶颈' },
    ],
    techMilestones: [
      { year: 2017, event: 'MIT 团队发表可编程光子处理器 (Nature Photonics)' },
      { year: 2021, event: 'Lightmatter 首款光 AI 芯片 (Envise) 发布' },
      { year: 2022, event: '曦智科技展示 64×64 光计算芯片' },
      { year: 2023, event: 'Lightelligence 发布 Hummingbird 光计算加速器' },
      { year: 2024, event: '光计算芯片首次在 LLM 推理中验证' },
      { year: 2026, event: '第二代光计算芯片突破 1000 TOPS 等效算力' },
    ],
    keyPlayers: [
      { name: 'Lightmatter', country: '美国', description: 'MZI mesh 光计算先驱，MIT 孵化' },
      { name: 'Lightelligence', country: '美国/中国', description: '光计算 AI 加速器' },
      { name: '曦智科技 (SiFive Photonics)', country: '中国', description: '光计算芯片创业公司' },
      { name: 'Luminous Computing', country: '美国', description: '光电混合 AI 计算' },
      { name: 'iPronics', country: '西班牙', description: '可编程光子处理器' },
      { name: 'Xanadu', country: '加拿大', description: '光量子计算+经典光计算' },
    ],
    futureOutlook: '光计算正从概念验证走向商业应用。2026-2030 路线图：(1) 与 LLM 推理 workload 结合，在能效上超越 GPU；(2) 非易失权重（PCM/铁电）消除热调谐功耗；(3) 3D 堆叠光电集成提升规模至 1024×1024；(4) WDM+空分复用提升并行度；(5) 标准化编程接口和编译器工具链。光计算最可能率先在推理（而非训练）场景商用。',
    relatedStandards: ['暂无行业标准（技术尚在发展期）', 'AIM Photonics PDK (基础器件)', 'MLPerf Inference (性能基准)'],
    articles: [
      {
        id: 'pc-mzi-mesh',
        title: 'MZI Mesh 光计算架构详解',
        summary: '如何用 MZI 网络实现任意酉矩阵变换',
        content: `## Reck 分解与 Clements 分解

任何 N×N 酉矩阵 U 都可以分解为 N(N-1)/2 个 2×2 旋转（beam splitter）的乘积：

U = D · T_{N-1,N} · T_{N-2,N-1} · ... · T_{1,2}

其中每个 T_{i,j} 由一个 MZI 实现：
- θ 控制分光比（内部相移）
- φ 控制外部相位

## 两种拓扑

1. **Reck（三角形）**：N(N-1)/2 个 MZI，深度 2N-3
2. **Clements（矩形）**：同样 MZI 数量，深度 N（更短光路 → 更低损耗）

## 实际限制

- 每级 MZI 有 ~0.1-0.3 dB 插入损耗
- 64×64 网络 → ~60 级 → ~10-18 dB 总损耗
- 需要光放大或限制网络规模
- 热调谐串扰需要校准算法

## SVD 实现完整矩阵

非酉矩阵 W 通过 SVD 分解实现：W = U · Σ · V†
- U, V†：MZI mesh 实现
- Σ：可变衰减器（MZI set to specific θ）实现`,
        tags: ['MZI', '酉矩阵', 'SVD', 'Clements'],
      },
    ],
  },
  {
    id: 'cpo',
    name: 'CPO',
    fullName: 'Co-Packaged Optics',
    category: '光电共封装',
    color: '#ec4899',
    bgColor: '#fdf2f8',
    description:
      'CPO 将光引擎（光芯片+驱动器）与交换芯片（ASIC）封装在同一基板上，消除传统可插拔光模块的电互连瓶颈，大幅降低功耗和延迟。',
    applications: ['51.2T+ 交换机', 'AI/ML 集群互连', '超大规模数据中心', 'HPC 网络', '下一代 DCI'],
    keySpecs: [
      { label: '交换容量', value: '51.2-102.4', unit: 'Tbps' },
      { label: '单端口速率', value: '800G-1.6T', unit: '' },
      { label: '功耗节省', value: '30-50', unit: '%' },
      { label: '互连密度', value: '>10', unit: 'Tbps/mm' },
      { label: '延迟改善', value: '2-5', unit: 'ns' },
    ],
    advantages: [
      '功耗大幅降低（减少 SerDes 级数）',
      '互连密度极高',
      '延迟最低（最短电走线）',
      '释放前面板空间',
    ],
    challenges: [
      '热管理（光芯片+ASIC 共热域）',
      '光纤连接器密度和可靠性',
      '可维护性（非可插拔）',
      '供应链和标准化',
      '测试和良率要求极高',
    ],
    trendData: [
      { year: 2020, market: 0.02 },
      { year: 2021, market: 0.05 },
      { year: 2022, market: 0.15 },
      { year: 2023, market: 0.4 },
      { year: 2024, market: 1.0 },
      { year: 2025, market: 2.5 },
      { year: 2026, market: 5.5 },
    ],
    architectureDesc: 'Switch ASIC ↔ UCIe/BoW ↔ Optical Engine (SiPh PIC + TIA/Driver) ↔ Fiber Array',
    physicsExplanation: 'CPO 的核心物理优势在于缩短电信号传输距离。传统可插拔模块中，电信号从 ASIC 经 PCB trace（>25mm）、连接器、模块 PCB 到达光芯片，每毫米的高速线增加 ~0.5 dB 损耗和 ~7 ps 延迟。CPO 将光引擎直接放在 ASIC 旁边（<5mm），消除这些电互连损耗。',
    workingPrinciple: '1. Switch ASIC 通过短距 die-to-die 接口（UCIe/BoW）输出数据；\n2. 光引擎上的 Driver IC 驱动硅光 PIC 上的调制器；\n3. 外部 CW 激光器通过光纤提供光源；\n4. 调制后的光信号通过 Fiber Array 输出；\n5. 接收端：光经 PD → TIA → CDR → ASIC；\n6. 整个光引擎与 ASIC 共基板封装。',
    fabricationProcess: [
      '硅光 PIC 制造（foundry: GF/TSMC）',
      '光引擎组装（PIC + Driver/TIA IC + Laser）',
      '光纤阵列 (FA) 精密对准和耦合',
      '光引擎与 ASIC 共基板 (substrate) 封装',
      'Die-to-die 互连（UCIe/BoW micro-bump）',
      '整机热管理方案（热扩散器/TEC/液冷）',
      '光连接器接口集成（MPO/MT/blind-mate）',
    ],
    keyMaterials: ['硅光 PIC (SOI)', '有机基板 (ABF/BT)', '微凸点 (μ-bump, Cu pillar)', '光纤阵列 (MT ferrule)', '热界面材料 (TIM)', '外部 CW 激光器模块'],
    designParameters: [
      { param: 'Die-to-die 距离', description: 'ASIC 到光引擎的电互连长度', typical: '<5 mm' },
      { param: '单光引擎带宽', description: '每个光引擎的总数据吞吐', typical: '3.2-6.4 Tbps' },
      { param: '光引擎数量', description: '围绕 ASIC 的光引擎数', typical: '8-16 个' },
      { param: '光纤密度', description: '每面光纤数量', typical: '32-64 芯/面' },
      { param: '功耗密度', description: '光引擎的面积功耗', typical: '<2 W/mm²' },
    ],
    performanceMetrics: [
      { metric: 'pJ/bit', definition: '每比特传输能耗', importance: 'CPO 目标 <5 pJ/bit (vs 可插拔 ~15 pJ/bit)' },
      { metric: '带宽密度', definition: '单位面积/线长的数据吞吐', importance: 'CPO >> 电互连 (>10 Tbps/mm)' },
      { metric: '延迟', definition: '从 ASIC 到光纤的信号延迟', importance: 'CPO 减少 2-5 ns vs 可插拔' },
      { metric: '前面板释放', definition: '不占用前面板插拔位', importance: '释放空间用于散热或更多端口' },
      { metric: '光链路预算', definition: '光引擎总可用链路余量', importance: '短距互连允许更低功率运行' },
    ],
    techMilestones: [
      { year: 2019, event: 'OIF 发布 CPO 技术白皮书' },
      { year: 2021, event: 'Broadcom 展示 25.6T CPO 交换机原型' },
      { year: 2022, event: 'Intel 展示集成硅光的 CPO 光引擎' },
      { year: 2023, event: 'NVIDIA/Ayar Labs 展示用于 AI 集群的 CPO' },
      { year: 2024, event: 'CPO 首次小规模部署于超大规模数据中心' },
      { year: 2026, event: '51.2T CPO 交换机进入量产验证阶段' },
    ],
    keyPlayers: [
      { name: 'Broadcom', country: '美国', description: '交换芯片+CPO 一体化方案' },
      { name: 'Ayar Labs', country: '美国', description: 'CPO 光 I/O 领导者' },
      { name: 'Intel', country: '美国', description: '硅光 CPO 方案' },
      { name: 'Ranovus', country: '加拿大', description: '多波长 CPO 光引擎' },
      { name: 'Celestial AI', country: '美国', description: 'Photonic Fabric™ 光互连' },
      { name: 'NVIDIA', country: '美国', description: 'AI GPU + CPO 集成推动者' },
    ],
    futureOutlook: 'CPO 是解决 AI/ML 集群 I/O 带宽墙的关键技术。2026-2030 展望：(1) 51.2T→102.4T 交换机全面采用 CPO；(2) AI GPU 集成光 I/O 实现万卡级全光互连；(3) 标准化接口（UCIe optical）成熟；(4) 液冷与 CPO 协同设计解决热问题；(5) 可维护性方案（可更换光引擎模块）落地。CPO 预计 2028 年在超大规模数据中心成为主流。',
    relatedStandards: ['OIF CPO Collaboration', 'UCIe (Universal Chiplet Interconnect Express)', 'CW-WDM MSA', 'OCP (Open Compute Project) Optical', 'COBO (Consortium for On-Board Optics)'],
    articles: [
      {
        id: 'cpo-thermal',
        title: 'CPO 热管理：最大的工程挑战',
        summary: '当光芯片与 500W ASIC 共享热域时如何设计散热方案',
        content: `## 热挑战的本质

- Switch ASIC TDP: 300-500W+, junction temp ~105°C
- 硅光 PIC 热敏感：微环 ~80 pm/°C, MZM bias drift
- 光引擎距 ASIC <5mm → 强热耦合
- 激光器要求 case temp <70°C

## 解决方案层级

### 1. 芯片级
- 选择 MZM（热不敏感）替代微环
- Athermal 波导设计（负 TOC 包层材料）
- 局部 TEC 集成在光引擎内

### 2. 封装级
- 热隔离沟槽（thermal moat）in substrate
- 独立散热路径（铜柱热通道）
- 光引擎放在 ASIC 热影区之外

### 3. 系统级
- 液冷（direct-to-chip cold plate）
- 差异化冷却（ASIC 80°C / 光引擎 50°C）
- 动态热管理（监测+频率调节）

## 行业趋势
- Broadcom: ASIC 背面散热 + 光引擎正面独立路径
- Ayar Labs: 光引擎远离 ASIC 热中心（边缘放置）
- Intel: embedded micro-channel 液冷集成`,
        tags: ['热管理', 'ASIC', '微环', '液冷'],
      },
      {
        id: 'cpo-ucie',
        title: 'UCIe 光学扩展：从电到光的 Die-to-Die 互连',
        summary: 'UCIe 标准如何拥抱光互连',
        content: `## UCIe 概述

Universal Chiplet Interconnect Express (UCIe) 是 chiplet 间互连标准：
- 定义物理层、链路层和协议层
- 支持 advanced package (短距) 和 standard package (长距)
- 2024 年 UCIe 2.0 引入 optical reach

## 光学扩展的动机

电互连的 reach × bandwidth 受限：
- PCB trace: ~25 dB/m @ 56 GHz
- Package trace: ~10 dB/cm @ 56 GHz
- 功耗随距离和速率急剧增加

光互连的优势：
- 距离无关的功耗（1m 和 100m 相同）
- 带宽不随距离衰减
- 无串扰、EMI

## CPO 中的 UCIe 实现

1. **电气 UCIe 短距段**：ASIC ↔ 光引擎 (<5mm)
   - 112G/lane NRZ 或 PAM4
   - 微凸点互连
   
2. **光学长距段**：光引擎 ↔ 光引擎 (1m-2km)
   - 100G/lambda
   - 光纤互连

## 性能指标
- 电段延迟: <0.5 ns
- 电段功耗: ~0.5 pJ/bit
- 光段功耗: ~3-5 pJ/bit
- 总功耗: 3.5-5.5 pJ/bit (vs 可插拔 ~15 pJ/bit)`,
        tags: ['UCIe', 'Chiplet', 'Die-to-Die', '光互连'],
      },
    ],
  },
  {
    id: 'quantum-photonics',
    name: 'Quantum Photonics',
    fullName: 'Quantum Photonic Integrated Circuits',
    category: '量子光芯片',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    description:
      '量子光子学利用光子的量子特性（叠加态、纠缠、不可克隆性）实现量子计算、量子通信和量子传感。光子是室温量子比特的理想载体，集成光子平台正在使量子系统走向实用化。',
    applications: ['量子密钥分发 (QKD)', '光量子计算', '量子网络/互联网', '量子传感 (引力/磁场)', '玻色采样'],
    keySpecs: [
      { label: '单光子纯度', value: '>99', unit: '%' },
      { label: '双光子干涉可见度', value: '>95', unit: '%' },
      { label: '纠缠保真度', value: '>99', unit: '%' },
      { label: '光子损耗率', value: '<0.1', unit: 'dB/cm (SiN)' },
      { label: '探测效率', value: '>95', unit: '% (SNSPD)' },
    ],
    advantages: [
      '光子室温运行（无需低温 qubit）',
      '光纤网络天然兼容',
      '超快门操作（ps 级）',
      '低退相干（光子间弱相互作用）',
      '可利用成熟集成光子工艺',
    ],
    challenges: [
      '确定性单光子源效率不足',
      '光子损耗限制计算规模',
      '光子间非线性相互作用弱',
      '单光子探测器需低温',
      '量子纠错开销大',
    ],
    trendData: [
      { year: 2020, market: 0.3 },
      { year: 2021, market: 0.5 },
      { year: 2022, market: 0.8 },
      { year: 2023, market: 1.3 },
      { year: 2024, market: 2.1 },
      { year: 2025, market: 3.5 },
      { year: 2026, market: 5.5 },
    ],
    architectureDesc: 'Single Photon Sources → SiN/TFLN PIC (BeamSplitters + Phase Shifters) → SNSPD Array → Classical Post-Processing',
    physicsExplanation: '量子光子学基于光的量子化——光子是光场的最小能量单元（E=hν）。核心量子资源包括：(1) 叠加态——光子可同时处于多个路径/偏振态；(2) 纠缠——两个光子的量子态非局域关联，测量一个即确定另一个；(3) 不可克隆——未知量子态不可被完美复制，保证通信安全性。线性光学量子计算（LOQC）由 KLM 方案证明，只需单光子源、线性光学元件和光子探测即可实现通用量子计算。',
    workingPrinciple: '1. 量子光源产生单光子或纠缠光子对（SPDC/QD/SFWM）；\n2. 光子注入集成光子芯片（SiN/Si/TFLN）；\n3. 片上可编程 MZI 网络实现任意酉变换；\n4. 光子经历干涉、纠缠操作（融合门 Fusion Gate）；\n5. 高效率单光子探测器（SNSPD）测量输出；\n6. 前馈控制实现自适应量子门操作；\n7. 经典处理器执行纠错和后处理。',
    fabricationProcess: [
      'Si₃N₄ 或 SOI 低损耗波导平台制备',
      'SPDC 非线性晶体（PPLN/PPKTP）片上集成或光纤耦合',
      '高精度 MZI 干涉网络（相位误差 <0.01 rad）',
      '片上偏振控制和延迟线',
      'SNSPD 阵列低温封装（<1K）',
      '光纤阵列 V-groove 精密对准',
      '量子态层析验证测试',
    ],
    keyMaterials: ['Si₃N₄ (超低损耗波导)', 'PPLN/PPKTP (光子对源)', 'NbN/WSi (SNSPD 超导材料)', 'InAs 量子点 (确定性光源)', 'LiNbO₃ (电光调制/光子源)'],
    designParameters: [
      { param: '波导损耗', description: '单光子在波导中的存活率', typical: '<0.05 dB/cm (SiN)' },
      { param: 'MZI 分光比精度', description: '50:50 分束器的精确性', typical: '±0.1%' },
      { param: '光子不可区分性', description: '双光子 HOM 干涉可见度', typical: '>97%' },
      { param: '探测时间抖动', description: 'SNSPD 时间分辨率', typical: '<30 ps' },
      { param: '多路复用规模', description: '同时操作的光子模式数', typical: '20-100 modes' },
    ],
    performanceMetrics: [
      { metric: '量子比特数', definition: '有效操纵的光子量子比特数', importance: '决定可执行的量子算法规模' },
      { metric: '保真度', definition: '量子态与理想态的重叠度', importance: '量子纠错和算法准确性的前提' },
      { metric: '时钟速率', definition: '量子门操作的重复频率', importance: '决定计算吞吐量，光子系统可达 GHz' },
      { metric: '量子容量', definition: '可靠传输量子信息的能力', importance: '综合衡量量子处理器性能' },
      { metric: '光子损耗', definition: '从源到探测器的总光子丢失', importance: '限制计算深度和量子优势规模' },
    ],
    techMilestones: [
      { year: 2001, event: 'KLM 方案证明线性光学量子计算可行' },
      { year: 2013, event: '玻色采样在光子芯片上实验验证' },
      { year: 2020, event: '九章光量子计算机实现量子优越性（76 光子）' },
      { year: 2022, event: 'Xanadu Borealis 可编程光量子计算机发布' },
      { year: 2023, event: 'PsiQuantum 融合型光量子计算路线图发布' },
      { year: 2025, event: '首次基于光子的量子纠错码实验验证' },
      { year: 2026, event: '百量子比特级光量子处理器原型展示' },
    ],
    keyPlayers: [
      { name: 'PsiQuantum', country: '美国', description: '百万量子比特光量子计算机开发者' },
      { name: 'Xanadu', country: '加拿大', description: '连续变量光量子计算，开源 PennyLane' },
      { name: 'ORCA Computing', country: '英国', description: '量子存储+光子计算' },
      { name: 'Quandela', country: '法国', description: '量子点单光子源和光子处理器' },
      { name: '图灵量子', country: '中国', description: '光量子芯片创业公司' },
      { name: '中科大潘建伟团队', country: '中国', description: '九章光量子计算机' },
    ],
    futureOutlook: '光量子计算是通向容错量子计算机的重要路径之一。2026-2030 展望：(1) 确定性量子点光源效率 >90%，解决光子源瓶颈；(2) 融合型（Fusion-based）架构降低资源开销；(3) 片上 SNSPD 与光子 PIC 3D 集成；(4) 量子网络 QKD 系统商用化加速；(5) 光量子模拟器解决特定化学和材料科学问题。PsiQuantum 目标 2029 年实现百万物理量子比特。',
    relatedStandards: ['ETSI QKD ISG (量子密钥分发标准)', 'ITU-T Y.3800 (量子网络)', 'IEEE P7130 (量子计算术语)', 'NIST PQC (后量子密码学)'],
    articles: [
      {
        id: 'qp-single-photon',
        title: '单光子源技术全景',
        summary: '从 SPDC 概率源到量子点确定性源的发展路径',
        content: `## 单光子源的核心要求

理想单光子源需满足：
- **按需性**：触发时恰好发射一个光子
- **不可区分性**：每个光子的时频特性完全一致
- **高效率**：收集效率接近 100%
- **高纯度**：g²(0) → 0（无多光子事件）

## 三大技术路线

### 1. 自发参量下转换 (SPDC)
- 原理：χ² 非线性晶体中泵浦光子分裂为信号-闲置光子对
- 材料：PPLN, PPKTP, BBO
- 优点：室温、宽带可调、技术成熟
- 缺点：概率性（~0.01-0.1 对/脉冲）、多光子噪声

### 2. 自发四波混频 (SFWM)
- 原理：χ³ 非线性在 Si/SiN 波导中产生光子对
- 优点：CMOS 兼容、片上集成
- 缺点：概率性、拉曼噪声（Si）

### 3. 量子点 (QD)
- 原理：InAs/GaAs QD 受激发射单个光子
- 优点：确定性、高不可区分性 (>99%)、高重复率 (GHz)
- 缺点：需低温 (~4K)、难以波长一致性、异质集成复杂

## 复用策略

概率源通过时间/空间复用提升有效率：
- N 个概率源 + 光开关网络 → 等效确定性源
- 需要低损耗快速光开关（TFLN 优势）
- 16-64 路复用可将等效率提升至 >90%`,
        tags: ['单光子', 'SPDC', '量子点', '复用'],
      },
      {
        id: 'qp-fusion-computing',
        title: '融合型光量子计算：从 LOQC 到 FBQC',
        summary: 'PsiQuantum/Xanadu 的下一代量子计算架构',
        content: `## 传统 LOQC 的困难

KLM 方案需要大量辅助光子和后选择：
- CZ 门成功率仅 1/16（需多次尝试）
- 资源开销 ~10⁴ 光子/逻辑门
- 级联门的损耗和时延积累

## Fusion-Based Quantum Computing (FBQC)

PsiQuantum 提出的新架构：
1. **资源态生成**：小规模纠缠态（如 GHZ 态）确定性制备
2. **融合测量**：Type-II fusion 将两个资源态合并为更大簇态
3. **容错阈值**：fusion 成功率 >50% 即可纠错
4. **流水线**：时间延迟+复用实现大规模态

## 优势
- 不需要确定性双光子门
- Fusion 失败可通过冗余补偿
- 与制造缺陷天然兼容（阈值宽容）
- 架构对称、可模块化扩展

## 硬件要求
- 高效单光子源 (>99% 耦合)
- 低损耗延迟线 (<0.01 dB/m fiber)
- 快速光开关 (ns 级, TFLN)
- 高效率探测器 (>98% SNSPD)
- 经典控制和前馈 (~ns 延迟)

## 规模展望
- 100 逻辑量子比特 → ~10⁶ 物理光子/时钟周期
- PsiQuantum 目标：2029 年实现容错量子计算机`,
        tags: ['FBQC', 'Fusion', '容错', 'PsiQuantum'],
      },
    ],
  },
  {
    id: 'optical-amplifier',
    name: 'Optical Amplifier',
    fullName: 'Optical Fiber & Semiconductor Amplifier',
    category: '光放大器芯片',
    color: '#059669',
    bgColor: '#ecfdf5',
    description:
      '光放大器在光域直接放大光信号而无需光电转换。EDFA（掺铒光纤放大器）是长途通信的支柱，SOA（半导体光放大器）则适合集成和短距应用。新型 SiN 基放大器正在推动片上光放大的实用化。',
    applications: ['长途/海底光通信', 'DWDM 系统线放', '前置放大器 (Pre-amp)', 'CPO 片上功率补偿', '激光雷达信号增强', '量子网络中继'],
    keySpecs: [
      { label: '增益', value: '20-40', unit: 'dB' },
      { label: '噪声系数', value: '3.5-6', unit: 'dB' },
      { label: '饱和输出功率', value: '17-23', unit: 'dBm' },
      { label: '增益带宽 (EDFA)', value: '35-80', unit: 'nm' },
      { label: '偏振相关增益', value: '<0.5', unit: 'dB' },
    ],
    advantages: [
      '光域直接放大，无需 O-E-O 转换',
      'EDFA 增益平坦、噪声低',
      '支持 DWDM 多通道同时放大',
      'SOA 可片上集成',
      '超宽带放大器覆盖 C+L+S band',
    ],
    challenges: [
      'EDFA 体积大、功耗高（泵浦激光器）',
      'SOA 非线性串扰、模式噪声',
      '增益平坦度需 GFF 均衡',
      'ASE 噪声积累限制级联级数',
      '片上放大器增益有限',
    ],
    trendData: [
      { year: 2020, market: 3.0 },
      { year: 2021, market: 3.4 },
      { year: 2022, market: 3.9 },
      { year: 2023, market: 4.5 },
      { year: 2024, market: 5.2 },
      { year: 2025, market: 6.0 },
      { year: 2026, market: 7.0 },
    ],
    architectureDesc: 'Signal Input → Gain Medium (Er³⁺ Fiber / InGaAsP SOA / Er:SiN) → Pump Laser (980/1480 nm) → Amplified Output',
    physicsExplanation: '光放大基于受激辐射。EDFA 中 Er³⁺ 离子被 980nm 或 1480nm 泵浦光激发到亚稳态（⁴I₁₃/₂），当 1530-1565nm 信号光通过时触发受激辐射，释放相同波长和相位的光子实现相干放大。SOA 则利用半导体有源区的载流子注入实现增益。噪声系数的量子极限为 3 dB（高增益近似）。',
    workingPrinciple: '1. 泵浦激光器（980nm 或 1480nm）注入掺铒光纤；\n2. Er³⁺ 离子吸收泵浦光 → 粒子数反转；\n3. 信号光（C-band 1530-1565nm）进入掺铒光纤；\n4. 受激辐射产生与信号光相干的新光子；\n5. 信号被放大 20-40 dB；\n6. 同时产生 ASE 噪声（自发辐射被放大）；\n7. 输出端可加 GFF 均衡增益谱。',
    fabricationProcess: [
      '掺铒光纤拉制（MCVD/OVD + 稀土掺杂）',
      '泵浦 LD（InGaAs 980nm / InGaAsP 1480nm）封装',
      'WDM 合波器将泵浦和信号光耦合',
      '光隔离器防止反射振荡',
      '增益平坦化滤波器 (GFF) 集成',
      'ASE 滤波器和监控 PD 集成',
      '模块组装和自动增益控制 (AGC) 电路',
    ],
    keyMaterials: ['Er³⁺ 掺杂硅基光纤', 'InGaAs (980nm 泵浦 LD)', 'InGaAsP (1480nm 泵浦 LD)', 'Er:Al₂O₃ (片上放大)', 'Er:Si₃N₄ (新一代片上)', 'InGaAsP/InP (SOA)'],
    designParameters: [
      { param: '铒离子浓度', description: '光纤中 Er³⁺ 掺杂浓度', typical: '100-1000 ppm' },
      { param: '光纤长度', description: '掺铒光纤有效长度', typical: '5-30 m' },
      { param: '泵浦功率', description: '实现满增益所需泵浦', typical: '100-500 mW' },
      { param: '输入信号功率', description: '线性工作范围下限', typical: '-30 to -10 dBm' },
      { param: 'SOA 有源区长度', description: '半导体放大器增益区', typical: '0.5-2 mm' },
    ],
    performanceMetrics: [
      { metric: '小信号增益', definition: '低输入功率下的放大倍数', importance: '决定系统 span 设计和 OSNR 预算' },
      { metric: '噪声系数 (NF)', definition: '放大器引入的信噪比退化', importance: '直接影响系统 OSNR，量子极限 3 dB' },
      { metric: '饱和输出功率', definition: '增益压缩 3dB 时的输出功率', importance: '决定可支持的通道数和功率预算' },
      { metric: '增益平坦度', definition: '增益带宽内增益变化', importance: 'DWDM 系统要求 <1 dB 不平坦度' },
      { metric: '偏振相关增益 (PDG)', definition: '不同偏振态的增益差异', importance: '影响系统稳定性，要求 <0.5 dB' },
    ],
    techMilestones: [
      { year: 1987, event: 'EDFA 首次实验验证 (Southampton/AT&T)' },
      { year: 1995, event: 'EDFA 商用化，推动 DWDM 革命' },
      { year: 2005, event: '拉曼放大器用于长途系统' },
      { year: 2015, event: 'C+L band 超宽带 EDFA 商用' },
      { year: 2020, event: '片上 Er:Al₂O₃ 放大器展示 >20 dB 增益' },
      { year: 2024, event: 'Er:SiN 集成放大器与硅光平台协同工作' },
      { year: 2026, event: '片上光放大器开始用于 CPO 和光计算补偿' },
    ],
    keyPlayers: [
      { name: 'II-VI (Coherent)', country: '美国', description: 'EDFA 泵浦和模块领导者' },
      { name: 'Lumentum', country: '美国', description: '高功率泵浦和 EDFA 模块' },
      { name: 'Cisco (Acacia)', country: '美国', description: '集成 SOA 方案' },
      { name: 'Amonics', country: '中国香港', description: '高性能 EDFA 模块' },
      { name: 'Lionix (Chilas)', country: '荷兰', description: 'SiN 片上放大器先驱' },
      { name: '光库科技', country: '中国', description: '国产 EDFA 和光纤器件' },
    ],
    futureOutlook: '光放大器正从分立模块走向芯片级集成。未来路线：(1) Er:SiN/Er:Al₂O₃ 片上放大器与硅光协同集成，补偿片上损耗；(2) S+C+L 超宽带放大器覆盖 >100nm，支持频谱效率翻倍；(3) 量子限制放大器用于 QKD 中继；(4) 微型化 EDFA 用于 CPO 光引擎内功率补偿；(5) AI 辅助动态增益控制优化多 span DWDM 系统。',
    relatedStandards: ['ITU-T G.661-G.665 (光放大器)', 'IEC 61290 (EDFA 测试方法)', 'Telcordia GR-2854 (EDFA 可靠性)', 'ITU-T G.698 (DWDM 系统)'],
    articles: [
      {
        id: 'oa-edfa-design',
        title: 'EDFA 设计原理：从原子物理到系统工程',
        summary: '铒离子能级系统、增益动力学和工程实践',
        content: `## Er³⁺ 能级系统

Er³⁺ 在石英光纤中形成准三能级系统：
- 基态: ⁴I₁₅/₂
- 亚稳态: ⁴I₁₃/₂（寿命 ~10 ms）
- 泵浦态: ⁴I₁₁/₂ (980nm) 或直接到 ⁴I₁₃/₂ (1480nm)

980nm 泵浦优点：更低噪声系数（完全反转），更高效率
1480nm 泵浦优点：功率转换效率更高，适合远程泵浦

## 增益动力学

稳态增益方程（均匀展宽近似）：

G(λ) = exp[(σₑ(λ)·N₂ - σₐ(λ)·N₁) · Γ · L]

其中 σₑ/σₐ 是发射/吸收截面，N₂/N₁ 是上/下能级粒子数，Γ 是光纤模式重叠因子。

## 工程设计要点

1. **双级结构**：前级低噪声 + 后级高功率
2. **增益钳制**：利用环形振荡器稳定增益
3. **瞬态控制**：通道增减时的增益波动抑制
4. **泵浦共享**：多通道共用泵浦降低成本

## C+L band 扩展
- C band: 1530-1565 nm (35 nm)
- L band: 1570-1610 nm (40 nm)
- L-band 需要更长光纤（~100m）或更高掺杂
- 总可用带宽：~75 nm → 理论容量翻倍`,
        tags: ['EDFA', '铒离子', '能级', '增益'],
      },
      {
        id: 'oa-chip-integration',
        title: '片上光放大器：从 Er:Al₂O₃ 到 Er:SiN',
        summary: '将光放大能力带到集成光子芯片上的技术路径',
        content: `## 为什么需要片上放大？

集成光子电路的累积损耗问题：
- 硅波导：~1 dB/cm
- MZI 级联：~0.2 dB/级
- 64×64 光计算网络总损耗：>15 dB
- 无法靠提高光源功率解决（非线性限制）

## Er:Al₂O₃ 平台

- 在 Si/SiN 上沉积 Er³⁺ 掺杂 Al₂O₃ 薄膜
- 波导损耗：~0.1 dB/cm
- 净增益：>20 dB (厘米级器件)
- 泵浦：980nm 片上或光纤耦合
- 已验证与 SiN 和 Si 平台混合集成

## Er:Si₃N₄ 平台

- 直接在 SiN 中引入 Er³⁺ 掺杂（共溅射/注入）
- 优点：无需额外材料层，CMOS 兼容
- 挑战：Er³⁺ 在 SiN 中的溶解度有限
- 最新结果：净增益 ~5 dB/cm

## SOA 集成方案

- InP SOA 倒装到硅光芯片
- 优点：高增益（>20 dB）、宽带、电泵浦
- 缺点：非线性串扰、模式噪声、散热
- 适合前置放大器和单通道应用

## 片上放大器的应用场景

1. **光计算网络损耗补偿**：每 8-16 级 MZI 加一级放大
2. **CPO 功率预算**：补偿耦合和分路损耗
3. **片上 WDM 系统**：多路信号均匀放大
4. **量子光子学**：极低噪声放大用于量子态中继`,
        tags: ['片上放大', 'Er:SiN', 'Er:Al₂O₃', 'SOA'],
      },
      {
        id: 'oa-raman',
        title: '拉曼放大器：分布式放大的物理与工程',
        summary: '利用光纤自身非线性实现分布式增益',
        content: `## 受激拉曼散射 (SRS)

泵浦光与光纤中分子振动模式相互作用，将能量转移给频率下移 ~13 THz 的信号光：

G_Raman = exp(g_R · P_pump · L_eff / A_eff)

其中 g_R ~1×10⁻¹³ W⁻¹·m 是拉曼增益系数。

## 分布式 vs 集总式

| 特性 | 拉曼（分布式） | EDFA（集总式） |
|------|--------------|--------------|
| 增益位置 | 沿整条光纤 | 集中在一点 |
| 有效噪声系数 | <0 dB (等效) | 4-6 dB |
| 泵浦功率 | 400-800 mW | 100-300 mW |
| 增益带宽 | ~100 nm (多泵浦) | 35-80 nm |
| 增益平坦度 | 多泵浦优化 | GFF |

## 工程实践

1. **反向泵浦**：降低 RIN 传递，提高增益均匀性
2. **多波长泵浦**：4-8 个泵浦波长组合实现平坦增益
3. **Raman+EDFA 混合**：兼顾低噪声和高增益
4. **C+L+S band**：拉曼天然支持任意波段

## 应用场景
- 长途海底系统：EDFA+Raman 混合
- 超长 span (>100 km)：分布式补偿
- S-band 扩展：EDFA 无法覆盖，拉曼填补
- 城域/接入网：降低节点数量`,
        tags: ['拉曼', '分布式放大', 'SRS', '海底'],
      },
    ],
  },
]

export const comparisonMetrics = [
  { metric: '调制带宽', eml: '67 GHz', cw: 'N/A', tfln: '>110 GHz', siph: '50-67 GHz', computing: 'N/A', cpo: '取决于引擎' },
  { metric: '功耗效率', eml: '中', cw: '高（光源）', tfln: '极低', siph: '中', computing: '极低/MAC', cpo: '系统最优' },
  { metric: '集成度', eml: '低', cw: '低', tfln: '中', siph: '极高', computing: '高', cpo: '极高' },
  { metric: '量产成熟度', eml: '高', cw: '高', tfln: '低→中', siph: '高', computing: '低', cpo: '低→中' },
  { metric: '成本', eml: '中', cw: '中', tfln: '高→降', siph: '低（规模化）', computing: '高', cpo: '高→降' },
  { metric: '2026 市场 ($B)', eml: '4.5', cw: '3.6', tfln: '4.0', siph: '9.8', computing: '4.0', cpo: '5.5' },
]
