# 交易员能力评测 H5

## 项目概述
一个类MBTI的交易员能力评测系统，移动端优先H5应用。用户注册后完成12道情境选择题，系统纯前端计算生成交易员人格类型、段位和雷达图结果。

## 技术栈
- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion + Recharts
- **后端**: Express.js + PostgreSQL + Drizzle ORM
- **通知**: 企业微信Webhook机器人

## 核心功能
1. **用户注册/登录**: 手机号+密码注册，注册时发送企业微信通知
2. **12道情境评测题**: 6个维度（风险管理、交易心理、系统思维、市场适应、执行力、大局观）
3. **纯前端计算结果**: 12种交易员人格类型 + 6个段位等级 + 稀有度
4. **雷达图**: 6维能力可视化展示
5. **分享图片**: html2canvas生成可分享的结果卡片
6. **企业微信联系**: 结果页提供添加企业微信顾问按钮

## 体验链路
开屏页(/) → 注册(/register) → 答题(/quiz) → 加载动画(/loading) → 结果(/result) → 添加企微

## 项目结构
```
client/src/
├── pages/
│   ├── landing.tsx       # 开屏页
│   ├── register.tsx      # 注册页
│   ├── login.tsx         # 登录页
│   ├── quiz.tsx          # 答题页（12题）
│   ├── loading.tsx       # AI分析加载动画
│   └── result.tsx        # 结果展示页
├── components/
│   ├── ProgressBar.tsx   # 答题进度条
│   ├── RadarChart.tsx    # 雷达图（recharts）
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

## 数据模型
- **users**: id (serial), phone (varchar unique), password (text hashed), createdAt

## API接口
- `POST /api/register` - 注册（触发企微webhook通知）
- `POST /api/login` - 登录
- `GET /api/me` - 获取当前用户
- `POST /api/logout` - 登出

## 评测维度
- RISK: 风险管理
- MENTAL: 交易心理
- SYSTEM: 系统思维
- ADAPT: 市场适应
- EXEC: 执行力
- VISION: 大局观

## 企业微信
- Webhook URL: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef`
- 触发时机: 用户注册时
- 联系链接: `https://work.weixin.qq.com/kfid/kfc3b42c637be3e4c33`

## 设计
- 暗色主题: #0a0e1a 背景
- 渐变色: blue-500 → purple-500
- 移动端优先，H5优化
