export type ProductId = "plus" | "claude" | "midjourney" | "api";

export interface Product {
  id: ProductId;
  name: string;
  en: string;
  price: number;
  unit: string;
  note: string;
}

export const products: Product[] = [
  {
    id: "plus",
    name: "ChatGPT Plus",
    en: "OpenAI",
    price: 20,
    unit: "/ 月",
    note: "最典型的消费级入口。钱先进入模型公司，再几乎立刻变成云账单。",
  },
  {
    id: "claude",
    name: "Claude Pro",
    en: "Anthropic",
    price: 20,
    unit: "/ 月",
    note: "结构类似：订阅养推理，推理养云，云养芯片。背后站着 Amazon 与 Google 的算力。",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    en: "图像生成",
    price: 10,
    unit: "/ 月",
    note: "图像比文字更吃 GPU。同样的十美元，变成热量的速度更快。",
  },
  {
    id: "api",
    name: "API 重度",
    en: "按 token 计费",
    price: 200,
    unit: "/ 月",
    note: "真正的大数在企业 API。一次产品接入，就能把个人订阅放大十倍。",
  },
];

export interface SplitNode {
  id: string;
  label: string;
  hint: string;
  pct: number;
  color: string;
  children?: SplitNode[];
}

export const splits: Record<ProductId, SplitNode[]> = {
  plus: [
    {
      id: "compute",
      label: "算力 / 云账单",
      hint: "Azure 等云上的 GPU 小时。这是第一笔、也是最大的一笔流出。",
      pct: 0.52,
      color: "#5eead4",
      children: [
        {
          id: "gpu",
          label: "GPU 折旧 · NVIDIA",
          hint: "加速卡按 3–5 年摊销。你的月费正在帮云厂商把 H100/B200 从账上抹掉。",
          pct: 0.55,
          color: "#76b900",
          children: [
            {
              id: "nvda-profit",
              label: "NVIDIA 利润池",
              hint: "数据中心毛利率约 70%+。整条链上最肥、最稳、最像收费站的一层。",
              pct: 0.54,
              color: "#d4af37",
            },
            {
              id: "cogs",
              label: "代工 + HBM + 封装",
              hint: "台积电先进制程、SK 海力士 HBM、CoWoS 先进封装。没有它们，芯片只是图纸。",
              pct: 0.28,
              color: "#f0d78c",
              children: [
                {
                  id: "tooling",
                  label: "设备折旧 · ASML 等",
                  hint: "EUV 光刻机单台 2–4 亿美元。折旧会进入每一片晶圆的成本。",
                  pct: 0.35,
                  color: "#e85d04",
                },
                {
                  id: "materials",
                  label: "硅晶圆 / 光刻胶 / 气体",
                  hint: "信越、SUMCO、JSR。起点是石英砂，终点是原子级平整。",
                  pct: 0.2,
                  color: "#c4b5a0",
                },
                {
                  id: "fab-energy",
                  label: "晶圆厂水电",
                  hint: "一座先进工厂日耗万吨级超纯水，电负荷相当于一座小城。",
                  pct: 0.12,
                  color: "#5eead4",
                },
                {
                  id: "fab-labor",
                  label: "制造人力",
                  hint: "台湾、韩国、美国新厂的工程师与技术员。",
                  pct: 0.1,
                  color: "#9a9184",
                },
                {
                  id: "foundry-profit",
                  label: "代工 / 存储利润",
                  hint: "台积电与海力士留下的第二层厚利润。",
                  pct: 0.23,
                  color: "#d4af37",
                },
              ],
            },
            {
              id: "nvda-opex",
              label: "NVIDIA 研发与运营",
              hint: "CUDA 护城河靠年复一年的软件与架构投入堆出来。",
              pct: 0.18,
              color: "#8a7340",
            },
          ],
        },
        {
          id: "power",
          label: "电费",
          hint: "训练一次前沿模型是小镇数月的电。推理更可怕：每天数十亿次对话。",
          pct: 0.14,
          color: "#e85d04",
        },
        {
          id: "dc",
          label: "数据中心 / 冷却 / 网络",
          hint: "土地、柴油备用、液冷、光模块、变压器。AI 首先是一门土木工程。",
          pct: 0.16,
          color: "#c4b5a0",
        },
        {
          id: "cloud-labor",
          label: "云运维人力",
          hint: "值守机房、调度集群、修电缆的人，很少出现在发布会幻灯片上。",
          pct: 0.06,
          color: "#9a9184",
        },
        {
          id: "cloud-profit",
          label: "云厂商利润",
          hint: "微软、亚马逊、谷歌、甲骨文。他们既是房东，也在自己训练模型。",
          pct: 0.09,
          color: "#d4af37",
        },
      ],
    },
    {
      id: "talent",
      label: "人才与研发摊销",
      hint: "研究员、对齐团队、数据标注、安全。模型公司把估值押在这些人身上。",
      pct: 0.22,
      color: "#f0d78c",
    },
    {
      id: "opex",
      label: "安全 / 法律 / 销售",
      hint: "内容审核、诉讼、企业销售、合规。智能越强，配套的制度成本越高。",
      pct: 0.12,
      color: "#9a9184",
    },
    {
      id: "residual",
      label: "残值 · 再投入训练",
      hint: "账面上像利润，转头就被下一轮预训练吃掉。多数模型公司仍在烧未来。",
      pct: 0.14,
      color: "#d4af37",
    },
  ],
  claude: [
    {
      id: "compute",
      label: "算力 / 云账单",
      hint: "Amazon Trainium + GPU 集群，以及来自 Google 的算力投资。",
      pct: 0.5,
      color: "#5eead4",
      children: [
        {
          id: "gpu",
          label: "加速卡折旧",
          hint: "NVIDIA 仍是主力，但 Anthropic 也在消化 AWS 自研芯。",
          pct: 0.52,
          color: "#76b900",
          children: [
            {
              id: "nvda-profit",
              label: "芯片利润池",
              hint: "无论品牌印着谁，先进加速卡的经济结构都像收费站。",
              pct: 0.5,
              color: "#d4af37",
            },
            {
              id: "cogs",
              label: "代工 + HBM + 封装",
              hint: "瓶颈经常不在设计，而在 HBM 与 CoWoS。",
              pct: 0.3,
              color: "#f0d78c",
            },
            {
              id: "nvda-opex",
              label: "芯片公司运营",
              hint: "架构、编译器、驱动，软件把硬件锁进生态。",
              pct: 0.2,
              color: "#8a7340",
            },
          ],
        },
        {
          id: "power",
          label: "电费",
          hint: "长上下文推理尤其吃能量。每一次长文档，都是一次小型散热事件。",
          pct: 0.16,
          color: "#e85d04",
        },
        {
          id: "dc",
          label: "数据中心与网络",
          hint: "AWS 与 Google 的园区、光缆、冷却塔。",
          pct: 0.18,
          color: "#c4b5a0",
        },
        {
          id: "cloud-labor",
          label: "云运维",
          hint: "集群越大，凌晨被 pager 叫醒的人越多。",
          pct: 0.06,
          color: "#9a9184",
        },
        {
          id: "cloud-profit",
          label: "云利润",
          hint: "云巨头用算力换股权、换绑定、换未来分发权。",
          pct: 0.08,
          color: "#d4af37",
        },
      ],
    },
    {
      id: "talent",
      label: "对齐与研究",
      hint: "Anthropic 把更多钱写进安全与研究。这是品牌，也是成本中心。",
      pct: 0.26,
      color: "#f0d78c",
    },
    {
      id: "opex",
      label: "企业销售与合规",
      hint: "向金融机构与政府卖信任，比卖 token 更贵。",
      pct: 0.12,
      color: "#9a9184",
    },
    {
      id: "residual",
      label: "残值 / 再训练",
      hint: "下一版模型会把这一层重新烧成实验。",
      pct: 0.12,
      color: "#d4af37",
    },
  ],
  midjourney: [
    {
      id: "compute",
      label: "GPU 推理",
      hint: "扩散模型按张计费，本质是把显存和时间切成订阅。",
      pct: 0.58,
      color: "#5eead4",
      children: [
        {
          id: "gpu",
          label: "GPU 折旧",
          hint: "图像生成对显存带宽极度敏感，HBM 比核心更稀缺。",
          pct: 0.6,
          color: "#76b900",
          children: [
            {
              id: "nvda-profit",
              label: "NVIDIA 利润池",
              hint: "一张图的美学，下游是一张卡的毛利。",
              pct: 0.54,
              color: "#d4af37",
            },
            {
              id: "cogs",
              label: "代工与存储",
              hint: "同样流向台积电与海力士。",
              pct: 0.28,
              color: "#f0d78c",
            },
            {
              id: "nvda-opex",
              label: "芯片研发",
              hint: "每一代架构都在重新定价“一张图要多久”。",
              pct: 0.18,
              color: "#8a7340",
            },
          ],
        },
        {
          id: "power",
          label: "电费",
          hint: "像素比 token 更重。美是高功耗的。",
          pct: 0.15,
          color: "#e85d04",
        },
        {
          id: "dc",
          label: "集群与带宽",
          hint: "Discord 只是门面，后面是排队的推理农场。",
          pct: 0.15,
          color: "#c4b5a0",
        },
        {
          id: "cloud-labor",
          label: "运维",
          hint: "需要有人让队列在高峰时不崩。",
          pct: 0.04,
          color: "#9a9184",
        },
        {
          id: "cloud-profit",
          label: "基础设施利润",
          hint: "云与托管商抽走薄而稳定的一层。",
          pct: 0.06,
          color: "#d4af37",
        },
      ],
    },
    {
      id: "talent",
      label: "模型与审美",
      hint: "小团队，强品味。钱更多留给研究与社区，而不是销售机器。",
      pct: 0.2,
      color: "#f0d78c",
    },
    {
      id: "opex",
      label: "社区 / 支付 / 法务",
      hint: "版权是图像模型头上的剑。",
      pct: 0.1,
      color: "#9a9184",
    },
    {
      id: "residual",
      label: "工作室残值",
      hint: "独立公司里，这一层更像真正的利润。",
      pct: 0.12,
      color: "#d4af37",
    },
  ],
  api: [
    {
      id: "compute",
      label: "推理账单",
      hint: "企业流量让单位经济学暴露无遗：token 进，GPU 小时出。",
      pct: 0.6,
      color: "#5eead4",
      children: [
        {
          id: "gpu",
          label: "GPU 折旧 · NVIDIA",
          hint: "API 是把芯片租赁零售化。",
          pct: 0.58,
          color: "#76b900",
          children: [
            {
              id: "nvda-profit",
              label: "NVIDIA 利润池",
              hint: "用量越大，收费站越繁忙。",
              pct: 0.54,
              color: "#d4af37",
            },
            {
              id: "cogs",
              label: "代工 + HBM + 封装",
              hint: "每一百万 token，都在磨损一枚先进封装。",
              pct: 0.28,
              color: "#f0d78c",
            },
            {
              id: "nvda-opex",
              label: "芯片公司运营",
              hint: "软件栈决定谁能把卡卖满。",
              pct: 0.18,
              color: "#8a7340",
            },
          ],
        },
        {
          id: "power",
          label: "电费",
          hint: "推理已超过训练，成为长期电力曲线。",
          pct: 0.14,
          color: "#e85d04",
        },
        {
          id: "dc",
          label: "数据中心与互联",
          hint: "低延迟意味着机房必须靠近用户，也靠近变电站。",
          pct: 0.14,
          color: "#c4b5a0",
        },
        {
          id: "cloud-labor",
          label: "平台运维",
          hint: "SRE 是 API 的隐形成本。",
          pct: 0.05,
          color: "#9a9184",
        },
        {
          id: "cloud-profit",
          label: "云利润",
          hint: "云合约常与股权、额度、排他绑定。",
          pct: 0.09,
          color: "#d4af37",
        },
      ],
    },
    {
      id: "talent",
      label: "研究与工程",
      hint: "评测、微调、路由、限流，全是人堆出来的。",
      pct: 0.18,
      color: "#f0d78c",
    },
    {
      id: "opex",
      label: "企业成功 / 合规",
      hint: "SOC2、数据驻留、专有网络。B2B 的税。",
      pct: 0.12,
      color: "#9a9184",
    },
    {
      id: "residual",
      label: "再投入 / 薄利",
      hint: "价格战会先吃掉这一层。",
      pct: 0.1,
      color: "#d4af37",
    },
  ],
};

