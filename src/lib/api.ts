// Тонкий клиент к нашему серверу (api.lifecod.app). Заменяет Supabase.
// Токен входа (JWT) храним в localStorage, шлём в заголовке Authorization.

const API_URL = (import.meta.env.VITE_API_URL as string) || "https://api.lifecod.app";
const TOKEN_KEY = "lifecod-token";

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

interface ReqOpts { method?: string; body?: unknown; auth?: boolean; }

async function req<T = unknown>(path: string, opts: ReqOpts = {}): Promise<T> {
  const { method = "GET", body, auth = false } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    const msg = (data && typeof data === "object" && (data as { error?: string }).error) || `Ошибка сервера (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export interface AuthUser { id: string; email: string; }
export interface ApiProfile {
  id: string; email: string; name: string;
  birth_day: number; birth_month: number; birth_year: number;
}

export const api = {
  register: (b: { email: string; password: string; name: string; birth_day: number; birth_month: number; birth_year: number }) =>
    req<{ token: string; user: AuthUser }>("/api/auth/register", { method: "POST", body: b }),
  login: (b: { email: string; password: string }) =>
    req<{ token: string; user: AuthUser }>("/api/auth/login", { method: "POST", body: b }),
  me: () => req<{ user: AuthUser; profile: ApiProfile | null }>("/api/auth/me", { auth: true }),
  requestReset: (email: string) =>
    req<{ ok: true }>("/api/auth/request-reset", { method: "POST", body: { email } }),
  resetPassword: (token: string, password: string) =>
    req<{ ok: true }>("/api/auth/reset", { method: "POST", body: { token, password } }),
  changePassword: (new_password: string) =>
    req<{ ok: true }>("/api/auth/change-password", { method: "POST", body: { new_password }, auth: true }),
  getProfile: () => req<ApiProfile | null>("/api/profile", { auth: true }),
  updateProfile: (patch: Partial<ApiProfile>) =>
    req<{ ok: true }>("/api/profile", { method: "PUT", body: patch, auth: true }),
  listAnalyses: () => req<Record<string, unknown>[]>("/api/analyses", { auth: true }),
  getAnalysis: (id: string) => req<Record<string, unknown>>(`/api/analyses/${id}`, { auth: true }),
  createAnalysis: (b: Record<string, unknown>) =>
    req<{ id: string }>("/api/analyses", { method: "POST", body: b, auth: true }),
  deleteAnalysis: (id: string) => req<{ ok: true }>(`/api/analyses/${id}`, { method: "DELETE", auth: true }),
  prices: () => req<Array<{ method_id: string; title: string; price_basic: string | number; price_pro: string | number; is_active: number }>>("/api/prices"),
  price: (methodId: string) =>
    req<{ method_id: string; title: string; price_basic: string | number; price_pro: string | number; is_active: number } | null>(`/api/prices/${methodId}`),
  createPayment: (b: { method_id: string; tier: string }) =>
    req<{ free?: boolean; payment_url?: string; order_id: string | null }>("/api/payment/create", { method: "POST", body: b, auth: true }),
  paymentStatus: (orderId: string) =>
    req<{ id: string; status: string; method_id: string; tier: string }>(`/api/payment/status/${orderId}`, { auth: true }),
};
