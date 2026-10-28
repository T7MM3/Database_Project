# roblox-web

เกม Roblox → Backend (Express) → SQLite → หน้าเว็บ

## รันบนเครื่องตัวเอง

```bash
npm install
API_KEY=รหัสลับของคุณ node server.js      # Windows PowerShell: $env:API_KEY="รหัสลับ"; node server.js
```

เปิด http://localhost:3000

## ทดสอบโดยไม่ต้องใช้ Roblox

```bash
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -H "x-api-key: รหัสลับของคุณ" \
  -d '{"name":"Mint","score":150}'
```

ส่งหลายชื่อ (Ben 200, Fon 90, Pao 120, Nam 60) แล้วรีเฟรชหน้าเว็บ

## ต่อกับ Roblox จริง

Roblox เรียก localhost ของเครื่องเราไม่ได้ ต้องมี URL สาธารณะ เลือกอย่างใดอย่างหนึ่ง:

1. ทดสอบชั่วคราว: `npx cloudflared tunnel --url http://localhost:3000` (หรือ ngrok) แล้วเอา URL ที่ได้ไปใส่ใน `API_URL`
2. ใช้งานจริง: เอาโฟลเดอร์นี้ขึ้น Render / Railway แล้วตั้งค่า Environment Variable ชื่อ `API_KEY`

ในเกม: วาง `roblox/ScoreSender.server.lua` ใน ServerScriptService และเปิด Allow HTTP Requests
