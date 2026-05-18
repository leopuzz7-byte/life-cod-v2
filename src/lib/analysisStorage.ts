import { supabase } from "@/integrations/supabase/client";

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

export async function saveAnalysis(data: CreateAnalysisInput): Promise<{ id: string | null; error: string | null }> {
  const { data: row, error } = await supabase
    .from("analyses")
    .insert(data)
    .select("id")
    .maybeSingle();
  if (error) return { id: null, error: error.message };
  return { id: row?.id || null, error: null };
}

export async function listAnalyses(userId: string): Promise<{ data: SavedAnalysis[]; error: string | null }> {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data || []) as SavedAnalysis[], error: null };
}

export async function getAnalysis(id: string): Promise<{ data: SavedAnalysis | null; error: string | null }> {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as SavedAnalysis | null, error: null };
}

export async function deleteAnalysis(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("analyses").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
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
