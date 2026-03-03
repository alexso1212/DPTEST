# 企业成长力测评 H5

## 项目概述
一个移动端优先的H5客户测评问卷系统，用于收集客户画像信息。客户注册和提交问卷时，系统通过企业微信Webhook实时通知销售团队。

## 技术栈
- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion
- **后端**: Express.js + PostgreSQL + Drizzle ORM
- **通知**: 企业微信Webhook机器人

## 核心功能
1. **用户注册/登录**: 手机号+密码注册，注册时发送企业微信通知
2. **多步骤问卷**: 3步收集客户画像（基本信息、业务挑战、精进目标）
3. **企业微信通知**: 注册和提交问卷时自动通过Webhook发送通知
4. **企业微信联系**: 完成页面提供"添加企业微信顾问"按钮

## 项目结构
```
client/src/
├── pages/
│   ├── landing.tsx      # 首页/引导页
│   ├── register.tsx     # 注册页
│   ├── login.tsx        # 登录页
│   ├── survey.tsx       # 问卷页（3步）
│   └── complete.tsx     # 完成页
├── lib/
│   ├── auth.ts          # 认证hook
│   └── queryClient.ts   # API客户端
server/
├── routes.ts            # API路由
├── storage.ts           # 数据库存储层
├── db.ts                # 数据库连接
└── webhook.ts           # 企业微信Webhook
shared/
└── schema.ts            # 数据模型（users, surveyResponses）
```

## 数据模型
- **users**: id, phone, password, name, createdAt
- **surveyResponses**: id, userId, name, company, position, industry, companySize, challenges[], improvementAreas[], budget, timeline, additionalNotes, createdAt

## API接口
- `POST /api/register` - 注册
- `POST /api/login` - 登录
- `GET /api/me` - 获取当前用户
- `POST /api/survey` - 提交问卷
- `POST /api/logout` - 登出

## 企业微信Webhook
- URL: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef`
- 触发时机: 用户注册时、问卷提交时
