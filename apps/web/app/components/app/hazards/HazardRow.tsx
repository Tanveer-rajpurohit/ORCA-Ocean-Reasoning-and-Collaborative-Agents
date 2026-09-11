"use client";

import { Hazard } from "../../../../types/hazards/types";

interface HazardRowProps {
  hazard: Hazard;
  index: number;
}

export function HazardRow({ hazard, index }: HazardRowProps) {
  const isDanger = hazard.level === "danger";

  return (
    <div className="group w-full flex items-center gap-4 py-4 px-2 rounded-lg transition-all duration-200 border-b border-border last:border-b-0 hover:bg-surface-muted cursor-pointer">
      <span className={`font-mono text-sm tracking-[-0.06em] w-6 shrink-0 transition-colors ${
        isDanger ? "text-danger" : "text-border group-hover:text-brand/50"
      }`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-medium text-primary truncate font-intert">
            {hazard.title}
          </h4>
          <span className="text-xs font-mono text-muted whitespace-nowrap">
            {hazard.distance}km
          </span>
        </div>
        <p className="text-xs text-secondary font-intert truncate mt-1 leading-relaxed">
          {hazard.description}
        </p>
      </div>
      <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
        <div
          className={`absolute inset-0 rounded-full border-2 ${
            isDanger ? "border-danger" : "border-warning"
          } animate-pulse`}
        />
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isDanger ? "bg-danger" : "bg-warning"
          }`}
        />
      </div>
    </div>
  );
}
