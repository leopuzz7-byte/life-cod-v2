-- ============================================================
-- Life COD, схема для MySQL 8.4 (Beget Cloud DB)
-- Перенос с Supabase (PostgreSQL). Комментарии поясняют каждое
-- решение конвертации, чтобы можно было перепроверить.
--
-- Общие правила конвертации Postgres -> MySQL:
--  uuid            -> CHAR(36). id генерирует бэкенд (uuid v4),
--                    чтобы значения совпадали с тем, что было в Supabase.
--  jsonb           -> JSON (нативный тип MySQL 8).
--  timestamptz     -> DATETIME, храним время в UTC. Бэкенд при подключении
--                    ставит time_zone = '+00:00', чтобы не было сдвигов.
--  boolean         -> TINYINT(1).
--  sequence        -> AUTO_INCREMENT на orders.inv_id (номер заказа Робокассы).
--  RLS-политики    -> НЕ переносим. Доступ проверяет бэкенд по user_id из токена.
--
-- Кодировка utf8mb4 обязательна (кириллица, эмодзи в текстах).
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ------------------------------------------------------------
-- 1. Пользователи. Заменяет Supabase auth.users.
--    password_hash переносим из auth.users как есть: там bcrypt,
--    его же проверяет Node (bcrypt), поэтому пароли сохранятся.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              CHAR(36)     NOT NULL,
  email           VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  email_confirmed TINYINT(1)   NOT NULL DEFAULT 0,
  reset_token     VARCHAR(255)          DEFAULT NULL,
  reset_expires   DATETIME              DEFAULT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Профили (один к одному с users).
--    CHECK работает в MySQL 8.0.16+.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id          CHAR(36)     NOT NULL,
  email       VARCHAR(255) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  birth_day   INT          NOT NULL,
  birth_month INT          NOT NULL,
  birth_year  INT          NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT profiles_user_fk FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT profiles_day_chk   CHECK (birth_day   BETWEEN 1 AND 31),
  CONSTRAINT profiles_month_chk CHECK (birth_month BETWEEN 1 AND 12),
  CONSTRAINT profiles_year_chk  CHECK (birth_year  BETWEEN 1900 AND 2100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Сохранённые разборы. input и result это JSON.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analyses (
  id          CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  method_id   VARCHAR(100) NOT NULL,
  methodology VARCHAR(20)  NOT NULL,
  tier        VARCHAR(30)  NOT NULL,
  result_type VARCHAR(60)  NOT NULL,
  input       JSON         NOT NULL,
  result      JSON         NOT NULL,
  title       VARCHAR(255)          DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY analyses_user_created (user_id, created_at DESC),
  CONSTRAINT analyses_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Цены методик. Ключ это method_id. Цены с копейками -> DECIMAL.
--    Читаются ТОЛЬКО на сервере, с фронта цена не приходит.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS method_prices (
  method_id   VARCHAR(100)  NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  price_rub   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_basic DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_pro   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (method_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Заказы. inv_id это номер заказа для Робокассы.
--    В Postgres он брался из sequence next_inv_id. В MySQL делаем
--    inv_id AUTO_INCREMENT: при вставке заказа номер выдаётся сам,
--    бэкенд читает его через insertId. После импорта старых заказов
--    выставить AUTO_INCREMENT = max(inv_id)+1 (см. ниже).
--    amount_rub сверяется с суммой от Робокассы, тоже DECIMAL.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                  CHAR(36)      NOT NULL,
  inv_id              BIGINT        NOT NULL AUTO_INCREMENT,
  user_id             CHAR(36)               DEFAULT NULL,
  method_id           VARCHAR(100)  NOT NULL,
  tier                VARCHAR(30)   NOT NULL DEFAULT 'professional',
  amount_rub          DECIMAL(10,2) NOT NULL,
  status              VARCHAR(20)   NOT NULL DEFAULT 'pending',
  is_test             TINYINT(1)    NOT NULL DEFAULT 1,
  payment_provider    VARCHAR(30)   NOT NULL DEFAULT 'robokassa',
  provider_payment_id VARCHAR(255)           DEFAULT NULL,
  telegram_id         VARCHAR(64)            DEFAULT NULL,
  paid_at             DATETIME               DEFAULT NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY orders_inv_unique (inv_id),
  KEY orders_user (user_id),
  KEY orders_provider (payment_provider),
  KEY orders_telegram (telegram_id),
  CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1;

-- После импорта старых заказов выровнять счётчик номеров:
--   ALTER TABLE orders AUTO_INCREMENT = <max(inv_id)+1>;
