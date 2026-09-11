"use client";

import { Hazard } from "../../../types/hazards/types";
import { HazardRow } from "../../components/app/hazards/HazardRow";
import { AlertTriangle } from "lucide-react";

const MOCK_HAZARDS: Hazard[] = [
  {
    id: "haz-1",
    title: "Severe Squall Warning",
    description: "Sudden wind shifts and heavy rain expected within 20km. Immediate return to port recommended for small vessels.",
    level: "danger",
    distance: 12,
    timestamp: "10 mins ago",
    coordinates: { lat: 9.92, lng: 76.01 },
  },
  {
    id: "haz-2",
    title: "High Swell Alert",
    description: "Swell heights reaching 2.5m in the open sea. Extreme caution required for deep-sea fishing.",
    level: "warning",
    distance: 45,
    timestamp: "1 hour ago",
    coordinates: { lat: 9.85, lng: 75.82 },
  },
  {
    id: "haz-3",
    title: "Lightning Activity",
    description: "Thunderstorms detected in the coastal belt. Avoid open water in the Vypin region.",
    level: "warning",
    distance: 82,
    timestamp: "3 hours ago",
    coordinates: { lat: 10.12, lng: 76.05 },
  },
];

export default function HazardsPage() {
  const rankedHazards = [...MOCK_HAZARDS].sort((a, b) => a.distance - b.distance);
  const hero = rankedHazards[0];
  const list = rankedHazards.slice(1);

  if (!hero) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto font-intert bg-bg">
        <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
          <header className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
              Hazards
            </h1>
            <p className="text-sm text-muted font-intert mt-1">
              No active hazards detected in your region.
            </p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto font-intert bg-bg">
      <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
            Hazards
          </h1>
          <p className="text-sm text-muted font-intert mt-1">
            Cyclone tracks, squall winds, and high-wave warnings pushed to your location.
          </p>
        </header>

        <div className="space-y-8">
          {/* Hero Section - Critical Hazard */}
          <div className="relative p-6 rounded-2xl bg-surface border border-border shadow-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl"
                 style={{ backgroundColor: `var(${hero.level === "danger" ? "var(--danger)" : "var(--warning)"})` }}
            />
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-full bg-surface-muted border border-border">
                <AlertTriangle
                  size={16}
                  style={{ color: `var(${hero.level === "danger" ? "var(--danger)" : "var(--warning)"})` }}
                />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                hero.level === "danger" ? "text-danger" : "text-warning"
              }`}>
                {hero.level === "danger" ? "Severe Danger" : "Caution"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-instrument text-primary mb-3 leading-tight">
              {hero.title}
            </h2>
            <p className="text-sm text-secondary font-intert leading-relaxed mb-6 max-w-2xl">
              {hero.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Distance:
                </span>
                <span className="text-sm text-primary font-medium">
                  {hero.distance} km from your location
                </span>
              </div>
              <span className="text-xs text-muted/60 font-mono">
                {hero.timestamp}
              </span>
            </div>
          </div>

          {/* Other Hazards List */}
          <div className="space-y-0">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-intert">
                Nearby Alerts
              </h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {list.map((hazard, index) => (
              <HazardRow key={hazard.id} hazard={hazard} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
