# Eat Health

移动优先的低 FODMAP 健康餐馆地图与个人食物/症状记录 MVP。

## 功能

- 公开餐馆地图与列表：餐馆创建、低 FODMAP 标签、社区评分和详情页。
- 个人记录：按日期登记早餐、午餐、晚餐，记录当天症状严重程度和基础趋势统计。
- MVP 登录：邮箱 cookie 会话，用于保护餐馆写入、评分和个人记录。
- 健康边界：产品只做记录和社区信息整理，不提供诊断或医疗建议。

## 本地启动

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量：

```bash
cp .env.example .env
```

3. 启动 PostgreSQL，并设置 `.env` 中的 `DATABASE_URL`。

4. 创建数据库表：

```bash
npm run prisma:migrate
```

5. 启动开发服务器：

```bash
npm run dev
```

## 地图配置

设置 `NEXT_PUBLIC_AMAP_KEY` 后启用高德地图 Web JS API。未配置时，首页会降级为列表和坐标模式。

## 验证

```bash
npm run lint
npm run test
npm run build
```

## 部署

推荐免费 MVP 方案：Vercel + Neon Postgres。详见 [DEPLOYMENT.md](./DEPLOYMENT.md)。