export interface Layer {
  id: string;
  no: string;
  title: string;
  en: string;
  who: string;
  capture: string;
  insight: string;
  stat: string;
  statLabel: string;
  image: string;
  tags: string[];
  bullets: string[];
}

export const layers: Layer[] = [
  {
    id: "you",
    no: "00",
    title: "你",
    en: "THE USER",
    who: "订阅者 · API 调用方 · 企业采购",
    capture: "买到的是智能的使用权，不是生产资料。",
    insight:
      "二十美元看起来像咖啡钱。它其实是一张算力租赁券。你没有买模型，你买的是别人把电、水和硅暂时组织成回答的权利。",
    stat: "$20",
    statLabel: "一张最常见的月票",
    image: "/images/gold-coin.jpg",
    tags: ["订阅", "Token", "租赁"],
    bullets: [
      "消费级入口被设计成无感：自动续费，按月遗忘。",
      "真正的大数藏在企业合同与 API 用量里。",
      "用户是整条河的水源，却几乎不拥有下游任何资产。",
    ],
  },
  {
    id: "labs",
    no: "01",
    title: "模型公司",
    en: "FRONTIER LABS",
    who: "OpenAI · Anthropic · Google DeepMind · xAI · Midjourney",
    capture: "收入进账，转手变成云账单、薪酬与下一轮训练。",
    insight:
      "最会讲故事的一层，往往利润最薄。2024 年 OpenAI 仅云上算力就达数十亿美元量级，其中实验与未发布模型吞掉大部分研究算力。他们留下的是品牌、数据飞轮、人才密度，以及被资本市场提前贴现的未来。",
    stat: "$1T+",
    statLabel: "OpenAI 十年级基础设施承诺量级",
    image: "/images/hero.jpg",
    tags: ["订阅收入", "亏损训练", "估值"],
    bullets: [
      "推理在养产品，训练在烧未来。两边都要付电费。",
      "模型公司更像剧组：票房归发行，设备归租赁行。",
      "股权结构里早已写进云巨头——房东也是股东。",
    ],
  },
  {
    id: "cloud",
    no: "02",
    title: "云巨头",
    en: "HYPERSCALERS",
    who: "Microsoft Azure · AWS · Google Cloud · Oracle · CoreWeave",
    capture: "把 GPU 小时零售出去，同时自己也在训练。",
    insight:
      "2026 年亚马逊、微软、谷歌、Meta 等指引的资本开支合计可到约 7000–8000 亿美元量级，接近一个中等国家的 GDP。AI 首先不是软件革命，是二战后最大规模的工业营建之一。",
    stat: "$725B",
    statLabel: "2026 年超大规模厂商资本开支量级",
    image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tags: ["Capex", "GPU 小时", "房东"],
    bullets: [
      "他们卖的不是云，是折旧中的加速卡与变压器。",
      "既当甲方又当乙方：自己的模型也在同一屋顶下抢电。",
      "新的护城河是并网容量、土地和变压器交货期。",
    ],
  },
  {
    id: "nvidia",
    no: "03",
    title: "收费站",
    en: "NVIDIA",
    who: "NVIDIA · 其次 AMD · 自研 ASIC 正在赶来",
    capture: "卖镐头的人，比淘金的人先富。",
    insight:
      "数据中心毛利率长期处在 70% 上下。CUDA 把生态锁死，HBM 与先进封装把供给锁死。你月费里最硬的一块，常常在这一层沉淀为利润，而不是在聊天窗口里。",
    stat: "70%+",
    statLabel: "数据中心业务毛利率量级",
    image: "/images/wafer.jpg",
    tags: ["CUDA", "H100/B200", "垄断租金"],
    bullets: [
      "黄仁勋卖的不是芯片，是把未来三年的算力提前贴现。",
      "自研芯片会分流，但短期替代不了 CUDA 上的软件沉积。",
      "真正的稀缺经常是 HBM 与 CoWoS，而不只是 GPU 模具。",
    ],
  },
  {
    id: "memory",
    no: "04",
    title: "显存与封装",
    en: "HBM / CoWoS",
    who: "SK hynix · Samsung · Micron · TSMC CoWoS · Broadcom",
    capture: "带宽比算力更先见顶。",
    insight:
      "大模型是内存墙的奴隶。没有高带宽存储，再强的计算核也在空转。海力士在 HBM 上的领先，让韩国成为这条河上一个突然变亮的节点。",
    stat: "HBM",
    statLabel: "比 GPU 更早售罄的零件",
    image: "https://images.pexels.com/photos/3665444/pexels-photo-3665444.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tags: ["HBM3E", "先进封装", "互联"],
    bullets: [
      "一枚加速卡的成本结构里，存储与封装正在变重。",
      "Broadcom 一类公司靠定制互联与 ASIC 吃到另一张门票。",
      "供应链短到只剩两三家时，议价权会突然倾斜。",
    ],
  },
  {
    id: "tsmc",
    no: "05",
    title: "代工神殿",
    en: "TSMC",
    who: "台积电 · 极少数能量产 5nm 以下的工厂",
    capture: "全球最先进的逻辑芯片，几乎只有一条产线能稳稳做出来。",
    insight:
      "一座先进晶圆厂投资 200–400 亿美元。它吃水、吃电、吃人才，也吃地缘政治。NVIDIA 的图纸若走不出新竹与高雄，所谓智能就会停在 PPT 里。",
    stat: "$20k",
    statLabel: "先进制程晶圆价格量级",
    image: "/images/euv-temple.jpg",
    tags: ["3nm/2nm", "水与电", "台湾"],
    bullets: [
      "晶圆是工业文明最精密的农作物，一季都不能歇。",
      "良率是一种被低估的暴力：差两个点，利润可以消失。",
      "客户越是无敌，代工厂越不可替代。",
    ],
  },
  {
    id: "asml",
    no: "06",
    title: "光的垄断",
    en: "ASML / ZEISS",
    who: "ASML · Carl Zeiss SMT · Cymer · 数百家隐形冠军",
    capture: "没有 EUV，就没有 5 纳米以下。没有蔡司的镜子，就没有 EUV。",
    insight:
      "一台极紫外光刻机售价约 2–4 亿美元，High-NA 更高。荷兰一家公司卡住全球先进制程的喉咙；德国的镜子把光折成原子可辨的形状。这是整条河上最接近“物理神权”的一层。",
    stat: "$200M+",
    statLabel: "单台 EUV 量级",
    image: "/images/euv-temple.jpg",
    tags: ["EUV", "High-NA", "蔡司"],
    bullets: [
      "光刻机不是商品，是国家能力的集装箱。",
      "出口管制写在这里，比写在模型许可证上更致命。",
      "上游越窄，下游所有估值都在租它的缝。",
    ],
  },
  {
    id: "materials",
    no: "07",
    title: "材料",
    en: "WAFERS & CHEMICALS",
    who: "信越 · SUMCO · JSR · 东京应化 · 空气化工",
    capture: "把沙子变成单晶，把气体变成可以曝光的抵抗。",
    insight:
      "一块 300 毫米晶圆，出身是高纯度石英。光刻胶、抛光液、特种气体，多由日德美的老工业公司供应。AI 的前沿，踩在一群不怎么发推的化学厂肩膀上。",
    stat: "99.9999999%",
    statLabel: "电子级硅的洁净宗教",
    image: "/images/wafer.jpg",
    tags: ["硅晶圆", "光刻胶", "特种气体"],
    bullets: [
      "材料一旦卡壳，光刻机也只是昂贵的雕塑。",
      "日本在这一层的存在感，远高于它在模型榜单上的名声。",
      "纯度是一种权力：谁能稳定供应，谁就能收税。",
    ],
  },
  {
    id: "energy",
    no: "08",
    title: "电",
    en: "WATTS",
    who: "公用事业 · 天然气 · 核能 · 电网运营商",
    capture: "所有 token 都是改了妆的千瓦时。",
    insight:
      "微软与谷歌抢购核电，亚马逊抢购整个变电站旁的土地。训练是脉冲，推理是基荷。电网比芯片更慢，于是电变成了新的排队权。你的问题被回答之前，先有一股电流穿过涡轮。",
    stat: "$23k",
    statLabel: "超大规模厂商资本开支约合每秒",
    image: "https://images.pexels.com/photos/16705829/pexels-photo-16705829.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tags: ["核电", "天然气", "并网"],
    bullets: [
      "新数据中心等变压器的时间，已经长过等下一版模型。",
      "谁掌握可调度电力，谁就掌握 2030 年的算力上限。",
      "电费最终流向燃料、铀浓缩、水电特许权与监管资产。",
    ],
  },
  {
    id: "earth",
    no: "09",
    title: "地壳",
    en: "THE PIT",
    who: "铜矿 · 钴矿 · 稀土 · 锂 · 超纯水",
    capture: "环境与人权成本很少进入模型公司的利润表。",
    insight:
      "智利与秘鲁的铜，刚果的钴，中国的稀土精炼，台湾的水。数据中心要铜排，芯片要稀有金属，冷却要水。地图上最亮的是旧金山与新竹，最暗的是矿坑。暗处才是真正的上游。",
    stat: "未入账",
    statLabel: "外部成本的会计地位",
    image: "/images/earth-vein.jpg",
    tags: ["铜", "钴", "稀土", "水"],
    bullets: [
      "一条回答链的物理尽头，是被削开的山。",
      "ESG 报告改变叙述，很少改变矿坑的坡度。",
      "地缘风险在这一层以另一种语言出现：童工、干旱、出口配额。",
    ],
  },
  {
    id: "heat",
    no: "10",
    title: "热与熵",
    en: "LANDS IN HEAT",
    who: "大气 · 冷却塔 · 河流 · 兰道尔极限",
    capture: "钱的终局不是利润，是废热。",
    insight:
      "兰道尔原理：擦除 1 比特，至少耗散 kT ln2 的能量。所有不可逆计算都在给宇宙加温。利润会再投资，芯片会折旧，矿会挖完。唯一留下的物理收据，是升高了一点点的熵。",
    stat: "kT ln2",
    statLabel: "一比特的下限",
    image: "/images/entropy.jpg",
    tags: ["废热", "不可逆", "物理收据"],
    bullets: [
      "你得到一个答案，大气得到一缕热。",
      "效率提升只会让我们问更多问题，杰文斯悖论在这里同样成立。",
      "审计到最后，货币只是能量的记账符号。",
    ],
  },
];

