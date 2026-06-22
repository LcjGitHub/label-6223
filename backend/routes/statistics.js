const express = require('express');

/**
 * 创建统计路由
 * @param {{ queryAll: Function, queryOne: Function, execute: Function }} db
 * @returns {import('express').Router}
 */
function createStatisticsRouter(db) {
  const router = express.Router();

  /**
   * GET /api/statistics - 获取各城市建筑统计数据
   * 返回：
   *   summary: { total, in_use, retired } 汇总统计
   *   byCity: Array<{ city, total, in_use, retired }> 各城市分布
   */
  router.get('/', (_req, res) => {
    const cityRows = db.queryAll(`
      SELECT
        city,
        COUNT(*) AS total,
        SUM(CASE WHEN still_in_use = 1 THEN 1 ELSE 0 END) AS in_use,
        SUM(CASE WHEN still_in_use = 0 THEN 1 ELSE 0 END) AS retired
      FROM buildings
      GROUP BY city
      ORDER BY total DESC
    `);

    const byCity = cityRows.map((row) => ({
      city: row.city,
      total: Number(row.total),
      in_use: Number(row.in_use),
      retired: Number(row.retired),
    }));

    const summary = byCity.reduce(
      (acc, item) => ({
        total: acc.total + item.total,
        in_use: acc.in_use + item.in_use,
        retired: acc.retired + item.retired,
      }),
      { total: 0, in_use: 0, retired: 0 }
    );

    res.json({
      summary,
      byCity,
    });
  });

  return router;
}

module.exports = createStatisticsRouter;
