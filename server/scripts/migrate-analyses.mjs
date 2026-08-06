// Разовый перенос истории разборов (analyses) из Supabase в MySQL.
// Запускать на VPS: там есть интернет к Supabase и доступ к нашей базе.
//
// Нужен service_role ключ Supabase в переменной SUPABASE_SERVICE_KEY.
// DB_* берутся из server/.env (грузится через dotenv/config).
//
// Идемпотентно: перед вставкой чистит таблицу analyses, можно запускать повторно.

import "dotenv/config";
import mysql from "mysql2/promise";

const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Нет SUPABASE_SERVICE_KEY в окружении. Запусти с ключом, см. инструкцию.");
  process.exit(1);
}

const PROJECT = "thjyvcjzurjbufvthlvb";
const COLS = "id,user_id,method_id,methodology,tier,result_type,input,result,title,created_at";
const URL = `https://${PROJECT}.supabase.co/rest/v1/analyses?select=${COLS}&order=created_at.asc`;

// ISO со сдвигом зоны -> строка UTC 'YYYY-MM-DD HH:MM:SS' для MySQL DATETIME
const toMysqlDt = (iso) => new Date(iso).toISOString().slice(0, 19).replace("T", " ");

const my = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
  timezone: "Z",
});

try {
  // какие user_id реально есть, чтобы не упасть на внешнем ключе
  const [urows] = await my.query("SELECT id FROM users");
  const userIds = new Set(urows.map((r) => r.id));

  // тянем все разборы из Supabase (147 < 1000, пагинация не нужна)
  const res = await fetch(URL, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) {
    console.error("Supabase ответил", res.status, (await res.text()).slice(0, 300));
    process.exit(1);
  }
  const rows = await res.json();
  console.log("Из Supabase получено разборов:", rows.length);

  await my.query("SET FOREIGN_KEY_CHECKS=0");
  await my.query("DELETE FROM analyses");

  let ins = 0, skip = 0;
  for (const r of rows) {
    if (!userIds.has(r.user_id)) { skip++; continue; }
    await my.execute(
      `INSERT INTO analyses (id,user_id,method_id,methodology,tier,result_type,input,result,title,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        r.id, r.user_id, r.method_id, r.methodology, r.tier, r.result_type,
        JSON.stringify(r.input ?? null), JSON.stringify(r.result ?? null),
        r.title ?? null, toMysqlDt(r.created_at),
      ]
    );
    ins++;
  }
  await my.query("SET FOREIGN_KEY_CHECKS=1");

  const [[cnt]] = await my.query("SELECT COUNT(*) AS n FROM analyses");
  console.log(`Готово. Вставлено: ${ins}, пропущено без пользователя: ${skip}, в таблице теперь: ${cnt.n}`);
} catch (e) {
  console.error("ОШИБКА:", e.message);
  process.exitCode = 1;
} finally {
  await my.end();
}
