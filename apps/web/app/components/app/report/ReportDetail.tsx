"use client";

import { ArrowLeft, MapPin, Camera, Mic, User, Clock, Waves, Wind, FileText } from "lucide-react";
import type { ReportSubmission } from "../../../../types/report/types";

interface ReportDetailProps {
  report: ReportSubmission;
  onBack: () => void;
}

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-3 duration-200 w-full">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8 cursor-pointer font-intert"
      >
        <ArrowLeft size={16} />
        Back to reports
      </button>

      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="text-3xl font-instrument text-primary tracking-tight leading-tight">
          {report.title}
        </h2>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted font-intert mb-8">
        <span className="inline-flex items-center gap-1.5">
          <User size={14} />
          {report.reporter}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} />
          {report.timestamp}
        </span>
      </div>

      {report.attachments.some((a) => a.type === "photo") && (
        <div className="w-full aspect-video rounded-2xl bg-ocean-subtle border border-border grid place-items-center mb-8 overflow-hidden">
          <div className="flex flex-col items-center gap-2 text-ocean">
            <Camera size={32} strokeWidth={1.5} />
            <span className="text-sm font-medium font-intert">Photo attached</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
        <div className="py-5 border-b border-border flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-muted font-intert">
            <Waves size={16} />
            Sea state
          </span>
          <span className="text-sm font-medium text-primary font-intert">{report.seaState}</span>
        </div>
        <div className="py-5 border-b border-border flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-muted font-intert">
            <Wind size={16} />
            Wind
          </span>
          <span className="text-sm font-medium text-primary font-intert">{report.wind}</span>
        </div>
        <div className="py-5 border-b border-border flex items-center justify-between sm:col-span-2">
          <span className="inline-flex items-center gap-2 text-sm text-muted font-intert">
            <MapPin size={16} />
            Location
          </span>
          <span className="text-sm font-medium text-primary font-intert">
            {report.location.label} · {report.location.lng.toFixed(2)}°E, {report.location.lat.toFixed(2)}°N
          </span>
        </div>
      </div>

      {report.notes && (
        <div className="mt-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted font-intert mb-3">
            <FileText size={14} />
            Notes from the reporter
          </span>
          <p className="text-base text-secondary font-intert leading-relaxed">
            {report.notes}
          </p>
        </div>
      )}

      {report.attachments.some((a) => a.type === "voice") && (
        <div className="mt-8 flex items-center gap-4 p-4 rounded-xl bg-surface-muted border border-border">
          <Mic size={18} className="text-brand shrink-0" />
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-brand" />
          </div>
          <span className="text-sm text-muted font-mono shrink-0">0:14</span>
        </div>
      )}
    </div>
  );
}
