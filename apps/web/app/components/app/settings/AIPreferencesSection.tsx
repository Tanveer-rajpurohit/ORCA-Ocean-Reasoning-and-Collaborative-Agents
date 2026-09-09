"use client";

import { useState } from "react";
import { Bot, Check } from "lucide-react";
import { useLocalStorageState } from "../../../../hooks";
import type { AIPreferences } from "../../../../types";
import { DEFAULT_AI_PREFS } from "../../../../types";

const HELP_OPTIONS = [
  "Safety verdicts before departure",
  "Fishing zone guidance",
  "Route & fuel planning",
  "Wave & weather breakdowns",
  "Boundary & zone rules",
];

const STORAGE_KEY = "orca_ai_prefs";

export function AIPreferencesSection() {
  const [prefs, setPrefs] = useLocalStorageState<AIPreferences>(
    STORAGE_KEY,
    DEFAULT_AI_PREFS,
  );
  const [selectedHelp, setSelectedHelp] = useState<string[] | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentHelp = selectedHelp ?? prefs.help_with;

  const toggleHelp = (help: string) => {
    if (currentHelp.includes(help)) {
      setSelectedHelp(currentHelp.filter((h) => h !== help));
    } else {
      setSelectedHelp([...currentHelp, help]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rule = (formData.get("rules") as string) || "";

    setPrefs({
      help_with: currentHelp.length > 0 ? currentHelp : DEFAULT_AI_PREFS.help_with,
      rule: rule.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 font-intert">
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-brand" />
              <h2 className="text-base font-medium text-primary">
                ORCA Agent Preferences
              </h2>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Tell the agent what to prioritise when it answers you at sea.
            </p>
          </div>

          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
              <Check size={14} />
              <span>Saved</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-primary block mb-2">
              What should ORCA help you with?
            </label>
            <div className="flex flex-wrap gap-2">
              {HELP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleHelp(option)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    currentHelp.includes(option)
                      ? "btn-brand-solid shadow-xs"
                      : "bg-bg border border-border text-secondary hover:border-brand/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="orcaRules"
              className="text-xs font-medium text-primary block mb-1.5"
            >
              Custom Instructions for ORCA{" "}
              <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="orcaRules"
              name="rules"
              rows={4}
              maxLength={2000}
              defaultValue={prefs.rule}
              key={prefs.rule}
              placeholder="e.g. I run a small mechanized boat, warn me early if waves cross 2 metres, and always tell me the closest fishing zone first..."
              className="w-full bg-bg border border-border rounded-xl p-3 text-primary text-xs placeholder:text-muted focus:outline-none focus:border-brand/50 transition-all resize-none font-intert"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl btn-brand-solid text-xs font-medium cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Save Agent Preferences</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
