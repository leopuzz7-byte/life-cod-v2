import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, getToken, setToken, type AuthUser } from "@/lib/api";
import { withTimeout } from "@/lib/withTimeout";
import i18n from "@/i18n";

export interface Profile {
  id: string;
  email: string;
  name: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
}

type AuthSession = { user: AuthUser } | null;

const PROFILE_CACHE_KEY = "lifecod-profile-cache";

function readCachedProfile(userId: string): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (cached?.id === userId) return cached as Profile;
  } catch {}
  return null;
}

function writeCachedProfile(profile: Profile | null) {
  try {
    if (profile) localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {}
}

interface AuthContextValue {
  session: AuthSession;
  user: AuthUser | null;
  profile: Profile | null;
  // true пока хотя бы одна попытка загрузки профиля завершилась (успехом или ошибкой)
  profileFetched: boolean;
  profileError: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    birth: { day: number; month: number; year: number }
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (patch: Partial<Omit<Profile, "id" | "email">>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка профиля с таймаутом и кешем в localStorage (мгновенный UI на тупящей сети)
  const loadProfile = async (userId: string) => {
    const cached = readCachedProfile(userId);
    if (cached) {
      setProfile(cached);
      setProfileFetched(true);
      setProfileError(null);
    }
    try {
      const p = await withTimeout(api.getProfile(), 10000, "Загрузка профиля");
      if (p) {
        setProfile(p as Profile);
        writeCachedProfile(p as Profile);
      } else {
        setProfile(null);
        writeCachedProfile(null);
      }
      setProfileFetched(true);
      setProfileError(null);
    } catch (err) {
      console.error("[Auth] loadProfile threw:", err);
      // сеть подвисла — оставляем кеш, показываем ошибку
      setProfileError(err instanceof Error ? err.message : i18n.t("auth.errors.network"));
      setProfileFetched(true);
    }
  };

  // На старте: если есть токен, спрашиваем сервер кто мы и подтягиваем профиль
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const { user: u, profile: p } = await withTimeout(api.me(), 15000, "Проверка сессии");
        if (cancelled) return;
        setUser(u);
        setSession({ user: u });
        if (p) {
          setProfile(p as Profile);
          writeCachedProfile(p as Profile);
        }
        setProfileFetched(true);
      } catch (e) {
        console.error("[Auth] me() failed:", e);
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setSession(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      setSession({ user: res.user });
      await loadProfile(res.user.id);
      return { error: null };
    } catch (e) {
      return { error: humanizeAuthError(e instanceof Error ? e.message : "") };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    birth: { day: number; month: number; year: number }
  ) => {
    try {
      const res = await api.register({
        email,
        password,
        name,
        birth_day: birth.day,
        birth_month: birth.month,
        birth_year: birth.year,
      });
      setToken(res.token);
      setUser(res.user);
      setSession({ user: res.user });
      await loadProfile(res.user.id);
      return { error: null };
    } catch (e) {
      return { error: humanizeAuthError(e instanceof Error ? e.message : "") };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileFetched(false);
    setProfileError(null);
    writeCachedProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await api.requestReset(email);
      return { error: null };
    } catch (e) {
      return { error: humanizeAuthError(e instanceof Error ? e.message : "") };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await api.changePassword(newPassword);
      return { error: null };
    } catch (e) {
      return { error: humanizeAuthError(e instanceof Error ? e.message : "") };
    }
  };

  const updateProfile = async (patch: Partial<Omit<Profile, "id" | "email">>) => {
    if (!user) return { error: i18n.t("auth.errors.noAuth") };
    try {
      await api.updateProfile({ ...patch, email: user.email });
      await loadProfile(user.id);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Ошибка" };
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        profileFetched,
        profileError,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Перевод сообщений об ошибках на язык интерфейса
function humanizeAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("неверная почта")) {
    return i18n.t("auth.errors.badCredentials");
  }
  if (lower.includes("already") || lower.includes("уже зарегистр")) {
    return i18n.t("auth.errors.emailExists");
  }
  if (lower.includes("at least") || lower.includes("минимум 6")) {
    return i18n.t("auth.errors.weakPassword");
  }
  if (lower.includes("invalid email")) {
    return i18n.t("auth.errors.invalidEmail");
  }
  return msg || i18n.t("auth.errors.network");
}
