// ===== ส่วนที่ 2: Backend (หลังบ้าน) + ส่วนที่ 3: Database (SQL) =====
const express = require('express');
const { DatabaseSync } = require('node:sqlite'); // SQLite ที่มากับ Node.js อยู่แล้ว ไม่ต้องติดตั้งเพิ่ม

const app = express();
const db = new DatabaseSync('game.db'); // ไฟล์ฐานข้อมูลจะถูกสร้างอัตโนมัติ
const API_KEY = process.env.API_KEY || 'change-me-please'; // รหัสลับ ต้องตรงกับในสคริปต์ Roblox
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // เปิดหน้าเว็บจากโฟลเดอร์ public

// สร้างตารางถ้ายังไม่มี
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ① รับคะแนนจากเกม Roblox
app.post('/api/score', (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'รหัสไม่ถูกต้อง' });
  }
  const { name, score } = req.body;
  if (typeof name !== 'string' || name.length === 0 || name.length > 50 ||
      !Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
  }
  // ใช้ ? แทนค่า เพื่อกัน SQL Injection
  db.prepare('INSERT INTO scores (name, score) VALUES (?, ?)').run(name, score);
  console.log(`รับคะแนน: ${name} = ${score}`);
  res.json({ ok: true });
});

// ② ส่ง 10 อันดับให้หน้าเว็บ (คะแนนที่ดีที่สุดของแต่ละคน)
app.get('/api/leaderboard', (req, res) => {
  const rows = db.prepare(`
    SELECT name, MAX(score) AS best, COUNT(*) AS plays
    FROM scores
    GROUP BY name
    ORDER BY best DESC
    LIMIT 10
  `).all();
  res.json(rows);
});

// ③ ส่งสถิติรวม
app.get('/api/stats', (req, res) => {
  const row = db.prepare(`
    SELECT COUNT(*) AS games, COUNT(DISTINCT name) AS players,
           COALESCE(MAX(score), 0) AS top
    FROM scores
  `).get();
  res.json(row);
});

app.listen(PORT, () => console.log(`เปิดที่ http://localhost:${PORT}`));