export interface GeoNode {
  id: string;
  name: string;
  en: string;
  x: number;
  y: number;
  role: string;
  take: string;
  heat: number;
}

export const geoNodes: GeoNode[] = [
  {
    id: "sf",
    name: "旧金山 / 西雅图",
    en: "Labs & Cloud",
    x: 14,
    y: 38,
    role: "模型、云、叙事",
    take: "收订阅，发故事，签算力合同。钱在这里进场，几乎不在这里沉淀为物。",
    heat: 0.78,
  },
  {
    id: "austin",
    name: "得州 / 弗吉尼亚",
    en: "Data Centers",
    x: 24,
    y: 46,
    role: "机房、电力负荷",
    take: "北美数据中心走廊。电、土地、税收优惠比风景重要。",
    heat: 0.7,
  },
  {
    id: "nl",
    name: "荷兰费尔德霍芬",
    en: "ASML",
    x: 48,
    y: 32,
    role: "EUV 光刻",
    take: "全球先进制程的咽喉。一台机器，一个时代。",
    heat: 0.92,
  },
  {
    id: "de",
    name: "德国奥伯科亨",
    en: "Zeiss SMT",
    x: 51,
    y: 34,
    role: "EUV 光学",
    take: "镜子必须平到原子尺度。光在这里被驯服。",
    heat: 0.8,
  },
  {
    id: "tw",
    name: "台湾",
    en: "TSMC",
    x: 78,
    y: 48,
    role: "先进代工",
    take: "世界最精密的工厂岛。水、电、地震、海峡，全是定价因子。",
    heat: 1,
  },
  {
    id: "kr",
    name: "韩国",
    en: "HBM",
    x: 80,
    y: 40,
    role: "高带宽存储",
    take: "没有 HBM，加速卡只是发热器。",
    heat: 0.88,
  },
  {
    id: "jp",
    name: "日本",
    en: "Materials",
    x: 84,
    y: 42,
    role: "晶圆与化学",
    take: "光刻胶、硅片、特种设备。安静的上游税。",
    heat: 0.74,
  },
  {
    id: "cn",
    name: "中国",
    en: "Rare Earths / Refine",
    x: 74,
    y: 42,
    role: "稀土精炼与组装",
    take: "精炼能力比矿更稀缺。出口配额能让下游发抖。",
    heat: 0.76,
  },
  {
    id: "cl",
    name: "智利",
    en: "Copper",
    x: 28,
    y: 78,
    role: "铜",
    take: "电要铜，芯片要铜，电网更要铜。",
    heat: 0.62,
  },
  {
    id: "cd",
    name: "刚果",
    en: "Cobalt",
    x: 54,
    y: 62,
    role: "钴",
    take: "电池与部分合金的阴影条款。很少出现在发布会。",
    heat: 0.58,
  },
  {
    id: "au",
    name: "澳洲",
    en: "Lithium / Ore",
    x: 84,
    y: 76,
    role: "锂与矿石",
    take: "挖出来，运去别处精炼。利润与污染不在同一处。",
    heat: 0.55,
  },
];

