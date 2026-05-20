import { supabase } from "@/integrations/supabase/client";
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
    const { data: row, error } = await withTimeout(
      supabase.from("analyses").insert(data).select("id").maybeSingle(),
      10000,
      "Сохранение разбора"
    );
    if (error) return { id: null, error: error.message };
    // Инвалидируем кеш списка — при следующем заходе подтянется свежий
    // (а до этого сразу покажется кеш без новой записи — допустимо)
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
    const { data, error } = await withTimeout(
      supabase
        .from("analyses")
        // ВАЖНО: тянем только поля нужные для списка.
        // input/result — это толстые JSON по сотням КБ, их грузим только в детальной странице.
        .select("id, method_id, methodology, tier, title, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      10000,
      "Загрузка списка разборов"
    );
    if (error) {
      const cached = readCachedList(userId);
      if (cached) return { data: cached, error: null, fromCache: true };
      return { data: [], error: error.message };
    }
    const items = (data || []) as SavedAnalysisSummary[];
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
    const { data, error } = await withTimeout(
      supabase.from("analyses").select("*").eq("id", id).maybeSingle(),
      10000,
      "Загрузка разбора"
    );
    if (error) return { data: null, error: error.message };
    return { data: data as SavedAnalysis | null, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Ошибка загрузки" };
  }
}

export async function deleteAnalysis(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await withTimeout(
      supabase.from("analyses").delete().eq("id", id),
      10000,
      "Удаление разбора"
    );
    if (error) return { error: error.message };
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

export function methodLabel(methodId: string): string {
  return METHOD_LABELS[methodId] || methodId;
}

export function methodologyLabel(m: string): string {
  return m === "1" ? "Методика 1 (22 Аркана)" : "Методика 2 (Классика)";
}

export function tierLabel(t: string): string {
  return t === "professional" ? "Профессиональный" : "Базовый";
}
