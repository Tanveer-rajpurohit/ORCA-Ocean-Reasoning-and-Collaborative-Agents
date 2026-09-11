"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";
import { Select } from "./Select";

const THEMES: { label: string; value: Theme; color: string }[] = [
  { label: "Ocean Classic", value: "default", color: "#193e53" },
  { label: "Tropical Lush", value: "tropical-lush", color: "#0F766E" },
  { label: "Clay White", value: "clay-white", color: "#a6634c" },
  { label: "Sage Harbor", value: "sage-harbor", color: "#4A5D4E" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-primary hover:bg-surface-muted transition-colors cursor-pointer"
      >
        <div
          className="w-3 h-3 rounded-full border border-border"
          style={{ backgroundColor: THEMES.find(t => t.value === theme)?.color }}
        />
        <span className="hidden sm:inline">{THEMES.find(t => t.value === theme)?.label}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-border shadow-lg z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                theme === t.value ? "bg-surface-muted text-brand" : "text-primary hover:bg-surface-muted"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full border border-border shrink-0"
                style={{ backgroundColor: t.color }}
              />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