export interface Winner {
  name: string;
  role: string;
  margin: number;
  why: string;
  tone: "gold" | "cyan" | "ember" | "mute";
}

export const winners: Winner[] = [
  {
    name: "NVIDIA",
    role: "加速卡收费站",
    margin: 92,
    why: "生态锁定 + 供给稀缺 + 70% 级毛利。整条河最像收过路费的闸口。",
    tone: "gold",
  },
  {
    name: "ASML / 蔡司",
    role: "物理神权",
    margin: 84,
    why: "EUV 不可替代。卖的是许可能力，不是普通设备。",
    tone: "ember",
  },
  {
    name: "台积电",
    role: "先进制程唯一稳产者",
    margin: 78,
    why: "良率、规模与客户绑定。图纸必须经过这座神殿。",
    tone: "gold",
  },
  {
    name: "SK 海力士",
    role: "HBM 寡头",
    margin: 72,
    why: "带宽瓶颈让存储从配角变成卡脖子的主角。",
    tone: "cyan",
  },
  {
    name: "电力与核能",
    role: "瓦特的房东",
    margin: 64,
    why: "并网权比算法稀缺。核电与可调度电源被重新定价。",
    tone: "ember",
  },
  {
    name: "云巨头",
    role: "算力零售商",
    margin: 52,
    why: "规模巨大，但 capex 吞噬自由现金流。利润厚在软件，薄在机房。",
    tone: "cyan",
  },
  {
    name: "模型公司",
    role: "叙事与入口",
    margin: 28,
    why: "产品最炫，单位经济最狠。留下品牌与期权，现金往往流向房东。",
    tone: "mute",
  },
  {
    name: "用户",
    role: "付账的人",
    margin: 12,
    why: "得到便利与智能，不拥有权重、不拥有电厂、不拥有矿山。",
    tone: "mute",
  },
];

