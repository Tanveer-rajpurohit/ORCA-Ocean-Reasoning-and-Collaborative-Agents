"use client";

import { useState } from "react";
import { ChevronDown, MapPin, ExternalLink } from "lucide-react";
import type { Advisory } from "../../../../types/advisories/types";

interface AdvisoryItemProps {
  advisory: Advisory;
  index: number;
}

export function AdvisoryItem({ advisory, index }: AdvisoryItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isPfz = advisory.type === "PFZ";

  return (
    <div className="group w-full py-4 px-3 -mx-3 rounded-lg transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-surface-muted/60">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 text-left cursor-pointer"
      >
        <span className="font-mono text-base tracking-[-0.06em] w-8 shrink-0 text-muted group-hover:text-brand transition-colors">
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
        <ChevronDown size={14} className={`shrink-0 text-muted transition-transform duration-200 ${expanded ? "rotate-180 text-primary" : ""}`} />
      </button>
      
      {expanded ? (
        <div className="mt-3 pl-14 pr-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-secondary font-intert leading-relaxed">
            {advisory.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted font-intert">
              <MapPin size={12} />
              <span>{advisory.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-muted/70 font-intert whitespace-nowrap">
                Source: {advisory.citation}
              </span>
              <button className="flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand/80 transition-colors cursor-pointer">
                <ExternalLink size={12} />
                <span>View on map</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2 pl-14">
          <p className="text-xs text-secondary font-intert truncate">
            {advisory.description}
          </p>
        </div>
      )}
    </div>
  );
}
