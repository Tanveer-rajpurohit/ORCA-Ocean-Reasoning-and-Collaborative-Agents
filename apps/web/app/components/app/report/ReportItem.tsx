"use client";

import { MapPin, Camera, Mic } from "lucide-react";
import type { ReportSubmission } from "../../../../types/report/types";

interface ReportItemProps {
  report: ReportSubmission;
  index: number;
  onClick: () => void;
}

export function ReportItem({ report, index, onClick }: ReportItemProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-center gap-4 py-5 px-3 -mx-3 rounded-lg transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-surface-muted cursor-pointer"
    >
      <span className="font-mono text-base tracking-[-0.06em] w-8 shrink-0 text-border group-hover:text-brand/35 transition-colors">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-medium text-primary truncate font-intert">
            {report.title}
          </span>
          <span className="text-xs text-muted font-mono whitespace-nowrap shrink-0">
            {report.timestamp}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-muted font-intert truncate">
            <MapPin size={12} className="shrink-0" />
            {report.location.label}
          </span>
          <span className="text-xs text-secondary font-medium font-intert whitespace-nowrap">
            {report.seaState}
          </span>
          <div className="flex items-center gap-1">
            {report.attachments.map((att, i) => (
              <span key={i} className="text-muted shrink-0">
                {att.type === "photo" ? <Camera size={12} /> : <Mic size={12} />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