export const stats = [
  { k: "2026 云资本开支", v: "$725B+", d: "亚马逊、微软、谷歌、Meta 等指引合计" },
  { k: "NVIDIA 毛利率", v: "70%+", d: "数据中心业务，整条链最肥的闸口" },
  { k: "EUV 供应商", v: "1", d: "ASML。没有备选神" },
  { k: "先进代工", v: "TSMC", d: "5nm 以下的稳产几乎是单点" },
  { k: "训练 vs 推理", v: "实验更贵", d: "公开估算：大量算力烧在未发布实验" },
  { k: "终局", v: "废热", d: "兰道尔极限以下，钱变成熵" },
];

export function money(n: number) {
  if (n >= 100) return `$${n.toFixed(0)}`;
  if (n >= 10) return `$${n.toFixed(1)}`;
  return `$${n.toFixed(2)}`;
}

export function flattenPath(nodes: SplitNode[], parentPct = 1, trail: SplitNode[] = []): { node: SplitNode; abs: number; trail: SplitNode[] }[] {
  const out: { node: SplitNode; abs: number; trail: SplitNode[] }[] = [];
  for (const n of nodes) {
    const abs = parentPct * n.pct;
    const next = [...trail, n];
    out.push({ node: n, abs, trail: next });
    if (n.children) out.push(...flattenPath(n.children, abs, next));
  }
  return out;
}
