"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  full_name: string;
  email: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isGoogleAuthenticating: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  googleAuth: (mode: "login" | "register") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "orca_user";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persist = (next: User | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = useCallback(async ({ email }: LoginInput) => {
    setIsLoggingIn(true);
    try {
      await wait(700);
      persist({
        id: crypto.randomUUID(),
        full_name: email.split("@")[0] || "Fisher",
        email,
      });
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsRegistering(true);
    try {
      await wait(700);
      persist({
        id: crypto.randomUUID(),
        full_name: input.full_name,
        email: input.email,
      });
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const googleAuth = useCallback(async () => {
    setIsGoogleAuthenticating(true);
    try {
      await wait(700);
      persist({
        id: crypto.randomUUID(),
        full_name: "Google User",
        email: "user@gmail.com",
      });
    } finally {
      setIsGoogleAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggingIn,
        isRegistering,
        isGoogleAuthenticating,
        login,
        register,
        googleAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
