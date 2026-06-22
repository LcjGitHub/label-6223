const express = require('express');

/**
 * 创建按钮类型 CRUD 路由
 * @param {{ queryAll: Function, queryOne: Function, execute: Function }} db
 * @returns {import('express').Router}
 */
function createButtonTypesRouter(db) {
  const router = express.Router();

  /**
   * 将数据库行转为 API 响应格式
   * @param {Record<string, unknown>} row
   * @returns {object}
   */
  function formatButtonType(row) {
    return {
      id: row.id,
      type_name: row.type_name,
      material: row.material,
      shape: row.shape,
      common_era: row.common_era,
      created_at: row.created_at,
    };
  }

  /** GET /api/button-types - 按钮类型列表 */
  router.get('/', (_req, res) => {
    const rows = db.queryAll('SELECT * FROM button_types ORDER BY id ASC');
    res.json(rows.map(formatButtonType));
  });

  /** GET /api/button-types/:id - 按钮类型详情 */
  router.get('/:id', (req, res) => {
    const row = db.queryOne('SELECT * FROM button_types WHERE id = ?', [Number(req.params.id)]);
    if (!row) {
      return res.status(404).json({ message: '未找到该按钮类型' });
    }
    res.json(formatButtonType(row));
  });

  /** POST /api/button-types - 新增 */
  router.post('/', (req, res) => {
    const { type_name, material, shape, common_era } = req.body;
    if (!type_name || !material || !shape || !common_era) {
      return res.status(400).json({ message: '类型名称、材质、形状、常见年代为必填项' });
    }

    const result = db.execute(
      `INSERT INTO button_types (type_name, material, shape, common_era)
       VALUES (?, ?, ?, ?)`,
      [type_name, material, shape, common_era]
    );

    const row = db.queryOne('SELECT * FROM button_types WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(formatButtonType(row));
  });

  /** PUT /api/button-types/:id - 更新 */
  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = db.queryOne('SELECT * FROM button_types WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: '未找到该按钮类型' });
    }

    const { type_name, material, shape, common_era } = req.body;
    if (!type_name || !material || !shape || !common_era) {
      return res.status(400).json({ message: '类型名称、材质、形状、常见年代为必填项' });
    }

    db.execute(
      `UPDATE button_types SET type_name = ?, material = ?, shape = ?, common_era = ?
       WHERE id = ?`,
      [type_name, material, shape, common_era, id]
    );

    const row = db.queryOne('SELECT * FROM button_types WHERE id = ?', [id]);
    res.json(formatButtonType(row));
  });

  /** DELETE /api/button-types/:id - 删除 */
  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = db.queryOne('SELECT * FROM button_types WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: '未找到该按钮类型' });
    }

    db.execute('DELETE FROM button_types WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  });

  return router;
}

module.exports = createButtonTypesRouter;
