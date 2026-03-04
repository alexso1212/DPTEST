# 交易员能力评测 H5

## 项目概述
Deltapex Trading 主平台，移动端优先 H5 应用。包含用户系统、交易能力测评、未来扩展游戏/社群等模块。测评为类 MBTI 模式，12 道情境选择题，纯前端计算生成交易员人格类型、段位和雷达图。

## 技术栈
- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion + Recharts
- **后端**: Express.js + PostgreSQL + Drizzle ORM
- **通知**: 企业微信Webhook机器人
- **字体**: Noto Sans SC (正文), Oswald (数字/标题)

## 核心功能
1. **用户注册/登录**: 手机号+密码注册，登录后进入主页
2. **主页 Dashboard**: 显示测评状态、4小时倒计时解锁完整报告、未来功能入口（游戏/学习/社群）
3. **交易能力测评（可选）**: 12道情境题，6维度评估，结果持久化到数据库
4. **测评结果**: 段位开箱动画 + 卡牌翻转 + 雷达图 + 戳心描述 + 毛玻璃锁定详细内容
5. **完整报告页面**: `/report/:token` 公开链接，展示完整六维分数+优势+盲区+建议，无需登录
6. **4小时解锁**: 测评完成4小时后用户可从主页直接查看完整报告
7. **重新测评**: 已完成测评的用户可以重新测评
8. **分享图片**: html2canvas生成可分享的结果卡片
9. **企业微信联系**: 点击领取报告按钮推送完整画像+销售策略+报告链接到企微群

## 设计系统（v2 — Institutional Dark）
永久暗色主题，Bloomberg/量化台风格。无明/暗模式切换。

### 色彩 Tokens
| Token | 值 | 用途 |
|-------|------|------|
| `--bg-0` | `#0B0F14` | 应用底层背景 |
| `--bg-1` | `#0F1620` | 卡片/区域背景 |
| `--card` | `rgba(255,255,255,0.04)` | 浮动卡片 |
| `--border` | `rgba(255,255,255,0.08)` | 边框 |
| `--text-strong` | `#E5E7EB` | 标题/强调文字 |
| `--text` | `#CBD5E1` | 正文 |
| `--text-muted` | `#94A3B8` | 辅助文字 |
| `--primary` | `#E63946` | 主强调色（CTA按钮、选中态） |
| `--primary-rgb` | `230,57,70` | 用于 rgba() |
| `--primary-soft` | `rgba(230,57,70,0.14)` | 柔和primary背景 |
| `--primary-hover` | `#D32F3C` | hover深色 |
| `--info` | `#38BDF8` | 信息蓝 |
| `--success` | `#22C55E` | 成功绿 |
| `--warning` | `#F59E0B` | 警告黄 |
| `--danger` | `#EF4444` | 错误红 |

### 圆角 Tokens
| Token | 值 | 用途 |
|-------|------|------|
| `--radius-card` | `16px` | 卡片圆角 |
| `--radius-ui` | `12px` | 按钮/输入框圆角 |

### Tailwind 扩展
- 颜色别名: `bg0`, `bg1`, `textStrong`, `textMuted`, `primarySoft`, `primaryHover`, `info`, `success`, `warning`, `danger`
- 圆角: `rounded-card` (16px), `rounded-ui` (12px)
- 缓动: `ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)`
- 时长: `duration-240` = 240ms
- 阴影: `shadow-soft` = `0 8px 30px rgba(0,0,0,0.25)`

### 动画
- Framer Motion `motionPreset`（`client/src/lib/motion.ts`）:
  - `page`: `{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.22, ease: [0.16,1,0.3,1] } }`
  - `hoverLift`: `{ whileHover: { y: -2 }, transition: { duration: 0.2, ease: [0.16,1,0.3,1] } }`
- Tap: `scale: 0.98`
- 呼吸灯: primary glow (`.animate-breathe`)
- 页面过渡: AnimatePresence + fade/slide
- CSS: `.dp-grid` 网格背景（替代旧 `.grid-overlay`）

### 排版
- `font-heading` = Oswald (品牌/数字)
- `font-num` = Oswald mono (分数)
- `font-sans` = Noto Sans SC (正文)
- 全局 `h1-h6` 自动使用 Oswald + `--text-strong`

## 用户流程
### 新用户
首页(/) 注册 → 引导页(/onboarding, 推荐测评/可跳过) → 测评(/quiz) 或 主页(/home)

### 老用户
首页(/) 登录 → 主页(/home) → 查看历史结果 / 重新测评 / 4h后查看完整报告

### 测评流程
答题(/quiz, 12题) → 加载动画(/loading) → 结果页(/result, 段位开箱+卡牌翻转+雷达+戳心描述+毛玻璃锁定)

### 客服报告流程
用户点击"领取报告" → webhook推送完整画像+报告链接到企微群 → 客服复制链接发给用户 → 用户在微信中打开 /report/:token 查看完整报告

