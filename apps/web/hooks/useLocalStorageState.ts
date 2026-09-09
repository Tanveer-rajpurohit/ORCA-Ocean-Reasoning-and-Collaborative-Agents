"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribeToStorage(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  const handleStorage = () => onStoreChange();
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

type Updater<T> = T | ((prev: T) => T);

function parseRaw<T>(raw: string | null, defaultValue: T): T {
  if (raw === null) return defaultValue;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (next: Updater<T>) => void] {
  const getSnapshot = useCallback(
    () => window.localStorage.getItem(key),
    [key],
  );
  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot,
  );
  const value = parseRaw(raw, defaultValue);

  const setValue = useCallback(
    (next: Updater<T>) => {
      const prev = parseRaw(window.localStorage.getItem(key), defaultValue);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      if (resolved === null || resolved === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      }
      listeners.forEach((listener) => listener());
    },
    [key, defaultValue],
  );

  return [value, setValue];
}
