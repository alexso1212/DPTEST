# 交易员能力评测 H5

## 项目概述
Deltapex Trading 主平台，移动端优先 H5 应用。包含用户系统、交易能力测评、未来扩展游戏/社群等模块。测评为类 MBTI 模式，12 道情境选择题，纯前端计算生成交易员人格类型、段位和雷达图。

## 技术栈
- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion + Recharts
- **后端**: Express.js + PostgreSQL + Drizzle ORM
- **通知**: 企业微信Webhook机器人
- **字体**: Noto Sans SC (正文), Oswald (数字)

## 核心功能
1. **用户注册/登录**: 手机号+密码注册，登录后进入主页
2. **主页 Dashboard**: 显示测评状态、未来功能入口（游戏/学习/社群）
3. **交易能力测评（可选）**: 12道情境题，6维度评估，结果持久化到数据库
4. **测评结果**: 段位开箱动画 + 卡牌翻转 + 雷达图 + 戳心描述
5. **重新测评**: 已完成测评的用户可以重新测评
6. **分享图片**: html2canvas生成可分享的结果卡片
7. **企业微信联系**: 点击领取报告按钮推送完整画像+销售策略到企微群
8. **暗黑/明亮模式**: 跟随系统偏好，支持手动切换

## 用户流程
### 新用户
首页(/) 注册 → 引导页(/onboarding, 推荐测评/可跳过) → 测评(/quiz) 或 主页(/home)

### 老用户
首页(/) 登录 → 主页(/home) → 查看历史结果 / 重新测评 / 开始测评

### 测评流程
答题(/quiz, 12题) → 加载动画(/loading) → 结果页(/result, 段位开箱+卡牌翻转+雷达+戳心描述+锁定内容)

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
│   ├── home.tsx          # 主页（测评状态 + 未来功能入口）
│   ├── quiz.tsx          # 答题页（12题，金色选中态+XP闪现）
│   ├── loading.tsx       # ID卡生成动画
│   └── result.tsx        # 结果页（段位开箱+卡牌翻转+雷达+戳心描述+毛玻璃锁定+底部固定栏）
├── components/
│   ├── ThemeProvider.tsx  # 暗黑/明亮模式切换
│   ├── CountUp.tsx       # 数字滚动动画组件
│   ├── ProgressBar.tsx   # 答题进度条（蓝→金渐变，spring 动画）
│   ├── RadarChart.tsx    # 雷达图（recharts，科技蓝填充）
│   └── ShareCard.tsx     # 分享卡片（不显示实际分数，防泄露）
├── data/
│   ├── questions.ts      # 12道题目数据
│   ├── traderTypes.ts    # 12种人格类型 + 段位 + 稀有度 + 戳心描述
│   └── salesStrategy.ts  # 12种类型对应的销售策略矩阵
├── utils/
│   ├── calculateResult.ts # 评测计分逻辑
│   └── webhook.ts         # 前端 webhook 工具函数
├── lib/
│   ├── auth.ts           # 认证hook（含 hasQuizResult 字段）
│   └── queryClient.ts    # API客户端
server/
├── routes.ts             # API路由（注册/登录/认证 + 测评结果CRUD + 双webhook）
├── storage.ts            # 数据库存储层（含 saveQuizResult / getLatestQuizResult）
├── db.ts                 # 数据库连接
└── webhook.ts            # 企业微信Webhook
shared/
└── schema.ts             # 数据模型（users + quiz_results）
```

## 设计规范
- **颜色体系**:
  - 主背景: Light #F5F6FA / Dark #0A0E17
  - 卡片: Light #FFFFFF / Dark #131826
  - 金色强调: #F0B90B（CTA按钮、选中态）
  - 科技蓝: #00D4FF（进度条、雷达图）
- **动画**: Framer Motion spring 物理为主，CSS keyframes 为辅
  - 页面过渡: AnimatePresence + motion.div (spring)
  - 按钮: whileTap/whileHover 弹簧反馈
  - 进度条: spring 动画 (h-1.5 = 6px)
- **底栏**: rgba(var(--bg-primary-rgb), 0.9) 主题感知透明度
- **移动端**: 375px 基准宽度, 44px 最小触控, safe-area-inset 适配

## 数据模型
- **users**: id (serial), phone (varchar unique), password (text hashed), createdAt
- **quiz_results**: id (serial), userId (integer), answers (jsonb), scores (jsonb), traderTypeCode (varchar), avgScore (integer), rankName (varchar), createdAt

## API接口
- `POST /api/register` - 注册
- `POST /api/login` - 登录
- `GET /api/me` - 获取当前用户（含 hasQuizResult）
- `POST /api/logout` - 登出
- `POST /api/quiz-result` - 保存测评结果（需登录）
- `GET /api/quiz-result` - 获取最近一次测评结果（需登录）
- `POST /api/webhook/register` - 注册通知（节点1）
- `POST /api/webhook/result` - 完整画像通知（节点2）

## 企业微信
- Webhook URL: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef`
- 联系链接: `https://work.weixin.qq.com/ca/cawcde75d99eb3fce4`