## 六维度说明
| 代号 | 名称 | 说明 |
|------|------|------|
| RISK | 风险管理 | 止损纪律、仓位控制、以损定盈思维 |
| MENTAL | 交易心理 | 情绪控制、压力下决策质量、耐心 |
| SYSTEM | 系统思维 | 框架、复盘、循证意识 |
| ADAPT | 市场适应 | 行情切换灵活度、学习新事物态度 |
| EXEC | 执行力 | 信号执行、纪律性 |
| EDGE | 认知格局 | 宏观视野、市场本质理解、博弈思维 |

## 12种交易员类型
| 代码 | 名称 | 维度组合 | 稀有度 |
|------|------|----------|--------|
| ER | 格局掌控者 | EDGE+RISK | 4.8% |
| ES | 体系建筑师 | EDGE+SYSTEM | 5.1% |
| EA | 全域猎鹰 | EDGE+ADAPT | 6.4% |
| EX | 趋势霸主 | EDGE+EXEC | 7.2% |
| EM | 禅定智者 | EDGE+MENTAL | 3.9% |
| RS | 铁壁指挥官 | RISK+SYSTEM | 8.3% |
| RM | 冷静猎手 | RISK+MENTAL | 7.1% |
| RE | 钢铁执行者 | RISK+EXEC | 9.5% |
| SM | 心智大师 | SYSTEM+MENTAL | 5.2% |
| SE | 算法战士 | SYSTEM+EXEC | 6.8% |
| ME | 极速闪电 | MENTAL+EXEC | 11.2% |
| MA | 百变适者 | MENTAL+ADAPT | 10.5% |

## 项目结构
```
client/src/
├── pages/
│   ├── landing.tsx       # 欢迎页（品牌展示 + 登录/注册表单）
│   ├── onboarding.tsx    # 注册引导页（推荐测评，可跳过）
│   ├── home.tsx          # 主页（测评状态 + 4h倒计时 + 完整报告入口 + 未来功能入口）
│   ├── quiz.tsx          # 答题页（12题，红色accent选中态+XP闪现）
│   ├── loading.tsx       # ID卡生成动画
│   ├── result.tsx        # 结果页（段位开箱+卡牌翻转+雷达+戳心描述+毛玻璃锁定+底部固定栏）
│   ├── report.tsx        # 完整报告页（公开，无需登录，通过shareToken访问）
│   └── not-found.tsx     # 404页面
├── components/
│   ├── ThemeProvider.tsx  # 暗色主题容器（永久暗色，无切换）
│   ├── CountUp.tsx       # 数字滚动动画组件
│   ├── ProgressBar.tsx   # 答题进度条（accent红，spring动画）
│   ├── RadarChart.tsx    # 雷达图（recharts，accent红填充）
│   └── ShareCard.tsx     # 分享卡片（不显示实际分数，防泄露）
├── data/
│   ├── questions.ts      # 12道题目数据
│   ├── traderTypes.ts    # 12种人格类型 + 段位 + 稀有度 + 戳心描述
│   └── salesStrategy.ts  # 12种类型对应的销售策略矩阵
├── utils/
│   ├── calculateResult.ts # 评测计分逻辑
│   └── webhook.ts         # 前端 webhook 工具函数
├── lib/
│   ├── auth.ts           # 认证hook（含 hasQuizResult + traderTypeCode + avgScore + rankName + quizCompletedAt）
│   └── queryClient.ts    # API客户端
server/
├── routes.ts             # API路由（注册/登录/认证 + 测评结果CRUD + 公开报告API + 双webhook）
├── storage.ts            # 数据库存储层（含 saveQuizResult / getLatestQuizResult / getQuizResultByToken）
├── db.ts                 # 数据库连接
└── webhook.ts            # 企业微信Webhook（含报告链接）
shared/
└── schema.ts             # 数据模型（users + quiz_results + shareToken）
```

## 数据模型
- **users**: id (serial), phone (varchar unique), password (text hashed), createdAt
- **quiz_results**: id (serial), userId (integer), answers (jsonb), scores (jsonb), traderTypeCode (varchar), avgScore (integer), rankName (varchar), shareToken (varchar unique), createdAt

## API接口
- `POST /api/register` - 注册
- `POST /api/login` - 登录
- `GET /api/me` - 获取当前用户（含 hasQuizResult, traderTypeCode, avgScore, rankName, quizCompletedAt）
- `POST /api/logout` - 登出
- `POST /api/quiz-result` - 保存测评结果（需登录，返回 shareToken）
- `GET /api/quiz-result` - 获取最近一次测评结果（需登录，含 shareToken）
- `GET /api/report/:token` - 公开报告接口（无需登录，通过 shareToken 获取完整测评数据）
- `POST /api/webhook/register` - 注册通知（节点1）
- `POST /api/webhook/result` - 完整画像通知（节点2，含报告链接）

## 企业微信
- Webhook URL: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef`
- 联系链接: `https://work.weixin.qq.com/ca/cawcde75d99eb3fce4`
