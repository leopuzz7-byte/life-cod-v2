import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  email: string;
  name: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
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
  const [loading, setLoading] = useState(true);

  // Загрузка профиля
  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (!error && data) {
      setProfile(data as Profile);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    // Получаем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Подписываемся на изменения сессии
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
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
    // Сначала создаём пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Отключаем подтверждение email — попросил пользователь
        emailRedirectTo: undefined,
      },
    });
    if (error) return { error: humanizeAuthError(error.message) };
    if (!data.user) return { error: "Не удалось создать пользователя" };

    // Создаём профиль
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      name,
      birth_day: birth.day,
      birth_month: birth.month,
      birth_year: birth.year,
    });

    if (profileError) {
      return { error: "Аккаунт создан, но не удалось сохранить профиль: " + profileError.message };
    }

    // Перезагружаем профиль
    await loadProfile(data.user.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
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
