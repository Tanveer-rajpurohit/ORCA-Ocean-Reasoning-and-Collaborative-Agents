"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

export function SourcesBar() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface-muted px-5 py-4 mt-5 font-intert">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[9px] tracking-[0.14em] uppercase text-muted max-w-[128px] leading-relaxed">
          Grounded in official sources
        </span>
        <span className="text-[13px] font-bold tracking-wide text-[#7E94A3]">
          INCOIS
        </span>
        <span className="w-px h-3.5 bg-border" />
        <span className="text-[13px] font-bold tracking-wide text-[#7E94A3]">
          IMD
        </span>
        <span className="w-px h-3.5 bg-border" />
        <span className="text-[14px] italic font-bold text-[#7E94A3]">
          ISRO
        </span>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-secondary hover:text-primary transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
      >
        <Download size={13} />
        <span>{saved ? "Briefing saved" : "Save briefing for offline"}</span>
        {saved && <Check size={12} className="text-ocean" />}
      </button>
    </section>
  );
}
