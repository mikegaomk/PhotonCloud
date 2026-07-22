export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  sourceUrl: string
  date: string
  category: 'industry' | 'research' | 'policy' | 'funding' | 'product' | 'standard' | 'paper' | 'conference'
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
  paper: { label: '论文速递', color: '#0ea5e9' },
  conference: { label: '会议预告', color: '#d946ef' },
}

// News section groups for tab navigation
export const newsSections = {
  industry: {
    label: '📰 行业动态',
    description: '融资/并购/新品/政策',
    categories: ['industry', 'funding', 'product', 'policy', 'standard'],
  },
  papers: {
    label: '📄 论文速递',
    description: 'arXiv 硅光/光互连精选',
    categories: ['paper', 'research'],
  },
  conferences: {
    label: '📅 会议预告',
    description: 'OFC/CLEO/ECOC/ECTC',
    categories: ['conference'],
  },
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
    id: 'auto_30a4df52',
    title: 'XIVER calls for manufacturable photonics',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124745/XIVER_calls_for_manufacturable_photonics',
    date: '2026-07-22',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## XIVER calls for manufacturable photonics\n\nXIVER says integrated photonic products must be designed for yield, reliability and scalable production from the earliest development stages.\n\nIntegrated photonics companies must consider manufacturability at the earliest stages of product development if they are to move successfully from laboratory prototypes to volume production, according to speciality foundry XIVER.\n\nSreekanth Chirayath, Vice President of Business Development at XIVER, said many promising photonic technologies fail to reach the market because they are designed primarily for technical performance rather than scalable manufacturing.\n\n“A device may work perfectly on a handful of prototypes, but when you try to manufacture hundreds or thousands of wafers, yield issues em`,
  },
  {
    id: 'auto_668ecb0d',
    title: 'Semiconductor technologies for sub-1nm chips',
    summary: 'Extreme ultraviolet (EUV) systems, volumetric printing, and 2D materials are all advancing for structures under 1nm in size for the next generations of high-performance semiconductors. The prospect of',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/semiconductor-technologies-for-sub-1nm-chips/',
    date: '2026-07-21',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Semiconductor technologies for sub-1nm chips\n\nExtreme ultraviolet (EUV) systems, volumetric printing, and 2D materials are all advancing for structures under 1nm in size for the next generations of high-performance semiconductors.\n\nThe prospect of sub-1nm chips in the next few years is becoming increasingly realistic, as highlighted by the technology roadmap at imec in Belgium and IBM’s recent announcement of a0.7nm technology.\n\nThis is driving the development of new process technologies. Today’s EUV systems are large and expensive, and researchers are looking at new ways to produce tiny transistors, from volumetric 3D printing to 2D materials.\n\nTo speed up production and lower the costs of manufacturing semiconductors, researchers in the Cockrell School of Engineering at the Un`,
  },
  {
    id: 'auto_2b64e302',
    title: 'UCLA advances terahertz PICs',
    summary: 'UCLA researchers demonstrate a monolithically integrated photonic platform combining terahertz generation and detection on a single GaAs/AlGaAs chip for wireless, sensing, and imaging applications.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124726/UCLA_advances_terahertz_PICs',
    date: '2026-07-21',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## UCLA advances terahertz PICs\n\nResearchers demonstrate a quantum-well photonic integrated circuit that combines terahertz generation and detection on a single GaAs/AlGaAs chip, paving the way for scalable wireless, sensing, and imaging technologies.\n\nResearchers at the University of California, Los Angeles (UCLA) have demonstrated a monolithically integrated photonic platform that can generate and detect terahertz signals on a single semiconductor chip, offering a potential path toward compact systems for communications, sensing and imaging.\n\nThe work introduces the Monolithically Integrated Terahertz Optoelectronics, or MITO, platform, which uses quantum-well devices fabricated on a gallium arsenide/aluminum gallium arsenide (GaAs/AlGaAs) photonic integrated circuit platform and is capable of operating at room temperature.

The MITO chip integrates a quantum cascade laser source for terahertz generation with a quantum-well infrared photodetector for terahertz detection, both fabricated using standard III-V semiconductor processing. The monolithic integration eliminates the need for external terahertz sources or detectors, potentially enabling compact, portable terahertz systems.

The researchers demonstrated terahertz emission and detection across a frequency range relevant to future 6G wireless communications, non-destructive testing, and biomedical imaging. The platform's compatibility with established semiconductor fabrication processes suggests a viable path toward volume manufacturing.`,
  },
  {
    id: 'auto_36d0efde',
    title: 'Adtran expands rural fiber network in Illinois',
    summary: 'Adtran has announced that Silo Communications is using its fiber access technology to expand high-speed broadband services across underserved communities in northern Illinois. The deployment marks ano',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/adtran-expands-rural-fiber-network-in-illinois/',
    date: '2026-07-17',
    category: 'industry',
    region: 'us',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Adtran expands rural fiber network in Illinois\n\nAdtranhas announced that Silo Communications is using itsfiberaccess technology to expand high-speedbroadbandservices across underserved communities in northern Illinois. The deployment marks another step in Silo Communications’ transition from a wireless provider to a fiber network operator capable of delivering faster and more reliable connectivity.\n\nForeeNews Europereaders, the announcement highlights how fiber access platforms, network automation, and intelligent software are enabling broadband providers to extend connectivity into rural areas. It also demonstrates how scalable access technologies can support digital inclusion while creating opportunities for long-term network growth.\n\nSilo Communications is deploying Adtran’s SD`,
  },
  {
    id: 'auto_4dea8da8',
    title: 'Photon Design speeds TFLN simulation',
    summary: 'Photon Design adds native TFLN support to its FIMPROP software, enabling rigorous waveguide bend simulations in approximately 10 seconds using Eigen Mode Expansion.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124722/Photon_Design_speeds_TFLN_simulation',
    date: '2026-07-18',
    category: 'industry',
    region: 'global',
    chipTags: ["TFLN"],
    importance: 'medium',
    content: `## Photon Design speeds TFLN simulation\n\nNative thin-film lithium niobate support in Photon Design's FIMPROP software enables rigorous waveguide bend simulations in around 10 seconds, helping accelerate the design of next-generation photonic integrated circuits.\n\nPhoton Design has announced native support for thin-film lithium niobate (TFLN) waveguide bend simulation in its FIMPROP photonic design software, enabling rigorous modelling of a benchmark 500 µm² 'S' bend in approximately 10 seconds using Eigen Mode Expansion (EME).\n\nThe company says the new capability delivers results comparable to finite-difference time-domain (FDTD) simulations while significantly reducing computation time.\n\nAccording to Photon Design, the benchmark simulation was completed on a standard CPU-based laptop, making it accessible to a broad range of photonic circuit designers without requiring high-performance computing resources.

TFLN has attracted significant interest from the photonics community due to its strong electro-optic properties, low optical loss, and compatibility with high-speed modulation. However, designing waveguide bends and other curved structures in TFLN requires careful modelling due to the material's anisotropic crystal properties.

Photon Design says the native TFLN support in FIMPROP accounts for the full crystal orientation dependence of the refractive index, enabling accurate simulation of waveguide bends at arbitrary angles without simplifying assumptions. The company plans to extend the capability to additional TFLN device geometries in future software releases.`,
  },
  {
    id: 'auto_16e361c9',
    title: 'SILITH, UMC reach PIC milestone',
    summary: 'SILITH and UMC begin mass production of silicon photonic ICs for AI optical interconnects from UMC 12-inch fab, with roadmap toward 400G/lane and future TFLN platforms.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124697/SILITH_UMC_reach_PIC_milestone',
    date: '2026-07-15',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## SILITH, UMC reach PIC milestone\n\nThe partners have begun mass production of silicon photonic ICs for AI optical interconnects and unveiled a roadmap toward 400G/lane silicon photonics and future TFLN-based platforms.\n\nSILITH Technology and United Microelectronics Corporation (UMC) have achieved a key milestone in silicon photonics manufacturing with the first mass-production wafer delivery of photonic integrated circuits (PICs) from UMC's 12-inch fabrication facility in Singapore.\n\nThe milestone marks the transition of SILITH's 1.6T silicon photonics platform from development to high-volume manufacturing, combining the company's photonics design expertise with UMC's silicon-on-insulator (SOI) process technology and 12-inch wafer production capabilities.\n\nThe platform reached production readiness following an extensive qualification process that validated device performance, reliability, and yield at wafer scale.

SILITH's silicon photonics platform targets 800G and 1.6T optical transceiver applications for AI data center interconnects. The company's roadmap includes a next-generation 400G/lane silicon photonics platform and a future thin-film lithium niobate (TFLN) based platform for ultra-high bandwidth applications.

The partnership leverages UMC's established 12-inch SOI manufacturing infrastructure in Singapore, providing SILITH with access to high-volume production capacity. The companies said the collaboration demonstrates that silicon photonics can be manufactured at scale using existing semiconductor foundry capabilities, addressing a key concern for customers requiring reliable supply of photonic ICs.`,
  },
  {
    id: 'auto_60c9f514',
    title: 'Marvell boosts photonics business',
    summary: 'Tower Semiconductor ships five million coherent PICs, highlighting growing demand for silicon photonics as AI data centers expand high-speed optical connectivity.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124691/Marvell_boosts_photonics_business',
    date: '2026-07-14',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Marvell boosts photonics business\n\nTower Semiconductor's shipment of five million coherent photonic integrated circuits highlights growing demand for silicon photonics as AI data centers expand high-speed optical connectivity.\n\nMarvell Technology's photonics business received a boost after Tower Semiconductor announced it has shipped more than five million coherent photonic integrated circuits (PICs), underscoring the rapid adoption of optical networking technologies for AI infrastructure.\n\nThe milestone reflects increasing demand for coherent PICs used in high-speed optical transceivers that connect AI data centers and cloud networks.\n\nAs hyperscale operators expand AI computing capacity, silicon photonics is emerging as a critical technology for delivering the bandwidth and energy efficiency required by next-generation AI workloads.

Tower Semiconductor's coherent PICs are manufactured using its specialty semiconductor processes optimized for photonic device performance. The partnership with Marvell combines Tower's photonic fabrication expertise with Marvell's system-level design capabilities in coherent DSP and transceiver architecture.

Industry analysts note that the five million unit milestone reflects the broader shift toward coherent optical technology in data center interconnects, driven by the need for higher capacity and longer reach connections between AI computing clusters. The technology enables 400G and 800G coherent pluggable modules that are increasingly deployed in both metro and long-haul network segments.`,
  },
  {
    id: 'auto_0630a53e',
    title: 'Tower ships 5 million coherent PICs',
    summary: 'Tower Semiconductor announces shipment of over five million coherent photonic integrated circuits through its manufacturing partnership with Marvell for AI optical networking.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124673/Tower_ships_5_million_coherent_PICs',
    date: '2026-07-11',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Tower ships 5 million coherent PICs\n\nThe milestone, achieved through Tower Semiconductor's manufacturing partnership with Marvell, reflects growing demand for coherent silicon photonics as AI data centers require faster, higher-capacity optical interconnects.\n\nTower Semiconductor has announced the shipment of more than five million coherent photonic integrated circuits (PICs) to global customers through its long-standing manufacturing partnership with Marvell Technology, marking a significant milestone for silicon photonics deployment in AI-driven optical networking.\n\nThe coherent PICs are integrated into optical transceivers that enable high-speed data transmission over fiber-optic networks.\n\nAs artificial intelligence workloads continue to expand across hyperscale data centers, demand for high-bandwidth optical interconnects is accelerating the deployment of coherent silicon photonics at scale.

Tower Semiconductor manufactures the coherent PICs at its specialty fabrication facilities, leveraging photonic-optimized process technologies that support the integration of modulators, photodetectors, and waveguides on a single silicon chip. The devices are designed into Marvell's coherent DSP-based transceiver platforms.

The milestone reflects more than a decade of collaboration between Tower and Marvell, during which the companies have progressively scaled production from initial qualification volumes to millions of units per year. Tower says its manufacturing processes deliver the performance consistency and yield levels required for high-volume data center deployments.`,
  },
  {
    id: 'auto_28e6e9da',
    title: 'Lightelligence backs silicon photonics',
    summary: 'Lightelligence predicts silicon photonic chips will account for over 30% of computing centre processors within five years as AI infrastructure demand accelerates.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124666/Lightelligence_backs_silicon_photonics',
    date: '2026-07-10',
    category: 'industry',
    region: 'global',
    chipTags: ["Silicon Photonics"],
    importance: 'medium',
    content: `## Lightelligence backs silicon photonics\n\nThe optical computing specialist expects silicon photonic chips to account for more than 30% of computing centre processors within five years as demand for AI infrastructure accelerates.\n\nShanghai-based optical computing company Lightelligence has forecast rapid growth in silicon photonics, predicting that photonic chips will account for more than 30% of processors deployed in computing centres within the next five years, up from less than 3% today.\n\nSpeaking in Shanghai, Lightelligence founder Shen Yichen said the company is jointly deploying China's first large-scale commercial optical computing system based on a 10,000-GPU supernode, marking an important milestone in the commercial adoption of photonic computing technologies.\n\nFounded in 2017, Lightelligence has developed proprietary photonic computing technology that uses light to perform matrix operations fundamental to neural network inference. The company has raised significant venture capital funding and operates R&D centres in both Boston and Shanghai.

The forecast reflects growing industry consensus that photonic computing could complement traditional electronic processors for specific AI workloads where energy efficiency and throughput are critical constraints. Several hyperscale cloud providers are evaluating photonic computing approaches as they seek to reduce the power consumption of AI inference infrastructure.`,
  },
  {
    id: 'auto_3cc6b077',
    title: 'TSMC targets PIC capacity expansion',
    summary: 'TSMC plans to increase photonic IC production capacity to 25,000 wafers per month by 2028 to support growing demand for AI-driven co-packaged optics.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124665/TSMC_targets_PIC_capacity_expansion',
    date: '2026-07-10',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## TSMC targets PIC capacity expansion\n\nThe foundry is expected to increase photonic integrated circuit production capacity to 25,000 wafers per month by 2028, supporting growing demand for AI-driven co-packaged optics.\n\nTSMC is expected to significantly expand its photonic integrated circuit (PIC) manufacturing capacity over the next two years, reflecting growing demand for silicon photonics and co-packaged optics (CPO) in AI infrastructure.\n\nAccording to industry reports, the foundry's PIC production capacity is forecast to increase from around 500 wafers per month to 10,000 wafers by the second quarter of 2026, rising to 15,000 wafers by the end of the year and reaching at least 25,000 wafers per month by 2028.\n\nThe initial production ramp is expected to support early customers developing co-packaged optics solutions for AI networking applications, with broader availability planned as capacity scales.

TSMC's PIC manufacturing platform builds on its silicon-on-insulator process technology, which supports the integration of optical modulators, photodetectors, and passive waveguide components. The foundry offers both monolithic and heterogeneous integration options to accommodate different customer design approaches.

The capacity expansion reflects the semiconductor industry's recognition that photonic integrated circuits will become a significant volume product category as AI data center operators adopt optical interconnects to address bandwidth and power challenges in next-generation computing clusters.`,
  },
  {
    id: 'auto_f7f8ee96',
    title: 'Lumentum boosts CPO growth',
    summary: 'Lumentum increases investment in co-packaged optics and high-power laser technologies for next-generation AI data centre optical interconnects.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124658/Lumentum_boosts_CPO_growth',
    date: '2026-07-09',
    category: 'industry',
    region: 'global',
    chipTags: ["CPO"],
    importance: 'medium',
    content: `## Lumentum boosts CPO growth\n\nLumentum is increasing investment in co-packaged optics and high-power laser technologies as demand grows for optical interconnects in next-generation AI data centres.\n\nLumentum is expanding its co-packaged optics (CPO) portfolio as it looks to capitalise on growing demand for AI networking infrastructure, positioning the technology as a key part of its long-term growth strategy.\n\nThe company is scaling production of ultra-high-power laser chips designed for CPO applications, with manufacturing progressing on schedule and commercial deployments expected to increase as AI infrastructure investment continues to accelerate.\n\nLumentum's CPO strategy builds on its existing expertise in semiconductor lasers and photonic components and complements its broader portfolio of photonic components for telecommunications and industrial applications.

The company has indicated that its CPO-related revenue is expected to grow significantly in the coming fiscal years as hyperscale customers move from qualification to volume deployment. Lumentum's high-power laser chips are designed to serve as shared continuous-wave light sources for CPO optical engines, a key architectural element in next-generation switch and accelerator platforms.

Lumentum also noted increasing customer interest in integrated photonic solutions that combine its laser, modulator, and receiver technologies into more complete optical subsystems, reducing integration complexity for system vendors.`,
  },
  {
    id: 'auto_793e6e6f',
    title: 'EnSilica boosts photonics expansion',
    summary: 'EnSilica plans to raise up to GBP 15 million to accelerate growth across satellite communications and photonics for AI data centre infrastructure.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124648/EnSilica_boosts_photonics_expansion',
    date: '2026-07-09',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## EnSilica boosts photonics expansion\n\nEnSilica has announced plans to raise up to £15 million to accelerate growth across satellite communications and photonics, including opportunities linked to next-generation AI data centre infrastructure.\n\nFabless semiconductor company EnSilica has announced plans to raise up to £15 million to support growth across its satellite communications and photonics businesses.\n\nThe fundraising, comprising a placing, subscription and retail offer, will provide capital to expand engineering capacity, support new customer programmes and accelerate development activities in high-growth markets.\n\nEnSilica said the investment will help advance its SatCom application-specific standard product (ASSP) roadmap, increase satellite payload and positioning, navigation and timing capabilities, and develop photonics-related IP for next-generation optical networking and AI data centre applications.

The company highlighted the growing convergence between satellite communications and photonic technologies, noting that both markets benefit from similar underlying semiconductor design expertise in high-speed mixed-signal and RF circuits.

EnSilica said it sees significant growth opportunities in providing custom ASIC and ASSP solutions for photonic module manufacturers as data rates increase to 800G and beyond. The company's existing expertise in high-speed analog design positions it to address the electronic-photonic co-design challenges inherent in next-generation optical transceivers.`,
  },
  {
    id: 'auto_932c028d',
    title: 'Wave Photonics extends PIC design access',
    summary: 'Wave Photonics PDK Management Platform adds compatibility with Synopsys OptoCompiler, enabling multi-foundry PIC design access within the unified electronic-photonic environment.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124647/Wave_Photonics_extends_PIC_design_access',
    date: '2026-07-09',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Wave Photonics extends PIC design access\n\nWave Photonics has expanded its PDK Management Platform with compatibility for Synopsys OptoCompiler, enabling designers to access and use photonic design kits from multiple foundries within the unified electronic-photonic design environment.\n\nWave Photonics has announced that all photonic design kits (PDKs) developed or managed through its PDK Management Platform are now compatible with Synopsys OptoCompiler, broadening access to foundry processes for photonic integrated circuit (PIC) designers.\n\nThe integration enables designers using Synopsys' unified electronic and photonic design platform to access PDKs spanning multiple material platforms and wavelengths, from blue through to telecom bands.\n\nThe PDKs include pre-calculated S-parameter models, verified component libraries, and technology-specific design rules that enable accurate simulation and layout within the OptoCompiler environment.

Wave Photonics said the integration supports its goal of reducing barriers to PIC design by providing designers with access to a growing catalogue of foundry-verified process design kits through a single management interface. The company currently manages PDKs for multiple foundry partners across silicon photonics, silicon nitride, indium phosphide, and polymer waveguide platforms.

The compatibility with Synopsys OptoCompiler complements existing support for other major photonic design tools, giving designers flexibility in their choice of EDA environment while maintaining access to the same verified component libraries and design rules.`,
  },
  {
    id: 'auto_773b92a5',
    title: 'Pilot Photonics lands €10.4m EIC award',
    summary: '',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124646/Pilot_Photonics_lands_€104m_EIC_award',
    date: '2026-07-09',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Pilot Photonics lands €10.4m EIC award\n\nDublin-based Pilot Photonics has secured up to €10.4 million from the European Innovation Council Accelerator to support the industrial scale-up of its photonic integrated circuit technology for AI data centres, satellite communications and next-generation mobile networks.\n\nPilot Photonics has been awarded up to €10.4 million in funding through the European Innovation Council (EIC) Accelerator to accelerate the commercialisation and scale-up of its photonic integrated circuit (PIC) technology.\n\nThe Dublin-based company develops patented photonic chips that use laser light to generate ultra-pure wireless signals for applications including AI data centres, satellite communications, and emerging 5G and 6G networks.\n\nThe funding will support product development, manufacturing scale-up, and market expansion as the company targets growing demand for high-frequency signal generation in data centre, satellite, and wireless infrastructure applications.

Pilot Photonics' technology uses integrated photonic circuits to generate extremely pure microwave and millimetre-wave signals through optical frequency division. This approach offers significant advantages over traditional electronic oscillators in terms of phase noise performance and frequency agility.

The EIC Accelerator funding combines grant and equity components, providing Pilot Photonics with non-dilutive capital alongside strategic investment to support its transition from development-stage to commercial-scale operations. The company plans to establish manufacturing partnerships and expand its team to support customer qualification programmes.`,
  },
  {
    id: 'auto_340ac5ac',
    title: 'Automotive Ethernet connector supports 25Gbps for software-defined vehicles',
    summary: 'Modern vehicle architectures are placing increasing demands on in-vehicle networking as advanced driver assistance systems (ADAS), centralised computing and software-defined vehicle (SDV) platforms re',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/automotive-ethernet-connector-supports-25gbps-for-software-defined-vehicles/',
    date: '2026-07-07',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Automotive Ethernet connector supports 25Gbps for software-defined vehicles\n\nModern vehicle architectures are placing increasing demands on in-vehicle networking as advanced driver assistance systems (ADAS), centralised computing and software-defined vehicle (SDV) platforms require higher data bandwidth and reliable signal transmission. To address these requirements,Molex has introducedthe HSAutoLink G automotive Ethernet connector system, extending its long-established HSAutoLink portfolio.\n\nFor eeNews Europe readers, the announcement reflects the continued evolution of automotive Ethernet infrastructure as OEMs move towards zonal architectures and central compute platforms. Connector technology capable of supporting higher data rates while maintaining compatibility with existing system architectures is essential for enabling the transition to software-defined vehicles.

The HSAutoLink G system supports data rates up to 25 Gbps per lane, addressing the bandwidth requirements of next-generation in-vehicle networking standards including IEEE 802.3ch and Multi-Gig Automotive Ethernet. The connector features a compact form factor designed for automotive environments with operating temperatures from -40 to +105 degrees Celsius.

Molex says the connector system is designed for reliable signal transmission in high-vibration automotive environments while supporting the miniaturisation requirements of modern vehicle electronic architectures. The system includes both board-to-board and cable-to-board configurations for flexible integration into zonal computing platforms.`,
  },
  {
    id: 'auto_e51a4fdf',
    title: 'System Check: Share your thoughts about PCB design',
    summary: 'System check! We want to know how you feel about PCB design. What type of PCBs do you design most often? What typically influences your design decisions? Past results In the last System Check, we aske',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/system-check-share-your-thoughts-about-pcb-design/',
    date: '2026-07-06',
    category: 'industry',
    region: 'europe',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## System Check: Share your thoughts about PCB design\n\nSystem check! We want to know how you feel about PCB design. What type of PCBs do you design most often? What typically influences your design decisions?\n\nIn the lastSystem Check, we asked members of the community about theirInternet dependency: Imagine you lose access to the Internet. Could you still design and build electronics with confidence? Let’s take a look at the results.\n\nIt seems that most of our community still feels capable of designing electronics without the Internet, although very few are truly independent of it. About 25% of respondents said they could work confidently offline, while the largest group said they could “mostly” manage without the Internet. About half admitted they could only handle simple projects offline, and a small fraction said they would be lost without Internet access.

The results suggest that while core electronics knowledge remains strong in the community, modern design workflows have become deeply dependent on online resources including datasheets, application notes, simulation tools, and community forums. The shift toward cloud-based EDA tools and online component databases has further increased this dependency.

This week's System Check focuses on PCB design practices, asking community members about their most common board types, design complexity levels, and the factors that most influence their layout decisions. Share your experience to help us understand current PCB design trends across the European electronics engineering community.`,
  },
  {
    id: 'auto_8d084148',
    title: 'Keysight expands RF signal analyzers portfolio',
    summary: 'Keysight Technologies has introduced two new RF signal analyzers designed to help engineers speed up the design and validation of increasingly complex wireless systems. The new Pro XA6 SA6320A and Exp',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/keysight-expands-rf-signal-analyzer-portfolio/',
    date: '2026-07-06',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Keysight expands RF signal analyzers portfolio\n\nKeysight Technologieshas introduced two newRFsignal analyzers designed to help engineers speed up the design and validation of increasingly complex wireless systems. The new Pro XA6 SA6320A and Expert XA5 SA6210A aim to reduce measurement uncertainty while giving engineers greater visibility into signal behavior across a broad range of wireless applications.\n\nAs wireless technologies continue to move toward wider bandwidths, higher frequencies, and more advanced antenna architectures, validation has become more demanding and time-consuming. Capturing complex RF behavior accurately is essential to avoid costly redesigns later in development.\n\nFor engineers working on next-generation wireless, radar, aerospace, and semiconductor test applications, these analyzers aim to reduce iteration cycles and accelerate time to market.

The Pro XA6 SA6320A offers frequency coverage up to 32 GHz with analysis bandwidth up to 2 GHz, targeting applications in 5G NR, Wi-Fi 7, and satellite communications. The Expert XA5 SA6210A covers frequencies up to 21 GHz and provides a cost-effective option for general-purpose RF measurements.

Both instruments feature improved amplitude accuracy and phase noise performance compared to their predecessors, along with enhanced digital interfaces for integration into automated test environments. Keysight says the new analyzers support emerging wireless standards and are designed to scale with future requirements through software-upgradeable bandwidth and measurement capabilities.`,
  },
  {
    id: 'auto_a6fbf1fb',
    title: 'STMicroelectronics edge AI imaging targets perception',
    summary: 'STMicroelectronics is positioning edge AI imaging as a move from camera components towards sensing platforms that turn optical input into data a machine can use directly. The company’s Imaging subgrou',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/stmicroelectronics-edge-ai-imaging-perception/',
    date: '2026-07-06',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## STMicroelectronics edge AI imaging targets perception\n\nSTMicroelectronics is positioning edge AI imaging as a move from camera components towards sensing platforms that turn optical input into data a machine can use directly. The company’s Imaging subgroup, led by Alexandre Balmefrezol, is using its FlightSense depth-sensing and BrightSense vision portfolios to address systems that need to see, measure and act locally rather than send raw images to the cloud.\n\nThe argument is not that cameras go away. It is that robotics, industrial automation, smart buildings, healthcare devices and wearables need sensors that provide depth, infrared and visual context with low latency and low power consumption. In ST’s framing, that moves imaging from human-viewable pictures to machine perception,`,
  },
  {
    id: 'auto_9a17c0fc',
    title: 'IQM becomes first European quantum computing firm to list on Nasdaq',
    summary: 'IQM Quantum Computers has become the first European quantum computing company to list on a major US stock exchange, with its shares beginning trading on the Nasdaq Global Select Market under the ticke',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/iqm-becomes-first-european-quantum-computing-firm-to-list-on-nasdaq/',
    date: '2026-07-03',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'high',
    content: `## IQM becomes first European quantum computing firm to list on Nasdaq\n\nIQM Quantum Computershas becomethe first European quantum computing company to list on a major US stock exchange, with its shares beginning trading on the Nasdaq Global Select Market under the ticker symbol IQMX.\n\nThe listing follows the completion of the company’s business combination with Real Asset Acquisition Corp. and gives the Finnishquantumhardware developer a pro forma cash position of €337 million to support its next phase of growth.\n\nForeeNews Europereaders, the listing highlights the increasing maturity of Europe’s quantum technology sector and shows how regional companies are attracting global investors while expanding into international markets. It also reflects growing commercial demand for quantum computing capabilities as organisations explore applications in materials science, drug discovery, optimization, and cryptography.

IQM develops superconducting quantum processors and full-stack quantum computing systems. The company operates quantum computing facilities in Finland, Germany, and France, and has delivered systems to national research centres and commercial customers across Europe.

The Nasdaq listing provides IQM with access to US capital markets and increases visibility among institutional investors focused on deep technology. The company said it plans to use the proceeds to accelerate its hardware roadmap, expand manufacturing capacity, and pursue commercial partnerships with enterprise customers seeking quantum computing capabilities.`,
  },
  {
    id: 'auto_cf363e65',
    title: 'Building the fab of the future for high volume PIC manufacturing',
    summary: 'As PICs move from technical promise to industrial expectation, the photonics industry must shift from research excellence to disciplined, high-volume manufacturing.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124625/Building_the_fab_of_the_future_for_high_volume_PIC_manufacturing',
    date: '2026-07-03',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Building the fab of the future for high volume PIC manufacturing\n\nPhotonic integrated circuits are moving from technical
promise to industrial expectation. Customers are no longer asking whether PICs
can work; they expect reliable delivery, traceable quality, and repeatable
performance at scale. For the photonics industry, this marks a decisive shift:
from research excellence to disciplined manufacturing.\n\nBy Bart THIESEN, MANAGING CONSULTANT HIGH-TECH, ITILITY AND ANDRE VAN DE GEIJN, 
MANUFACTURING IT MANAGER, SMART PHOTONICS\n\nFor years, the photonic integrated circuit (PIC) industry has been driven by research, prototyping, and technical demonstration. Across Europe, companies, universities, and research institutes have proven that PICs enable powerful solutions in telecom,`,
  },
  {
    id: 'auto_ba896608',
    title: 'Photonics at the heart of AI data centres and beyond',
    summary: 'imec advances silicon photonics and ultra-low-loss SiN photonics to address AI data centre bottlenecks, quantum computing support, and AR/VR biosensing applications.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124624/Photonics_at_the_heart_of_AI_data_centres_and_beyond',
    date: '2026-07-03',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Photonics at the heart of AI data centres and beyond\n\nAI-driven computing requires efficient optical interconnects
to overcome data-centre bottlenecks. imec advances silicon photonics technology
to address such a need. Furthermore, ultra-low loss SiN photonics is considered
as a key technology to support the next generation quantum-based computing. The
same platform can also be used for augmented and virtual reality and bio
sensing.\n\nBy Leili Shiramin, Portfolio Manager-Integrated Photonics,
Joris Van Compenhout, Fellow, Philippe Absil, Vice President, imec\n\nThe exponential growth of data generated across industries, combined with the rapidly increasing complexity and scale of AI models, has created significant bottlenecks in both training and inference workloads. As AI syst`,
  },
  {
    id: 'auto_8de19b55',
    title: 'Integrated photonics confronts testing, packaging and scale',
    summary: 'PIC International 2026 highlights how testing, integration, and manufacturability challenges are reshaping optical metrology, packaging strategies, and photonic architectures.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124623/Integrated_photonics_confronts_testing_packaging_and_scale',
    date: '2026-07-03',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Integrated photonics confronts testing, packaging and scale\n\nAs photonic integrated circuits move toward larger-scale
deployment in AI systems, communications and sensing, the industry is
increasingly confronting the practical challenges of testing, integration and
manufacturability.Discussions at PIC International 2026highlighted how these
pressures are reshaping optical metrology, packaging strategies and
next-generation photonic architectures.\n\nWhile photonic integrated circuits continue to advance in capability and complexity, speakers at this year’s PIC International made it clear that the industry’s next challenge lies not simply in improving device performance, but in understanding how to test, integrate and manufacture these systems at scale.\n\nAcross the conference, a common thread emerged: the photonics industry must develop new approaches to wafer-level testing, adopt advanced packaging techniques adapted from the semiconductor industry, and establish the supply chain infrastructure needed for reliable high-volume production.

Speakers highlighted that traditional laboratory characterisation methods cannot scale to production environments where thousands of PICs must be tested per day. New approaches including automated probe systems, statistical process control, and design-for-test methodologies are being developed to address this gap.

Packaging remains another critical challenge, with speakers noting that the cost of packaging and testing often exceeds the cost of the photonic chip itself. Advanced techniques such as wafer-level packaging, automated fiber attachment, and co-packaging with electronics are being pursued to reduce costs and improve reliability at scale.`,
  },
  {
    id: 'auto_3afa0b78',
    title: 'Infineon expands sensor portfolio with ams OSRAM acquisition',
    summary: 'Infineon Technologies has completed its acquisition of the non-optical analog and mixed-signal sensor portfolio from ams OSRAM, strengthening its position in automotive, industrial and medical sensing',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/infineon-expands-sensor-portfolio-with-ams-osram-acquisition/',
    date: '2026-07-02',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'high',
    content: `## Infineon expands sensor portfolio with ams OSRAM acquisition\n\nInfineon Technologies has completed itsacquisitionof the non-optical analog and mixed-signalsensorportfolio from ams OSRAM, strengthening its position in automotive, industrial and medical sensing. The deal, first announced in February 2026, has now closed after receiving all required regulatory approvals.\n\nThe acquisition adds new sensor technologies, engineering talent and development sites to Infineon, while expanding the company’s recently formed Edge Systems division. The move highlights continued consolidation in the semiconductor sensor market and signals where suppliers are investing to address growing demand for edge intelligence, automotive electronics and medical systems.\n\nInfineon said the acquired portfolio includes magnetic sensors, environmental sensors, and specialized analog front-end ICs used across automotive safety systems, industrial process control, and medical diagnostic equipment. The addition strengthens Infineon's ability to offer complete sensing solutions that combine analog signal acquisition with digital processing.\n\nThe deal adds approximately 1,000 employees and development sites in Austria, Italy, and the Philippines to Infineon's operations. The acquired business generated revenues of approximately EUR 400 million in the most recent fiscal year and is expected to be accretive to Infineon's earnings within the first full year of integration.`,
  },
  {
    id: 'auto_9ad4a544',
    title: 'SDR with HackRF One & HackRF Pro using GNU Radio',
    summary: 'Software-defined radio has transformed radio experimentation. Tasks that once required dedicated hardware can now be carried out in software, allowing users to inspect, process, and transmit signals i',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/sdr-with-hackrf-one-hackrf-pro/',
    date: '2026-07-01',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## SDR with HackRF One & HackRF Pro using GNU Radio\n\nSoftware-defined radio has transformed radio experimentation. Tasks that once required dedicated hardware can now be carried out in software, allowing users to inspect, process, and transmit signals in ways that were once reserved for specialized equipment. InSDR with HackRF One & HackRF Pro: Programming with GNU Radio, author Burkhard Kainka takes readers inside the world of software-defined radio through a combination of radio theory, practical experiments, and software development.\n\nIn the foreword, Kainka acknowledges that digital signal processing can seem intimidating at first, but he argues that today’s SDR tools make it easier than ever to learn through experimentation. That philosophy runs throughout the book. Using the HackRF One and HackRF Pro as primary hardware platforms, the author guides readers through increasingly complex projects that demonstrate fundamental SDR concepts.\n\nThe book covers topics including FM reception and transmission, digital modulation schemes, spectrum analysis, and signal processing with GNU Radio Companion. Each chapter combines theoretical explanation with practical implementation, allowing readers to build working systems while developing their understanding of radio communications principles.\n\nFor electronics engineers looking to explore software-defined radio or add wireless prototyping capabilities to their toolkit, the book offers a structured learning path from basic reception experiments to more advanced signal processing and transmission projects.`,
  },
  {
    id: 'auto_278f5c54',
    title: 'KAYTUS Introduces AI Infrastructure Management Platform',
    summary: 'KAYTUS has introduced KSManage Ultra, an AI infrastructure management platform for large-scale AI data centers, which the company calls AI Factories. The company unveiled the platform at ISC 2026 in F',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/kaytus-introduces-ai-infrastructure-management-platform/',
    date: '2026-06-29',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## KAYTUS Introduces AI Infrastructure Management Platform\n\nKAYTUShas introduced KSManage Ultra, an AI infrastructure management platform for large-scaleAIdata centers, which the company calls AI Factories. The company unveiled the platform at ISC 2026 in Frankfurt. KSManage Ultra brings compute, networking, power, and liquid cooling under a single management system.\n\nAs AI deployments continue to grow in size and density, infrastructure management has become a major challenge. For eeNews Europe readers working with AI hardware, data centers, or high-performance computing, the announcement offers a look at how vendors are tackling system visibility, fault detection, and operational efficiency in next-generation AI infrastructure.\n\nAccording to KAYTUS, traditional server management tools are not designed to handle the scale and heterogeneity of modern AI infrastructure, which can include thousands of GPUs, high-speed networking equipment, liquid cooling systems, and power distribution units operating in concert.\n\nKSManage Ultra provides a unified dashboard for monitoring compute resources, network topology, power consumption, and thermal status across entire AI factory deployments. The platform incorporates AI-driven anomaly detection to identify potential failures before they impact workloads, and automated remediation workflows to reduce mean time to recovery.\n\nThe system supports open management standards including Redfish and IPMI, enabling integration with existing data center infrastructure management tools. KAYTUS says the platform is designed to scale from hundreds to tens of thousands of nodes without degradation in monitoring granularity or response time.`,
  },
  {
    id: 'auto_0263786c',
    title: 'PICs advance next-generation sensing',
    summary: 'Integrated photonic circuits enable more compact, precise, and scalable sensing systems for metrology, vibration monitoring, and FMCW LiDAR applications.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124556/PICs_advance_next-generation_sensing',
    date: '2026-06-27',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## PICs advance next-generation sensing\n\nIntegrated photonic circuits are enabling more compact, precise and scalable sensing systems for applications ranging from metrology and vibration monitoring to FMCW LiDAR.\n\nPhotonic integrated circuits (PICs) are continuing to expand their role in next-generation sensing and measurement by integrating multiple optical functions onto a single chip.\n\nCompared with conventional optical systems, PICs offer greater precision, reduced size and weight, improved robustness and immunity to electromagnetic interference.\n\nAdvances in silicon photonics, silicon nitride and indium phosphide platforms are supporting applications including precision metrology, vibration sensing and frequency-modulated continuous-wave (FMCW) LiDAR.\n\nBy enabling parallel measurement channels, wavelength multiplexing, and on-chip signal processing, PICs are reducing the cost and complexity of sensing systems while improving measurement accuracy and speed.\n\nRecent developments include silicon nitride PICs for optical coherence tomography with unprecedented axial resolution, integrated FMCW LiDAR transceivers achieving millimetre-level ranging precision, and photonic sensor arrays for distributed vibration monitoring in structural health applications.\n\nIndustry participants note that the maturation of photonic foundry services and the availability of standardised PDKs are lowering the barriers to developing application-specific PICs for sensing, enabling a broader range of companies to leverage integrated photonics for their measurement and monitoring needs.`,
  },
  {
    id: 'auto_2bca9478',
    title: 'Vertical power delivery platform aims to ease AI infrastructure constraints',
    summary: 'Lotus Microsystems has launched a vertical power delivery platform designed to bring power conversion closer to processors while addressing thermal management within the same architecture. For eeNews ',
    source: 'EE News',
    sourceUrl: 'https://www.eenewseurope.com/en/vertical-power-delivery-platform-aims-to-ease-ai-infrastructure-constraints/',
    date: '2026-06-24',
    category: 'industry',
    region: 'europe',
    chipTags: ["Photonics"],
    importance: 'high',
    content: `## Vertical power delivery platform aims to ease AI infrastructure constraints\n\nLotus Microsystemshas launcheda vertical power delivery platform designed to bring power conversion closer to processors while addressing thermal management within the same architecture.\n\nFor eeNews Europe readers, the development highlights how advanced packaging and power delivery technologies are becoming critical as AI infrastructure moves towards higher current densities and more demanding accelerator designs.\n\nThe Copenhagen-based company has introduced vStrata, a platform built around what it calls silicon Power Interposer Technology (PIT). The approach places power delivery directly beneath the processor, aiming to reduce electrical losses while simultaneously managing heat at the point of load.\n\nThe vStrata platform integrates voltage regulators, power distribution networks, and thermal management structures into a silicon interposer that sits between the processor die and the package substrate. This vertical integration eliminates long lateral power delivery paths that generate resistive losses in conventional approaches.\n\nLotus Microsystems claims the architecture can reduce power delivery losses by up to 50 percent compared to traditional motherboard-based voltage regulation, while simultaneously providing improved thermal conductivity from the processor through the power interposer to the cooling solution. The company has secured partnerships with major AI accelerator developers and expects initial production deployments in 2027.`,
  },
  {
    id: 'auto_bcaa9f7b',
    title: 'Q.ANT demonstrates AI on photonic hardware',
    summary: 'Q.ANT demonstrates generative AI and recurrent neural network workloads running on its second-generation photonic processor at ISC 2026.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124540/QANT_demonstrates_AI_on_photonic_hardware',
    date: '2026-06-24',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Q.ANT demonstrates AI on photonic hardware\n\nQ.ANT has demonstrated generative AI and recurrent neural network workloads running on its second-generation photonic processor, highlighting the potential of photonic computing for future AI infrastructure.\n\nQ.ANT has showcased the execution of complex AI workloads on its second-generation Native Processing Unit (NPU), demonstrating both a diffusion model and a recurrent neural network at ISC High Performance 2026 in Hamburg.\n\nThe demonstrations mark a significant milestone for photonic computing, showing that the company's hardware can support modern AI applications including generative image synthesis and time-series prediction.\n\nFor generative AI, Q.ANT ran a diffusion model for image-to-image synthesis, a workload that relies on repeated matrix multiplications well suited to optical computing architectures.\n\nFor the recurrent neural network demonstration, Q.ANT executed a time-series prediction task using its photonic hardware, showing that the NPU can support sequential processing workloads in addition to parallelisable matrix operations.\n\nQ.ANT's second-generation NPU features improved optical signal-to-noise ratio and increased matrix dimensions compared to its first-generation device. The company says the processor operates at room temperature and uses standard fiber-optic interfaces, simplifying integration into existing computing infrastructure.\n\nThe demonstrations at ISC 2026 represent an important validation step as Q.ANT progresses toward commercial deployment of its photonic computing technology for AI inference and scientific computing workloads.`,
  },
  {
    id: 'auto_e48e6a6e',
    title: 'HyperLight raises $80M to scale TFLN PIC',
    summary: 'HyperLight secures $80 million Series C to expand TFLN photonic IC manufacturing capacity for AI infrastructure and high-performance networking.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124526/HyperLight_raises_80M_to_scale_TFLN_PIC',
    date: '2026-06-23',
    category: 'industry',
    region: 'global',
    chipTags: ["TFLN", "PIC"],
    importance: 'medium',
    content: `## HyperLight raises $80M to scale TFLN PIC\n\nHyperLight has secured $80 million in Series C funding to expand manufacturing capacity and accelerate deployment of its thin-film lithium niobate photonic integrated circuit technology for AI infrastructure.\n\nHyperLight has closed an $80 million Series C funding round to support the expansion of its thin-film lithium niobate (TFLN) photonic integrated circuit (PIC) platform, targeting growing demand from AI and high-performance networking applications.\n\nThe funding will be used to increase manufacturing capacity, support customer qualification programmes, scale the company's TFLN Chiplet Platform and strengthen partnerships across foundry, semiconductor networking and systems integration ecosystems.\n\nHyperLight's TFLN Chiplet Platform is designed to provide modular, high-performance electro-optic modulators that can be integrated with silicon photonics and electronic ICs through advanced packaging techniques. The platform supports data rates up to 200 Gbaud, enabling single-wavelength 800G and beyond.\n\nThe company says its TFLN technology offers significant advantages over silicon-based modulators including lower drive voltage, higher bandwidth, and linear electro-optic response. These properties make TFLN particularly suited to coherent optical communications and emerging co-packaged optics applications for AI infrastructure.\n\nHyperLight operates a pilot manufacturing line and is expanding to volume production through partnerships with established semiconductor foundries. The Series C funding will support the transition to high-volume manufacturing with target capacity of several thousand wafers per month.`,
  },
  {
    id: 'auto_e9c1126c',
    title: 'Marvell and Tower pass 5M PIC milestone',
    summary: 'Marvell and Tower Semiconductor ship over five million coherent photonic ICs, underscoring silicon photonics growth in AI data center networks.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124510/Marvell_and_Tower_pass_5M_PIC_milestone',
    date: '2026-06-20',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Marvell and Tower pass 5M PIC milestone\n\nMarvell and Tower Semiconductor have shipped more than five million coherent photonic integrated circuits, underscoring the growing role of silicon photonics in AI-driven data center networks.\n\nMarvell Technology and Tower Semiconductor have announced the shipment of more than five million coherent photonic integrated circuits (PICs), marking a significant milestone for silicon photonics deployment in high-speed optical networking.\n\nThe coherent PICs are being supplied to Marvell customers worldwide and are designed to support the increasing bandwidth and energy-efficiency demands of AI-driven data center interconnect (DCI) infrastructure.\n\nThe companies said the milestone reflects growing adoption of coherent optical technologies, which combine advanced modulation formats with integrated photonic devices to achieve higher data rates and longer transmission distances compared to direct-detect approaches.\n\nThe partnership between Marvell and Tower spans multiple technology generations, with Tower providing photonic IC fabrication using its specialty semiconductor processes optimized for optical device performance. Marvell integrates the PICs with its proprietary coherent DSP technology to deliver complete transceiver solutions.\n\nIndustry analysts note that the five million unit milestone demonstrates silicon photonics has moved beyond early adoption into mainstream deployment for data center interconnects, with coherent pluggable modules now standard equipment in hyperscale and enterprise networks worldwide.`,
  },
  {
    id: 'auto_288cc1a5',
    title: 'Tower and Marvell reach PIC milestone',
    summary: 'Tower Semiconductor and Marvell have reached a significant manufacturing milestone with the shipment of over five million coherent photonic integrated circuits for AI data center networks.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124504/Tower_and_Marvell_reach_PIC_milestone',
    date: '2026-06-19',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## Tower and Marvell reach PIC milestone\n\nTower Semiconductor and Marvell Technology have announced a major production milestone, having shipped more than five million coherent photonic integrated circuits (PICs) to customers worldwide.\n\nThe achievement underscores the growing maturity of silicon photonics manufacturing and the increasing deployment of coherent optical interconnects in AI-driven data center infrastructure. Tower manufactures the PICs using its specialty photonic processes, while Marvell provides the coherent DSP technology and system integration.\n\nThe companies noted that demand for coherent PICs continues to accelerate as hyperscale operators expand AI computing capacity and upgrade their optical networking infrastructure to support 400G and 800G data rates.`,
  },
  {
    id: 'auto_2965b657',
    title: 'Keysight expands photonics portfolio',
    summary: 'Keysight Technologies announces new test and measurement solutions for photonic integrated circuit characterisation, targeting growing demand from silicon photonics and co-packaged optics developers.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124491/Keysight_expands_photonics_portfolio',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["Photonics"],
    importance: 'medium',
    content: `## Keysight expands photonics portfolio\n\nKeysight Technologies has announced an expanded portfolio of test and measurement solutions for photonic integrated circuit (PIC) characterisation and production testing.\n\nThe new offerings address the growing need for automated, high-throughput testing as silicon photonics moves from development to volume manufacturing. Keysight's photonics instruments support wafer-level and module-level testing of optical parameters including insertion loss, return loss, bandwidth, and modulation quality.\n\nThe company says its expanded portfolio is designed to support the full PIC development lifecycle from design validation through production screening, helping manufacturers reduce test time while maintaining measurement accuracy as production volumes scale.`,
  },
  {
    id: 'auto_96e26afa',
    title: 'China launches photonic AI lab',
    summary: 'China establishes a national photonic computing laboratory aimed at developing optical AI accelerators as an alternative to traditional electronic processors for large-scale AI workloads.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124483/China_launches_photonic_AI_lab',
    date: '2026-06-18',
    category: 'industry',
    region: 'china',
    chipTags: ["Photonic Computing"],
    importance: 'high',
    content: `## China launches photonic AI lab\n\nChina has established a national photonic computing laboratory focused on developing optical AI accelerators that could provide an alternative computing pathway for large-scale artificial intelligence workloads.\n\nThe laboratory brings together researchers from multiple Chinese universities and institutes to advance photonic matrix multiplication, optical neural network architectures, and hybrid electronic-photonic computing systems. The initiative is backed by significant government funding as part of China's broader strategy to develop indigenous computing capabilities.\n\nPhotonic computing offers potential advantages in energy efficiency and throughput for specific AI operations, particularly the matrix multiplications that dominate neural network inference. The laboratory aims to bridge the gap between academic photonic computing demonstrations and commercially viable AI accelerator products.`,
  },
  {
    id: 'auto_d51dac38',
    title: 'PICs complement electronic circuits',
    summary: 'Photonic integrated circuits are increasingly being co-designed with electronic ICs to create hybrid systems that leverage the strengths of both optical and electrical signal processing.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124465/PICs_complement_electronic_circuits',
    date: '2026-06-18',
    category: 'industry',
    region: 'global',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## PICs complement electronic circuits\n\nPhotonic integrated circuits are increasingly being designed as complementary components to electronic ICs rather than replacements, creating hybrid systems that leverage the strengths of both optical and electrical signal processing.\n\nIndustry experts note that the most successful photonic deployments combine optical components for data transport, wavelength management, and signal routing with electronic circuits for control, signal processing, and decision-making. This co-design approach is driving new EDA tools and design methodologies that bridge the photonic and electronic domains.\n\nThe trend toward electronic-photonic co-integration is accelerating with advances in advanced packaging technologies including 2.5D and 3D integration, which enable tight coupling between photonic and electronic dies while maintaining the distinct process optimisations required by each technology.`,
  },
  {
    id: 'auto_53a4d6e9',
    title: 'NTT launches $440M photonics fund',
    summary: 'NTT Corporation establishes a $440 million investment fund dedicated to photonics and optical technology companies, targeting innovations in optical computing, communications, and sensing.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124448/NTT_launches_440M_photonics_fund',
    date: '2026-06-18',
    category: 'industry',
    region: 'japan',
    chipTags: ["Photonics"],
    importance: 'high',
    content: `## NTT launches $440M photonics fund\n\nNTT Corporation has established a $440 million investment fund focused exclusively on photonics and optical technology companies worldwide, reflecting the Japanese telecommunications giant's strategic commitment to its IOWN (Innovative Optical and Wireless Network) vision.\n\nThe fund will target companies developing technologies across the photonics value chain including optical computing, silicon photonics manufacturing, advanced optical communications, and photonic sensing. NTT says the fund represents one of the largest dedicated photonics investment vehicles globally.\n\nNTT's IOWN initiative aims to transform network and computing infrastructure through end-to-end optical processing, eliminating power-intensive optical-to-electrical conversions. The investment fund is designed to accelerate the development of the photonic component ecosystem needed to realise this vision at commercial scale.`,
  },
  {
    id: 'auto_0f52f027',
    title: 'PhotonVentures on PIC investment',
    summary: 'PhotonVentures discusses the growing investment landscape for photonic integrated circuit companies as demand accelerates from AI infrastructure, telecommunications, and sensing applications.',
    source: 'PIC Magazine',
    sourceUrl: 'https://picmagazine.net/article/124437/PhotonVentures_on_PIC_investment',
    date: '2026-06-18',
    category: 'industry',
    region: 'europe',
    chipTags: ["PIC"],
    importance: 'medium',
    content: `## PhotonVentures on PIC investment\n\nPhotonVentures, the Netherlands-based venture capital firm specialising in photonics investments, has shared its perspective on the rapidly evolving investment landscape for photonic integrated circuit companies.\n\nThe firm notes that investor interest in photonics has increased significantly over the past two years, driven by growing demand for optical components in AI data center infrastructure, next-generation telecommunications networks, and emerging sensing applications. Deal sizes and valuations for photonics companies have risen accordingly.\n\nPhotonVentures highlights several key trends shaping PIC investment including the convergence of photonics with AI computing, the emergence of new material platforms such as thin-film lithium niobate, and the growing importance of photonic packaging and testing capabilities as the industry scales toward volume manufacturing.`,
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
