# 老式电梯按钮样式图鉴

收录各年代建筑中仍存或已退役的电梯按钮样式，支持列表浏览、详情查看与基础 CRUD。

## 技术栈

| 层级 | 技术 | 端口 |
|------|------|------|
| 前端 | Vue 3 + Element Plus + axios | 5101 |
| 后端 | Express + SQLite | 5000 |

## 项目结构

```
├── backend/          # Express API + SQLite
│   ├── data/         # elevator.db（首次启动自动创建）
│   ├── routes/
│   └── index.js
├── frontend/         # Vue 3 前端
│   └── src/
└── README.md
```

## 启动方式

需要 Node.js 18+。依赖均在各自目录内安装，无需全局 pnpm/yarn。

### 1. 后端（一条命令）

```bash
cd backend
npm install
npm start
```

后端运行于 http://localhost:5000，首次启动会自动创建数据库并写入 5 条 seed 数据。

### 2. 前端

另开终端：

```bash
cd frontend
npm install
npm run dev
```

前端运行于 http://localhost:5101，API 请求通过 Vite 代理转发至后端。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/buildings` | 样式列表 |
| GET | `/api/buildings/:id` | 建筑详情 |
| POST | `/api/buildings` | 新增 |
| PUT | `/api/buildings/:id` | 更新 |
| DELETE | `/api/buildings/:id` | 删除 |

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 建筑名 |
| city | string | 城市 |
| era | string | 年代 |
| button_type | string | 按钮类型 |
| still_in_use | boolean | 是否仍在用 |

## Seed 数据

首次启动内置 5 条记录：和平饭店、百老汇大厦、国际饭店、锦江饭店、北京饭店。
