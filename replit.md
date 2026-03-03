# 交易员能力评测 H5

## 项目概述
一个类MBTI的交易员能力评测系统，移动端优先H5应用。用户注册后完成12道情境选择题，系统纯前端计算生成交易员人格类型、段位和雷达图结果。

## 技术栈
- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion + Recharts
- **后端**: Express.js + PostgreSQL + Drizzle ORM
- **通知**: 企业微信Webhook机器人
- **字体**: Noto Sans SC (正文), Oswald (数字)

## 核心功能
1. **用户注册/登录**: 手机号+密码注册，注册时发送企业微信通知
2. **12道情境评测题**: 6个维度（风险管理、交易心理、系统思维、市场适应、执行力、大局观）
3. **纯前端计算结果**: 12种交易员人格类型 + 6个段位等级 + 稀有度
4. **雷达图**: 6维能力可视化展示
5. **分享图片**: html2canvas生成可分享的结果卡片
6. **企业微信联系**: 结果页提供添加企业微信顾问按钮
7. **暗黑/明亮模式**: 跟随系统偏好，支持手动切换

## 体验链路
开屏页(/) → 注册(/register) → 答题(/quiz) → 加载动画(/loading) → 结果(/result) → 添加企微

## 项目结构
```
client/src/
├── pages/
│   ├── landing.tsx       # 开屏页（网格背景+浮动K线元素+呼吸灯CTA）
│   ├── register.tsx      # 注册页
│   ├── login.tsx         # 登录页
│   ├── quiz.tsx          # 答题页（12题，金色选中态）
│   ├── loading.tsx       # AI分析加载动画（扫描线+顺序打勾）
│   └── result.tsx        # 结果展示页（段位徽章+人格类型+雷达图+维度条）
├── components/
│   ├── ThemeProvider.tsx  # 暗黑/明亮模式切换（跟随系统+手动切换）
│   ├── CountUp.tsx       # 数字滚动动画组件
│   ├── ProgressBar.tsx   # 答题进度条（蓝→金渐变）
│   ├── RadarChart.tsx    # 雷达图（recharts，科技蓝填充）
│   └── ShareCard.tsx     # 分享卡片（html2canvas）
├── data/
│   ├── questions.ts      # 12道题目数据
│   └── traderTypes.ts    # 12种人格类型 + 段位 + 稀有度
├── utils/
│   └── calculateResult.ts # 评测计分逻辑
├── lib/
│   ├── auth.ts           # 认证hook
│   └── queryClient.ts    # API客户端
server/
├── routes.ts             # API路由（注册/登录/认证）
├── storage.ts            # 数据库存储层
├── db.ts                 # 数据库连接
└── webhook.ts            # 企业微信Webhook（注册通知）
shared/
└── schema.ts             # 数据模型（users only）
```

## 设计规范
- **颜色体系**:
  - 主背景: Light #F5F6FA / Dark #0A0E17
  - 卡片: Light #FFFFFF / Dark #131826
  - 金色强调: #F0B90B（CTA按钮、选中态）
  - 科技蓝: #00D4FF（进度条、雷达图）
  - 文字主: Light #1A1D26 / Dark #FFFFFF
  - 文字次: Light #6B7280 / Dark #8B95A5
- **字体**: Noto Sans SC 正文, Oswald 数字 (class: font-num)
- **品牌**: Deltapex Trading Group logo
- **动画**: CSS keyframes 优先（呼吸灯、浮动、扫描线），Framer Motion 做页面过渡
- **移动端**: 375px 基准宽度, 44px 最小触控, safe-area-inset 适配

## 数据模型
- **users**: id (serial), phone (varchar unique), password (text hashed), createdAt

## API接口
- `POST /api/register` - 注册（触发企微webhook通知）
- `POST /api/login` - 登录
- `GET /api/me` - 获取当前用户
- `POST /api/logout` - 登出

## 企业微信
- Webhook URL: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef`
- 触发时机: 用户注册时
- 联系链接: `https://work.weixin.qq.com/kfid/kfc3b42c637be3e4c33`
