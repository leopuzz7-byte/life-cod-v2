import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/withTimeout";

export interface Profile {
  id: string;
  email: string;
  name: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
}

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
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  // true пока вообще ничего не известно (ни один loadProfile не завершился ни успехом ни ошибкой)
  profileFetched: boolean;
  // последняя ошибка при загрузке профиля (если есть)
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка профиля с таймаутом, кешем в localStorage и self-heal из user_metadata
  const loadProfile = async (userId: string) => {
    // 1) Сразу показываем кеш если есть (мгновенный UI даже на тупящей сети)
    const cached = readCachedProfile(userId);
    if (cached) {
      setProfile(cached);
      setProfileFetched(true);
      setProfileError(null);
    }

    // 2) Параллельно тянем свежий — но если упадёт таймаут, оставим кеш
    try {
      const { data, error } = await withTimeout(
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        10000,
        "Загрузка профиля"
      );

      if (error) {
        console.error("[Auth] profile select failed:", error);
        // Сеть подвисла — не трём кеш, не трём profile, ставим ошибку для UI
        setProfileError(error.message);
        setProfileFetched(true);
        return;
      }

      if (data) {
        const p = data as Profile;
        setProfile(p);
        writeCachedProfile(p);
        setProfileFetched(true);
        setProfileError(null);
        return;
      }

      // Профиля действительно нет в БД → пробуем self-heal из user_metadata
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const meta = currentUser?.user_metadata as Record<string, unknown> | undefined;

      if (currentUser && meta?.name && meta?.birth_day && meta?.birth_month && meta?.birth_year) {
        console.info("[Auth] profile missing → recreating from user_metadata");
        const { data: newProfile, error: upsertError } = await withTimeout(
          supabase.from("profiles").upsert({
            id: userId,
            email: currentUser.email || "",
            name: meta.name as string,
            birth_day: Number(meta.birth_day),
            birth_month: Number(meta.birth_month),
            birth_year: Number(meta.birth_year),
          }).select().maybeSingle(),
          10000,
          "Создание профиля"
        );

        if (upsertError) {
          console.error("[Auth] profile self-heal failed:", upsertError);
          setProfileError(upsertError.message);
        } else if (newProfile) {
          const p = newProfile as Profile;
          setProfile(p);
          writeCachedProfile(p);
          setProfileError(null);
        }
      } else {
        // Метаданных нет, профиля в БД нет → пользователь увидит форму создания
        setProfile(null);
        writeCachedProfile(null);
      }
      setProfileFetched(true);
    } catch (err) {
      console.error("[Auth] loadProfile threw:", err);
      // Таймаут или сетевая — оставляем что есть в кеше, показываем ошибку
      setProfileError(err instanceof Error ? err.message : "Сетевая ошибка");
      setProfileFetched(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let sessionDetermined = false;

    // Safety net срабатывает ТОЛЬКО если getSession реально завис (15 сек),
    // и НЕ срабатывает если запрос просто медленный — иначе на Ctrl+F5 мы
    // успевали поставить loading=false до того как Supabase вернул сессию,
    // и пользователя кикало на /login.
    const safetyTimeout = setTimeout(() => {
      if (!cancelled && !sessionDetermined) {
        console.error("[Auth] getSession HUNG after 15s — releasing loading state");
        setLoading(false);
      }
    }, 15000);

    // Получаем текущую сессию при загрузке
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        sessionDetermined = true;
        if (cancelled) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id)
            .catch((e) => console.error("[Auth] loadProfile failed:", e))
            .finally(() => {
              if (!cancelled) setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        sessionDetermined = true;
        console.error("[Auth] getSession failed:", e);
        if (!cancelled) setLoading(false);
      });

    // Подписываемся на изменения сессии
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id).catch((e) =>
            console.error("[Auth] loadProfile in onAuthStateChange failed:", e)
          );
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      cancelled = true;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: humanizeAuthError(error.message) };
    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    birth: { day: number; month: number; year: number }
  ) => {
    // Сначала создаём пользователя, кладём имя и дату рождения в user_metadata —
    // это страховка: если INSERT в profiles упадёт, мы потом восстановим профиль из метаданных.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          name,
          birth_day: birth.day,
          birth_month: birth.month,
          birth_year: birth.year,
        },
      },
    });
    if (error) {
      console.error("[Auth] signUp failed:", error);
      return { error: humanizeAuthError(error.message) };
    }
    if (!data.user) return { error: "Не удалось создать пользователя" };

    // Создаём профиль — используем upsert на случай если row уже есть (повторный signup, гонка и т.п.)
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      name,
      birth_day: birth.day,
      birth_month: birth.month,
      birth_year: birth.year,
    });

    if (profileError) {
      console.error("[Auth] profile upsert failed:", profileError);
      // Не блокируем регистрацию — профиль попробуем восстановить позже из user_metadata
    }

    // Перезагружаем профиль (с авто-восстановлением если нужно)
    await loadProfile(data.user.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setProfileFetched(false);
    setProfileError(null);
    writeCachedProfile(null);
  };

  const resetPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { error: humanizeAuthError(error.message) };
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: humanizeAuthError(error.message) };
    return { error: null };
  };

  const updateProfile = async (patch: Partial<Omit<Profile, "id" | "email">>) => {
    if (!user) return { error: "Нет авторизации" };
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
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

// Перевод сообщений Supabase на русский
function humanizeAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid_credentials")) {
    return "Неверный email или пароль";
  }
  if (lower.includes("user already registered") || lower.includes("already exists")) {
    return "Пользователь с таким email уже зарегистрирован";
  }
  if (lower.includes("password should be at least")) {
    return "Пароль должен быть не короче 6 символов";
  }
  if (lower.includes("invalid email")) {
    return "Некорректный email";
  }
  if (lower.includes("email rate limit") || lower.includes("over_email_send_rate_limit")) {
    return "Слишком много попыток. Подождите минуту и попробуйте ещё раз";
  }
  return msg;
}
