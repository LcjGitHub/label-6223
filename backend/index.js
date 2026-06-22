const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const createBuildingsRouter = require('./routes/buildings');
const createStatisticsRouter = require('./routes/statistics');

const PORT = 5000;

/**
 * 启动 Express 服务
 */
async function start() {
  const db = await initDb();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/buildings', createBuildingsRouter(db));
  app.use('/api/statistics', createStatisticsRouter(db));

  app.listen(PORT, () => {
    console.log(`老式电梯按钮样式图鉴 API 运行于 http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('启动失败:', err);
  process.exit(1);
});
