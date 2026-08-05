// Пул подключений к MySQL (Beget Cloud DB).
// timezone 'Z' значит все даты трактуем как UTC, без сдвигов.
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: "Z",
  charset: "utf8mb4",
});

// Небольшой помощник: вернуть строки запроса.
export async function q(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
