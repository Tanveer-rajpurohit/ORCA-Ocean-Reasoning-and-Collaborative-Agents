"use client";

import type { Advisory } from "../../../../types/advisories/types";

interface AdvisoryItemProps {
  advisory: Advisory;
  index: number;
}

export function AdvisoryItem({ advisory, index }: AdvisoryItemProps) {
  const isPfz = advisory.type === "PFZ";

  return (
    <div className="group w-full py-4 px-3 -mx-3 rounded-lg transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-surface-muted/60">
      <div className="flex items-center gap-3">
        <span className="font-mono text-base tracking-[-0.06em] w-8 shrink-0 text-border group-hover:text-brand/35 transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isPfz ? "bg-ocean/10 text-ocean" : "bg-brand/8 text-brand"
          }`}
        >
          {advisory.type}
        </span>
        <h4 className="flex-1 min-w-0 text-sm font-medium text-primary font-intert truncate">
          {advisory.title}
        </h4>
        <span className="text-xs text-muted font-intert whitespace-nowrap shrink-0">
          {advisory.date}
        </span>
      </div>
      <p className="text-xs text-secondary font-intert mt-2 pl-11 leading-relaxed">
        {advisory.description}
      </p>
      <div className="flex items-center justify-between gap-4 mt-2 pl-11">
        <span className="text-xs text-muted font-intert truncate">
          {advisory.location}
        </span>
        <span className="text-[11px] text-muted/70 font-intert whitespace-nowrap shrink-0">
          Source: {advisory.citation}
        </span>
      </div>
    </div>
  );
}
