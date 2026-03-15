# DPTEST - 德湃交易工具官网

## 技术栈
- TypeScript 全栈（Vite + React 前端，Express 后端）
- Tailwind CSS + shadcn/ui
- Drizzle ORM（PostgreSQL）
- 包管理: npm

## 部署

- **平台**: Fly.io
- **App**: `dptest-org`
- **区域**: `sin`（新加坡）
- **线上地址**: https://dptest-org.fly.dev/
- **配置**: `fly.toml`

### 部署命令

```bash
fly deploy
```

一条命令搞定，Docker 自动构建 + 推送 + 滚动更新。

### 部署后验证

```bash
fly status
```

确认 machines 状态正常即可。
