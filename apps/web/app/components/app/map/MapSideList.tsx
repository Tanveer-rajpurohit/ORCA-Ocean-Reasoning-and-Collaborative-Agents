"use client";

import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import type { MapDataMode } from "../../../../types";

interface SideRow {
  mode: MapDataMode;
  label: string;
  value: string;
  hint: string;
}

const ROWS: SideRow[] = [
  { mode: "waves", label: "Waves", value: "1.4 m", hint: "Slight" },
  { mode: "wind", label: "Wind", value: "12 km/h", hint: "North-west" },
  {
    mode: "temperature",
    label: "Sea warmth",
    value: "28.4 °C",
    hint: "0.8° above normal",
  },
  {
    mode: "zones",
    label: "Fishing zones",
    value: "2 zones",
    hint: "38 km and 52 km out",
  },
];

const HERO_METRICS: Record<
  MapDataMode,
  {
    value: string;
    unit: string;
    label: string;
    badge: string;
    badgeColor: string;
    detail: string;
  }
> = {
  waves: {
    value: "1.4",
    unit: "m",
    label: "Significant wave height",
    badge: "Within safe range",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    detail: "Operating within safe boat limit",
  },
  wind: {
    value: "12",
    unit: "km/h",
    label: "Coastal surface wind",
    badge: "Gentle breeze · 6.5 kts",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    detail: "North-west coastal drift",
  },
  temperature: {
    value: "28.4",
    unit: "°C",
    label: "Sea surface temperature",
    badge: "+0.8°C thermal anomaly",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    detail: "Pelagic front along 20-fathom contour",
  },
  zones: {
    value: "2",
    unit: "zones",
    label: "Potential fishing zones",
    badge: "INCOIS verified",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    detail: "Pelagic shoals at 38 km and 52 km",
  },
};

const MODE_TELEMETRY: Record<
  MapDataMode,
  { label: string; value: string }[]
> = {
  waves: [
    { label: "Dominant period", value: "8.2 seconds" },
    { label: "Swell direction", value: "SW (220°)" },
    { label: "Tidal stream", value: "Ebb · 0.6 kts" },
  ],
  wind: [
    { label: "Beaufort force", value: "Force 3 (Gentle)" },
    { label: "Peak offshore gust", value: "18 km/h" },
    { label: "Squall probability", value: "Low (< 15%)" },
  ],
  temperature: [
    { label: "Thermocline depth", value: "22 meters" },
    { label: "Chlorophyll front", value: "1.4 mg/m³" },
    { label: "Satellite pass", value: "Oceansat-3" },
  ],
  zones: [
    { label: "Nearest zone", value: "Zone A · 38 km" },
    { label: "Target catch", value: "Tuna, Mackerel" },
    { label: "Advisory window", value: "Until 18:00 IST" },
  ],
};

const AI_QUERIES: Record<MapDataMode, string> = {
  waves: "Is it safe for my fishing boat to venture out into Sector 02 with 1.4m waves?",
  wind: "Check afternoon wind forecasts and squall risks near Vypin harbour.",
  temperature: "Where are the highest sea surface temperature fronts off Kochi today?",
  zones: "What is the safest and most fuel-efficient route to Potential Fishing Zone A?",
};

interface MapSideListProps {
  mode: MapDataMode;
  onChangeMode: (mode: MapDataMode) => void;
}

export function MapSideList({ mode, onChangeMode }: MapSideListProps) {
  const hero = HERO_METRICS[mode];
  const telemetry = MODE_TELEMETRY[mode];
  const query = AI_QUERIES[mode];

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto pr-0.5">
      <div className="px-1.5 pb-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Right now
          </p>
          <span
            className={`text-[10px] font-intert font-medium px-2 py-0.5 rounded-full border ${hero.badgeColor}`}
          >
            {hero.badge}
          </span>
        </div>

        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="font-instrument text-4xl text-primary leading-none tracking-tight">
            {hero.value}
          </span>
          <span className="text-lg font-normal text-muted font-instrument">
            {hero.unit}
          </span>
        </div>

        <p className="text-[11.5px] font-medium text-primary font-intert mt-1.5">
          {hero.label}
        </p>
        <p className="text-[10.5px] text-muted font-intert mt-0.5">
          {hero.detail}
        </p>
      </div>

      <div className="py-2 border-b border-border shrink-0 space-y-1">
        {ROWS.map((row, index) => {
          const isActive = row.mode === mode;
          return (
            <button
              key={row.mode}
              type="button"
              onClick={() => onChangeMode(row.mode)}
              aria-pressed={isActive}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-brand/[0.06] text-brand"
                  : "hover:bg-surface-muted/60 text-secondary hover:text-primary"
              }`}
            >
              <span
                className={`font-mono text-base tracking-tight w-6 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-brand font-semibold"
                    : "text-muted/60 group-hover:text-brand/60"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[12.5px] ${
                    isActive
                      ? "text-brand font-medium"
                      : "text-primary group-hover:text-brand"
                  } transition-colors`}
                >
                  {row.label}
                </span>
                <span className="block text-[10.5px] text-muted mt-0.5">
                  {row.hint}
                </span>
              </span>

              <span className="text-[12.5px] font-medium text-primary tabular-nums shrink-0">
                {row.value}
              </span>

              <ArrowRight
                size={13}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-brand"
                    : "text-muted group-hover:text-brand"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="px-1.5 pt-3 pb-3 border-b border-border shrink-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mb-2">
          Other data
        </p>
        <div className="space-y-1.5">
          {telemetry.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-2 text-[11.5px]"
            >
              <span className="text-muted font-intert truncate">{row.label}</span>
              <span className="text-secondary font-intert font-medium text-right tabular-nums shrink-0">
                {row.value}
              </span>
            </div>
          ))}

          <div className="pt-1.5 mt-1 border-t border-dashed border-border/70 flex items-baseline justify-between gap-2 text-[11.5px]">
            <span className="text-muted font-intert">Boundary</span>
            <span className="text-emerald-700 font-intert font-medium text-right shrink-0">
              Inside Indian waters
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 text-[11.5px]">
            <span className="text-muted font-intert">Home port</span>
            <span className="text-secondary font-intert font-medium text-right shrink-0">
              Kochi
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 text-[11.5px]">
            <span className="text-muted font-intert">Your location</span>
            <span className="text-secondary font-mono text-[11px] text-right shrink-0">
              76.04°E, 9.89°N
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-auto shrink-0 pb-1">
        <Link
          href={`/chat?q=${encodeURIComponent(query)}`}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-intert font-medium text-secondary hover:text-primary hover:border-brand/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-brand shrink-0" />
            <span>Ask AI</span>
          </div>
          <ArrowRight size={13} className="text-muted shrink-0" />
        </Link>
      </div>
    </div>
  );
}
