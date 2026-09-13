"use client";

import { ArrowLeft, MapPin, Camera, Mic, User, Clock, Waves, Wind, FileText, Eye, ThermometerSun } from "lucide-react";
import type { ReportSubmission } from "../../../../types/report/types";

interface ReportDetailProps {
  report: ReportSubmission;
  onBack: () => void;
}

const ROUGHNESS_LABELS: Record<string, string> = {
  calm: "Calm (flat water)",
  slight: "Slight (small waves)",
  choppy: "Choppy (rocking)",
  rough: "Rough (big waves)",
  very_rough: "Very Rough (dangerous)",
};

const WIND_LABELS: Record<string, string> = {
  none: "No wind",
  light: "Light breeze",
  strong: "Strong wind",
  storm: "Storm wind",
};

const OBSERVATION_LABELS: Record<string, string> = {
  good_catch: "Good catch",
  no_fish: "No fish",
  jellyfish: "Jellyfish",
  debris: "Debris / Trash",
  dolphins: "Dolphins",
  current: "Strong current",
  squall: "Squall / Rain",
  fog: "Fog",
};

const FORECAST_LABELS: Record<string, string> = {
  accurate: "Yes, accurate",
  worse: "Worse than forecast",
  calmer: "Calmer than forecast",
};

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  const hasPhoto = report.attachments.some((a) => a.type === "photo");
  const hasVoice = report.attachments.some((a) => a.type === "voice");

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
        <h2 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight leading-tight">
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-8 mb-8">
        <div className="flex flex-col gap-4">
          {hasPhoto && (
            <div className="w-full aspect-[4/3] rounded-xl bg-ocean-subtle border border-border grid place-items-center overflow-hidden">
              <div className="flex flex-col items-center gap-1.5 text-ocean">
                <Camera size={22} strokeWidth={1.5} />
                <span className="text-xs font-medium font-intert">Photo attached</span>
              </div>
            </div>
          )}
          {hasVoice && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-muted border border-border">
              <Mic size={18} className="text-brand shrink-0" />
              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-brand" />
              </div>
              <span className="text-sm text-muted font-mono shrink-0">0:14</span>
            </div>
          )}
          {!hasPhoto && !hasVoice && (
            <div className="w-full py-6 rounded-xl bg-surface-muted border border-border grid place-items-center">
              <span className="text-xs text-muted font-intert">No media attached</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0 w-full min-w-0">
          <div className="py-5 border-b border-border flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm text-muted font-intert">
              <Waves size={16} />
              Sea state
            </span>
            <span className="text-sm font-medium text-primary font-intert">
              {report.roughness ? ROUGHNESS_LABELS[report.roughness] ?? report.seaState : report.seaState}
            </span>
          </div>
          <div className="py-5 border-b border-border flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm text-muted font-intert">
              <Wind size={16} />
              Wind
            </span>
            <span className="text-sm font-medium text-primary font-intert">
              {report.windStrength ? WIND_LABELS[report.windStrength] ?? report.wind : report.wind}
            </span>
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
          {report.forecastMatch && (
            <div className="py-5 border-b border-border flex items-center justify-between sm:col-span-2">
              <span className="inline-flex items-center gap-2 text-sm text-muted font-intert">
                <ThermometerSun size={16} />
                Forecast accuracy
              </span>
              <span className={`text-sm font-medium font-intert ${
                report.forecastMatch === "accurate" ? "text-brand" : "text-warning"
              }`}>
                {FORECAST_LABELS[report.forecastMatch] ?? report.forecastMatch}
              </span>
            </div>
          )}
        </div>
      </div>

      {report.observations && report.observations.length > 0 && (
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted font-intert mb-3">
            <Eye size={14} />
            Observations
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {report.observations.map((obs) => (
              <span
                key={obs}
                className="px-3 py-1.5 rounded-full bg-surface-muted border border-border text-xs font-medium text-secondary font-intert"
              >
                {OBSERVATION_LABELS[obs] ?? obs}
              </span>
            ))}
          </div>
        </div>
      )}

      {report.notes && (
        <div className="mb-8 w-full">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted font-intert mb-3">
            <FileText size={14} />
            Notes from the reporter
          </span>
          <p className="text-[15px] text-secondary font-intert leading-relaxed mt-2 w-full max-w-none text-left">
            {report.notes}
          </p>
        </div>
      )}
    </div>
  );
}
