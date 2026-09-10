"use client";

import { useState } from "react";
import { Check, TriangleAlert, Wind, MapPin, Newspaper } from "lucide-react";
import type { AlertPreference } from "../../../../types";

interface AlertRow extends AlertPreference {
  icon: typeof TriangleAlert;
}

const ALERT_ROWS: AlertRow[] = [
  {
    id: "cyclone",
    icon: TriangleAlert,
    label: "Cyclone & Wind Warnings",
    description: "Cyclone tracks, squall warnings, and wind advisories from IMD.",
  },
  {
    id: "waves",
    icon: Wind,
    label: "High Wave & Swell Alerts",
    description: "Sudden swell and rough sea warnings for your sector.",
  },
  {
    id: "geofence",
    icon: MapPin,
    label: "Boundary & Geofence Warnings",
    description: "Alerts before you cross international waters or protected zones.",
  },
  {
    id: "pfz",
    icon: Newspaper,
    label: "Fishing Zone Advisories",
    description: "The day's potential fishing zone advisory for your home coast.",
  },
];

const DEFAULT_ON = ["cyclone", "waves", "geofence"];

export function AlertPreferencesSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(ALERT_ROWS.map((r) => [r.id, DEFAULT_ON.includes(r.id)])),
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 font-intert">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-medium text-primary">
            Hazard Alerts
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Choose which warnings reach you as push alerts, ahead of departure.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
            <Check size={14} />
            <span>Saved</span>
          </span>
        )}
      </div>

      <div className="space-y-3">
        {ALERT_ROWS.map((row) => {
          const isActive = enabled[row.id];
          return (
            <div
              key={row.id}
              className="p-4 rounded-xl border border-border bg-bg flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-primary">
                  <row.icon size={15} />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">{row.label}</p>
                  <p className="text-xs text-muted mt-0.5">{row.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEnabled((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-brand"
                    : "bg-surface-muted border border-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    isActive ? "left-5.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl btn-brand-solid text-xs font-medium cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Save Alert Settings</span>
          </button>
        </div>
      </div>
    </section>
  );
}
