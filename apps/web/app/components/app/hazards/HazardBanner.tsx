"use client";

import { Hazard } from "../../../../types/hazards/types";
import { AlertTriangle, Info } from "lucide-react";

interface HazardBannerProps {
  hazard: Hazard;
}

export function HazardBanner({ hazard }: HazardBannerProps) {
  const isDanger = hazard.level === "danger";
  const colorVar = isDanger ? "var(--danger)" : "var(--warning)";
  const icon = isDanger ? <AlertTriangle size={16} /> : <Info size={16} />;

  return (
    <div
      className="relative flex items-start gap-3 p-3 rounded-lg border-l-4 transition-colors duration-200"
      style={{
        borderColor: `var(${isDanger ? "var(--danger)" : "var(--warning)"})`,
        backgroundColor: `color-mix(in srgb, ${colorVar}, transparent 90%)`
      }}
    >
      <div className="mt-0.5 shrink-0" style={{ color: `var(${isDanger ? "var(--danger)" : "var(--warning)"})` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-medium text-primary font-intert truncate">
            {hazard.title}
          </h4>
          <span className="text-[11px] font-mono text-muted shrink-0">
            {hazard.distance}km
          </span>
        </div>
        <p className="text-xs text-muted font-intert mt-1 leading-relaxed">
          {hazard.description}
        </p>
      </div>
    </div>
  );
}
