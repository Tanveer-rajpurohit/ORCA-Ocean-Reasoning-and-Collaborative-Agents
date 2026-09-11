"use client";

import { useState } from "react";
import { AuditLogEntry } from "../../../types/audit-log/types";
import { TraceStep } from "../../components/app/audit-log/TraceStep";
import { ChevronDown, Clock } from "lucide-react";

const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "log-1",
    query: "What is the current sea state near Kochi?",
    timestamp: "11 Sep 2026, 09:15 AM",
    finalVerdict: "The sea state is currently calm with wave heights < 0.8m. Safe for small boat operations.",
    steps: [
      {
        id: "s1",
        type: "reasoning",
        content: "User is asking for local sea state. Need to check the latest Ocean State Forecast (OSF) for the Kochi region.",
        timestamp: "09:15:01",
      },
      {
        id: "s2",
        type: "tool",
        toolName: "incois_osf_api",
        content: "fetch_forecast(region='Kochi', date='2026-09-11')",
        timestamp: "09:15:02",
      },
      {
        id: "s3",
        type: "reasoning",
        content: "OSF data returned wave height: 0.6m, wind: 8 knots. This matches the 'Calm' threshold.",
        timestamp: "09:15:03",
      },
      {
        id: "s4",
        type: "verdict",
        content: "Final verdict: Calm conditions. Safety check passed.",
        timestamp: "09:15:04",
      },
    ],
  },
  {
    id: "log-2",
    query: "Check for any severe hazards within 50km.",
    timestamp: "11 Sep 2026, 08:30 AM",
    finalVerdict: "A Severe Squall Warning is active 12km Southwest of your location. Return to port immediately.",
    steps: [
      {
        id: "s1",
        type: "reasoning",
        content: "Identifying hazards within a 50km radius. Querying the Hazards agent and weather satellite layers.",
        timestamp: "08:30:01",
      },
      {
        id: "s2",
        type: "tool",
        toolName: "weather_satellite",
        content: "scan_region(radius=50, center=[9.89, 76.04])",
        timestamp: "08:30:02",
      },
      {
        id: "s3",
        type: "reasoning",
        content: "Satellite detected a sudden pressure drop and wind shift 12km away. This is characteristic of a squall.",
        timestamp: "08:30:03",
      },
      {
        id: "s4",
        type: "verdict",
        content: "Critical hazard identified. Immediate warning issued.",
        timestamp: "08:30:04",
      },
    ],
  },
];

export default function AuditLogPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto font-intert bg-bg">
      <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
            Audit Log
          </h1>
          <p className="text-sm text-muted font-intert mt-1">
            Every agent decision, tool call, and alert in a reviewable trail.
          </p>
        </header>

        <div className="space-y-0">
          {MOCK_AUDIT_LOG.map((entry, index) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="border-b border-border last:border-b-0">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className={`w-full text-left flex items-center gap-4 py-5 px-3 rounded-lg transition-all duration-200 ${
                    isExpanded ? "bg-surface-muted" : "hover:bg-surface-muted/50"
                  }`}
                >
                  <span className={`font-mono text-base tracking-[-0.06em] w-6 shrink-0 transition-colors ${
                    isExpanded ? "text-brand" : "text-border group-hover:text-brand/50"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-primary truncate leading-tight font-intert">
                          {entry.query}
                        </p>
                        <p className="text-xs text-secondary truncate font-intert opacity-70 mt-0.5">
                          {entry.finalVerdict}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted shrink-0 font-intert whitespace-nowrap">
                        <Clock size={12} className="shrink-0" />
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-brand" : "text-border"
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200 px-2 pb-6 pt-4">
                    <div className="pl-8 space-y-6">
                      <div className="mb-6">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert block mb-1">
                          Final Verdict
                        </span>
                        <p className="text-sm text-primary font-medium leading-relaxed">
                          {entry.finalVerdict}
                        </p>
                      </div>
                      <div>
                        {entry.steps.map((step, idx) => (
                          <TraceStep
                            key={step.id}
                            step={step}
                            isLast={idx === entry.steps.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
