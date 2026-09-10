"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useLocalStorageState } from "../hooks";
import type { User, LoginInput, RegisterInput } from "../types";

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

const DEMO_USER: User = {
  id: "demo",
  full_name: "Tanveer Singh",
  email: "tanveer@orca.in",
};

type StoredUser = User | "signed-out";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function nameFromEmail(email: string): string {
  return (
    (email.split("@")[0] ?? "")
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Fisher"
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedUser, setStoredUser] = useLocalStorageState<StoredUser>(
    STORAGE_KEY,
    DEMO_USER,
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);

  const user = storedUser === "signed-out" ? null : storedUser;

  const setUser = useCallback(
    (next: User | null) => {
      setStoredUser(next ?? "signed-out");
    },
    [setStoredUser],
  );

  const login = useCallback(
    async ({ email }: LoginInput) => {
      setIsLoggingIn(true);
      try {
        await wait(700);
        setUser({
          id: crypto.randomUUID(),
          full_name: nameFromEmail(email),
          email,
        });
      } finally {
        setIsLoggingIn(false);
      }
    },
    [setUser],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      setIsRegistering(true);
      try {
        await wait(700);
        setUser({
          id: crypto.randomUUID(),
          full_name: input.full_name,
          email: input.email,
        });
      } finally {
        setIsRegistering(false);
      }
    },
    [setUser],
  );

  const googleAuth = useCallback(async () => {
    setIsGoogleAuthenticating(true);
    try {
      await wait(700);
      setUser({
        id: crypto.randomUUID(),
        full_name: "Google User",
        email: "user@gmail.com",
      });
    } finally {
      setIsGoogleAuthenticating(false);
    }
  }, [setUser]);

  const logout = useCallback(() => setUser(null), [setUser]);

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
