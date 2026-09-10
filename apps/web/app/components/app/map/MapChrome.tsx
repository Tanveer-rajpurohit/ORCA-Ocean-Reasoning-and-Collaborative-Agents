"use client";

import { tempColor, waveColor } from "../../../../lib/marineMapData";
import type { LegendEntry, MapDataMode } from "../../../../types";

const LEGENDS: Record<MapDataMode, { title: string; entries: LegendEntry[] }> = {
  waves: {
    title: "Wave height",
    entries: [
      { color: waveColor(0.8), label: "Calm", value: "under 1.0 m" },
      { color: waveColor(1.2), label: "Slight", value: "1.0 – 1.5 m" },
      { color: waveColor(1.7), label: "Moderate", value: "1.5 – 2.0 m" },
      { color: waveColor(2.3), label: "Rough", value: "over 2.0 m" },
    ],
  },
  wind: {
    title: "Wind speed",
    entries: [
      { color: "#5AA79A", label: "Light", value: "under 12 km/h" },
      { color: "#B89465", label: "Steady", value: "12 – 20 km/h" },
      { color: "#A4665C", label: "Strong", value: "over 20 km/h" },
    ],
  },
  temperature: {
    title: "Sea surface temperature",
    entries: [
      { color: tempColor(27.1), label: "Cool break", value: "under 27.4 °C" },
      { color: tempColor(27.6), label: "Cooling", value: "27.4 – 27.9 °C" },
      { color: tempColor(28.1), label: "Seasonal", value: "27.9 – 28.3 °C" },
      { color: tempColor(28.5), label: "Warm", value: "over 28.3 °C" },
    ],
  },
  zones: {
    title: "Fishing zones",
    entries: [
      { color: "#338E7F", label: "Zone A", value: "38 km · 247°" },
      { color: "#338E7F", label: "Zone B", value: "52 km · 231°" },
      { color: "#A4665C", label: "Boundary", value: "do not cross" },
    ],
  },
};

export function MapLegend({ mode }: { mode: MapDataMode }) {
  const legend = LEGENDS[mode];

  return (
    <div className="absolute left-3 top-3 z-20 rounded-lg border border-border bg-surface/85 backdrop-blur-md shadow-sm px-3.5 py-3 font-intert max-w-[190px]">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
        {legend.title}
      </p>
      <div className="mt-2 space-y-1.5">
        {legend.entries.map((entry) => (
          <div key={entry.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[11px] text-primary">{entry.label}</span>
            <span className="text-[10px] text-muted ml-auto tabular-nums">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
