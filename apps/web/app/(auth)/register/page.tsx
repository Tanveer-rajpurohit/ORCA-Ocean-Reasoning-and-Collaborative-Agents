"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  AuthFormCard,
  AuthInput,
  PasswordStrengthBar,
  GoogleAuthButton,
} from "../../components/auth";
import { useAuth } from "../../../context/AuthContext";

type Strength = 0 | 1 | 2 | 3 | 4;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, isRegistering } = useAuth();
  const router = useRouter();

  const strength = useMemo<Strength>(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 7) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return (score || 1) as Strength;
  }, [password]);

  const validate = (): boolean => {
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter a valid full name (at least 2 characters).");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    try {
      await register({
        full_name: name.trim(),
        email: email.trim(),
        password,
      });
      router.push("/chat");
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unable to create account. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <AuthFormCard>
        <div className="mb-6">
          <h1 className="font-instrument text-3xl text-primary mb-1.5">
            Create your account
          </h1>
          <p className="font-intert text-secondary text-sm">
            Fishing zone advisories, sea conditions, and hazard alerts in your
            language.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium font-intert">
            {errorMessage}
          </div>
        )}

        <GoogleAuthButton
          mode="register"
          text="Continue with Google"
          onError={(msg) => setErrorMessage(msg)}
        />

        <div className="mb-6 mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-bg text-muted font-intert">
                or sign up with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Your Name"
            type="text"
            placeholder="Arjun Menon"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <AuthInput
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />
            {password.length > 0 && <PasswordStrengthBar strength={strength} />}
          </div>

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle
            required
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-2.5 px-4 rounded-xl btn-brand-solid text-xs font-medium cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-muted font-intert">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
