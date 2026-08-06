import { api } from "@/lib/api";
import { withTimeout } from "@/lib/withTimeout";

const LIST_CACHE_KEY = "lifecod-analyses-cache";

export interface SavedAnalysis {
  id: string;
  user_id: string;
  method_id: string;
  methodology: string;
  tier: string;
  result_type: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  title: string | null;
  created_at: string;
}

// Лёгкая версия записи для списка "Мои разборы" —
// без тяжёлых полей input/result/user_id/result_type.
// На странице списка показываются только эти поля,
// а full-объект подгружается уже в /my-analyses/:id (getAnalysis).
export interface SavedAnalysisSummary {
  id: string;
  method_id: string;
  methodology: string;
  tier: string;
  title: string | null;
  created_at: string;
}

export interface CreateAnalysisInput {
  user_id: string;
  method_id: string;
  methodology: string;
  tier: string;
  result_type: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  title?: string | null;
}

function readCachedList(userId: string): SavedAnalysisSummary[] | null {
  try {
    const raw = localStorage.getItem(LIST_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (cached?.userId === userId && Array.isArray(cached?.items)) {
      return cached.items as SavedAnalysisSummary[];
    }
  } catch {}
  return null;
}

function writeCachedList(userId: string, items: SavedAnalysisSummary[]) {
  try {
    localStorage.setItem(LIST_CACHE_KEY, JSON.stringify({ userId, items }));
  } catch {}
}

export async function saveAnalysis(data: CreateAnalysisInput): Promise<{ id: string | null; error: string | null }> {
  try {
    const row = await withTimeout(
      api.createAnalysis(data as unknown as Record<string, unknown>),
      10000,
      "Сохранение разбора"
    );
    // Инвалидируем кеш списка — при следующем открытии «Мои разборы» подтянется свежий
    try { localStorage.removeItem(LIST_CACHE_KEY); } catch {}
    return { id: row?.id || null, error: null };
  } catch (e) {
    return { id: null, error: e instanceof Error ? e.message : "Ошибка сохранения" };
  }
}

/**
 * Возвращает список разборов (легковесный — без input/result).
 *
 * Поведение:
 *  - Если есть локальный кеш — он будет в поле `cached` (использовать для мгновенного UI)
 *  - Параллельно идёт запрос к Supabase
 *  - При успехе — `data` свежий, кеш обновлён
 *  - При сетевой ошибке/таймауте — `data` берётся из кеша, `fromCache: true`
 */
export async function listAnalyses(
  userId: string
): Promise<{ data: SavedAnalysisSummary[]; error: string | null; fromCache?: boolean }> {
  try {
    const data = await withTimeout(
      api.listAnalyses(),
      10000,
      "Загрузка списка разборов"
    );
    const items = (data || []) as unknown as SavedAnalysisSummary[];
    writeCachedList(userId, items);
    return { data: items, error: null };
  } catch (e) {
    const cached = readCachedList(userId);
    if (cached) return { data: cached, error: null, fromCache: true };
    return { data: [], error: e instanceof Error ? e.message : "Ошибка загрузки" };
  }
}

// Синхронный доступ к кешу — для мгновенного UI при первом рендере MyAnalyses.
export function getCachedAnalysesList(userId: string): SavedAnalysisSummary[] | null {
  return readCachedList(userId);
}

export async function getAnalysis(id: string): Promise<{ data: SavedAnalysis | null; error: string | null }> {
  try {
    const data = await withTimeout(
      api.getAnalysis(id),
      10000,
      "Загрузка разбора"
    );
    return { data: data as unknown as SavedAnalysis | null, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Ошибка загрузки" };
  }
}

export async function deleteAnalysis(id: string): Promise<{ error: string | null }> {
  try {
    await withTimeout(
      api.deleteAnalysis(id),
      10000,
      "Удаление разбора"
    );
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Ошибка удаления" };
  }
}

// Маппинг method_id → читаемое название
export const METHOD_LABELS: Record<string, string> = {
  purpose: "Предназначение",
  compatibility: "Совместимость",
  year: "Прогноз на год",
  month: "Прогноз на месяц",
  day: "Прогноз на день",
  ancestral: "Род",
  contract: "Энергия договора",
  name: "Энергия названия",
  finance: "Финансовый код",
  "classic-full": "Предназначение (классика)",
  "lifecod-compatibility": "Совместимость (классика)",
};

import i18n from "@/i18n";

function tr(key: string, fallback: string): string {
  const val = i18n.t(key);
  return val === key ? fallback : val;
}

export function methodLabel(methodId: string): string {
  return tr(`cfg.methods.${methodId}.savedLabel`, METHOD_LABELS[methodId] || methodId);
}

export function methodologyLabel(m: string): string {
  return m === "1"
    ? tr("cfg.methodologyLabel.1", "Методика 1 (22 Аркана)")
    : tr("cfg.methodologyLabel.2", "Методика 2 (Классика)");
}

export function tierLabel(t: string): string {
  return t === "professional"
    ? tr("cfg.tierPro", "Профессиональный")
    : tr("cfg.tierBasic", "Базовый");
}
