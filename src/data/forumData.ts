export interface ForumPost {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorOrg: string
  category: 'eml' | 'cw-laser' | 'tfln' | 'silicon-photonics' | 'photonic-computing' | 'cpo' | 'general'
  tags: string[]
  createdAt: string
  likes: number
  replies: ForumReply[]
  views: number
}

export interface ForumReply {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar: string
  createdAt: string
  likes: number
}

const STORAGE_KEY = 'photonics_forum_posts'

// Initial mock data
const initialPosts: ForumPost[] = [
  {
    id: '1',
    title: 'EML 在 400G DR4 模块中的啁啾优化方案讨论',
    content: `最近我们团队在做 400G DR4 光模块的 EML 芯片选型，遇到了一个问题：在 53 Gbaud PAM4 调制下，EML 的啁啾因子对 10km 传输的 BER 影响非常大。

我们测试了三种不同供应商的 EML 芯片：
- 供应商 A：α = 0.8，10km BER = 2e-4
- 供应商 B：α = 1.2，10km BER = 8e-4  
- 供应商 C：α = 0.5，10km BER = 5e-5

大家在实际量产中是如何平衡啁啾因子和输出功率的？有没有通过 DSP 预补偿来放宽 EML 规格要求的经验？`,
    authorId: '1',
    authorName: '张伟',
    authorAvatar: '👨‍🔬',
    authorOrg: 'MFLEX 光电事业部',
    category: 'eml',
    tags: ['400G', 'PAM4', '啁啾', 'DR4'],
    createdAt: '2026-06-01T10:30:00Z',
    likes: 12,
    views: 156,
    replies: [
      {
        id: 'r1',
        content: '我们的经验是，DSP 侧的 MLSE（最大似然序列估计）可以有效补偿 EML 啁啾引起的 ISI。配合 Tx FFE 预加重，可以把 α 的容忍范围从 <0.8 放宽到 <1.5，这样供应商选择面就大多了。',
        authorId: '3',
        authorName: '王明',
        authorAvatar: '👨‍💻',
        createdAt: '2026-06-01T14:20:00Z',
        likes: 8,
      },
      {
        id: 'r2',
        content: '补充一下学术角度的观点：我们最近的论文验证了 Kramers-Kronig 接收机配合 EML 可以实现近乎零啁啾代价的传输，不过目前还在实验室阶段。另外建议关注 TFLN 外调制方案，它从根本上解决了啁啾问题。',
        authorId: '2',
        authorName: '李娜',
        authorAvatar: '👩‍🎓',
        createdAt: '2026-06-02T09:15:00Z',
        likes: 5,
      },
    ],
  },
  {
    id: '2',
    title: 'TFLN 调制器的光纤耦合损耗问题如何解决？',
    content: `我们正在评估 TFLN MZM 用于 800G 相干模块的可行性。目前最大的痛点是光纤耦合损耗。

TFLN 波导的模场尺寸约 1μm × 0.5μm，而标准单模光纤是 10.4μm。即使用 SSC（模斑转换器），单面耦合损耗仍然在 1.5-2.5 dB。两面加起来 3-5 dB 的额外损耗，对链路预算影响很大。

请问各位有没有：
1. 更低损耗的 SSC 设计经验？
2. 用 V-groove 阵列对准的量产经验？
3. 端面抛光角度的最佳实践？`,
    authorId: '2',
    authorName: '李娜',
    authorAvatar: '👩‍🎓',
    authorOrg: '清华大学光电工程系',
    category: 'tfln',
    tags: ['TFLN', '耦合损耗', 'SSC', '800G'],
    createdAt: '2026-06-03T08:00:00Z',
    likes: 18,
    views: 243,
    replies: [
      {
        id: 'r3',
        content: '我们实测多级 SSC 可以做到单面 <1 dB 耦合损耗（含 FA 对准偏差）。关键是倒锥结构的锥尖宽度要控制在 80-120nm，长度 >300μm。V-groove 被动对准精度可以做到 ±0.5μm，对 TFLN 这种小模场还是偏大，建议考虑有源对准。',
        authorId: '3',
        authorName: '王明',
        authorAvatar: '👨‍💻',
        createdAt: '2026-06-03T11:30:00Z',
        likes: 15,
      },
    ],
  },
  {
    id: '3',
    title: 'CPO 热管理方案讨论：光芯片和 ASIC 共热域怎么办？',
    content: `在 CPO 架构中，光引擎（含 SiPh PIC + TIA/Driver IC）与 Switch ASIC 封装在同一 substrate 上。ASIC 的 TDP 动辄 500W+，表面温度可达 105°C。

但 SiPh PIC 中的微环谐振器热敏感度约 0.1nm/°C，温度波动 1°C 就会导致波长偏移需要补偿。

目前看到几种方案：
1. 热隔离 - 在 substrate 上做热断路器（thermal break）
2. 局部制冷 - TEC 只冷却光引擎区域
3. 无热设计 - 使用 MZI 代替微环，或者 athermal 材料 clad
4. 主动补偿 - 每个环加 heater，实时锁定

大家觉得哪种方案最有量产可行性？`,
    authorId: '3',
    authorName: '王明',
    authorAvatar: '👨‍💻',
    authorOrg: 'SiPh Technologies',
    category: 'cpo',
    tags: ['CPO', '热管理', '微环', 'ASIC'],
    createdAt: '2026-06-05T15:00:00Z',
    likes: 24,
    views: 312,
    replies: [],
  },
  {
    id: '4',
    title: '光计算芯片的精度瓶颈：4-bit 够用吗？',
    content: `目前大多数光计算芯片（MZI mesh 或 microring weight bank）的等效精度在 4-6 bit。主要受限于：

1. 制造偏差 → 器件间不一致
2. 热漂移 → 权重不稳定
3. 光源 RIN → 计算噪声
4. PD 暗电流 + 放大器噪声

但在 LLM 推理场景下，INT4/INT8 量化已经被证明是可行的。那么光计算的 4-bit 是否足够？

有没有人在真实模型（如 ResNet-50、GPT-2）上做过精度对比？`,
    authorId: '2',
    authorName: '李娜',
    authorAvatar: '👩‍🎓',
    authorOrg: '清华大学光电工程系',
    category: 'photonic-computing',
    tags: ['光计算', '精度', '量化', 'AI'],
    createdAt: '2026-06-06T09:00:00Z',
    likes: 31,
    views: 428,
    replies: [],
  },
]

export function getForumPosts(): ForumPost[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fall through
    }
  }
  // Initialize with mock data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts))
  return initialPosts
}

export function saveForumPosts(posts: ForumPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function addPost(post: ForumPost) {
  const posts = getForumPosts()
  posts.unshift(post)
  saveForumPosts(posts)
  return posts
}

export function addReply(postId: string, reply: ForumReply) {
  const posts = getForumPosts()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    post.replies.push(reply)
    saveForumPosts(posts)
  }
  return posts
}

export function likePost(postId: string) {
  const posts = getForumPosts()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    post.likes++
    saveForumPosts(posts)
  }
  return posts
}

export const categoryLabels: Record<string, { label: string; color: string }> = {
  'eml': { label: 'EML', color: '#ef4444' },
  'cw-laser': { label: 'CW Laser', color: '#f97316' },
  'tfln': { label: 'TFLN', color: '#eab308' },
  'silicon-photonics': { label: 'Silicon Photonics', color: '#22c55e' },
  'photonic-computing': { label: '光计算', color: '#6366f1' },
  'cpo': { label: 'CPO', color: '#ec4899' },
  'general': { label: '综合讨论', color: '#6b7280' },
}
