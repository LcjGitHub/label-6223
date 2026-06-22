const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'elevator.db');

/** @type {import('sql.js').Database} */
let db;

/**
 * 将内存数据库持久化到磁盘
 */
function persist() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

/**
 * 执行查询并返回所有行
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Record<string, unknown>[]}
 */
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * 执行查询并返回首行
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Record<string, unknown>|null}
 */
function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] ?? null;
}

/**
 * 执行写操作并持久化
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {{ lastInsertRowid: number, changes: number }}
 */
function execute(sql, params = []) {
  db.run(sql, params);
  const idRow = queryOne('SELECT last_insert_rowid() AS id');
  const changesRow = queryOne('SELECT changes() AS cnt');
  persist();
  return {
    lastInsertRowid: Number(idRow?.id ?? 0),
    changes: Number(changesRow?.cnt ?? 0),
  };
}

/**
 * 初始化数据库表结构
 */
function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS buildings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      era TEXT NOT NULL,
      button_type TEXT NOT NULL,
      still_in_use INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  persist();
}

/**
 * 种子数据：5 条典型老式电梯按钮样式记录
 */
function seedData() {
  const count = queryOne('SELECT COUNT(*) AS cnt FROM buildings');
  if (Number(count?.cnt) > 0) return;

  const seeds = [
    ['和平饭店', '上海', '1920年代', '黄铜圆形机械按钮', 0],
    ['百老汇大厦', '上海', '1930年代', '黑色胶木方形按钮', 1],
    ['国际饭店', '上海', '1930年代', '镀铬金属拨杆式', 0],
    ['锦江饭店', '上海', '1950年代', '绿色圆形荧光按钮', 1],
    ['北京饭店', '北京', '1910年代', '铸铁星形装饰按钮', 0],
  ];

  for (const row of seeds) {
    db.run(
      `INSERT INTO buildings (name, city, era, button_type, still_in_use)
       VALUES (?, ?, ?, ?, ?)`,
      row
    );
  }
  persist();
}

/**
 * 初始化并打开 SQLite 数据库
 * @returns {Promise<{ queryAll: typeof queryAll, queryOne: typeof queryOne, execute: typeof execute }>}
 */
async function initDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }

  initSchema();
  seedData();

  return { queryAll, queryOne, execute };
}

module.exports = { initDb };
