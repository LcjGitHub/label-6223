const express = require('express');

/**
 * 创建建筑 CRUD 路由
 * @param {{ queryAll: Function, queryOne: Function, execute: Function }} db
 * @returns {import('express').Router}
 */
function createBuildingsRouter(db) {
  const router = express.Router();

  /**
   * 将数据库行转为 API 响应格式
   * @param {Record<string, unknown>} row
   * @returns {object}
   */
  function formatBuilding(row) {
    return {
      id: row.id,
      name: row.name,
      city: row.city,
      era: row.era,
      button_type: row.button_type,
      still_in_use: Boolean(row.still_in_use),
      created_at: row.created_at,
    };
  }

  /** GET /api/buildings - 样式列表 */
  router.get('/', (_req, res) => {
    const rows = db.queryAll('SELECT * FROM buildings ORDER BY id ASC');
    res.json(rows.map(formatBuilding));
  });

  /** GET /api/buildings/:id - 建筑详情 */
  router.get('/:id', (req, res) => {
    const row = db.queryOne('SELECT * FROM buildings WHERE id = ?', [Number(req.params.id)]);
    if (!row) {
      return res.status(404).json({ message: '未找到该建筑记录' });
    }
    res.json(formatBuilding(row));
  });

  /** POST /api/buildings - 新增 */
  router.post('/', (req, res) => {
    const { name, city, era, button_type, still_in_use } = req.body;
    if (!name || !city || !era || !button_type) {
      return res.status(400).json({ message: '建筑名、城市、年代、按钮类型为必填项' });
    }

    const result = db.execute(
      `INSERT INTO buildings (name, city, era, button_type, still_in_use)
       VALUES (?, ?, ?, ?, ?)`,
      [name, city, era, button_type, still_in_use ? 1 : 0]
    );

    const row = db.queryOne('SELECT * FROM buildings WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(formatBuilding(row));
  });

  /** PUT /api/buildings/:id - 更新 */
  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = db.queryOne('SELECT * FROM buildings WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: '未找到该建筑记录' });
    }

    const { name, city, era, button_type, still_in_use } = req.body;
    if (!name || !city || !era || !button_type) {
      return res.status(400).json({ message: '建筑名、城市、年代、按钮类型为必填项' });
    }

    db.execute(
      `UPDATE buildings SET name = ?, city = ?, era = ?, button_type = ?, still_in_use = ?
       WHERE id = ?`,
      [name, city, era, button_type, still_in_use ? 1 : 0, id]
    );

    const row = db.queryOne('SELECT * FROM buildings WHERE id = ?', [id]);
    res.json(formatBuilding(row));
  });

  /** DELETE /api/buildings/:id - 删除 */
  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = db.queryOne('SELECT * FROM buildings WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: '未找到该建筑记录' });
    }

    db.execute('DELETE FROM buildings WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  });

  return router;
}

module.exports = createBuildingsRouter;
