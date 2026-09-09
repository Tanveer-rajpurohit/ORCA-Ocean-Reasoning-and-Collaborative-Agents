"use client";

import { Languages, Check } from "lucide-react";
import { useLocalStorageState } from "../../../../hooks";

const LANGUAGE_OPTIONS = [
  { id: "auto", name: "Auto Detect", hint: "From your speech or typing" },
  { id: "ta", name: "Tamil", hint: "தமிழ்" },
  { id: "te", name: "Telugu", hint: "తెలుగు" },
  { id: "ml", name: "Malayalam", hint: "മലയാളം" },
  { id: "mr", name: "Marathi", hint: "मराठी" },
  { id: "kn", name: "Kannada", hint: "ಕನ್ನಡ" },
  { id: "gom", name: "Konkani", hint: "कोंकणी" },
  { id: "gu", name: "Gujarati", hint: "ગુજરાતી" },
  { id: "bn", name: "Bengali", hint: "বাংলা" },
  { id: "or", name: "Odia", hint: "ଓଡ଼ିଆ" },
  { id: "hi", name: "Hindi", hint: "हिन्दी" },
  { id: "en", name: "English", hint: "English" },
];

const STORAGE_KEY = "orca_language";

export function LanguageSection() {
  const [selected, setSelected] = useLocalStorageState<string>(
    STORAGE_KEY,
    "auto",
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 font-intert">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-primary">
              Language &amp; Voice
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-medium border border-brand/20">
              <Languages size={10} />
              Sarvam AI
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            The language ORCA answers and speaks in. Auto Detect matches
            whatever you say or type.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = selected === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-brand bg-brand/5 shadow-xs"
                  : "border-border bg-bg hover:bg-surface-muted hover:border-border/80"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>

              <span className="text-xs font-semibold text-primary">
                {option.name}
              </span>
              <span className="text-[11px] text-muted">{option.hint}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
