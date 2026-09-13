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
      { id: "s1", type: "reasoning", content: "User is asking for local sea state. Need to check the latest Ocean State Forecast (OSF).", timestamp: "09:15:01" },
      { id: "s2", type: "tool", toolName: "imd_weather_api", content: "fetch_current_weather(region='Kochi')", timestamp: "09:15:02" },
      { id: "s3", type: "tool", toolName: "incois_osf_api", content: "fetch_forecast(region='Kochi', date='2026-09-11')", timestamp: "09:15:03" },
      { id: "s4", type: "reasoning", content: "OSF data returned wave height: 0.6m, wind: 8 knots. This matches the 'Calm' threshold.", timestamp: "09:15:04" },
      { id: "s5", type: "verdict", content: "Final verdict: Calm conditions. Safety check passed.", timestamp: "09:15:05" },
    ],
  },
  {
    id: "log-2",
    query: "Where are the nearest fishing zones (PFZ)?",
    timestamp: "11 Sep 2026, 08:45 AM",
    finalVerdict: "Found 2 Potential Fishing Zones within 50km. The nearest is 38km Southwest of Kochi.",
    steps: [
      { id: "s1", type: "reasoning", content: "User requested PFZ data. Fetching the latest INCOIS advisories for the Arabian Sea.", timestamp: "08:45:01" },
      { id: "s2", type: "tool", toolName: "incois_pfz_api", content: "get_pfz_zones(coastal_state='Kerala', max_distance=50)", timestamp: "08:45:02" },
      { id: "s3", type: "reasoning", content: "API returned 2 active zones. Formatting coordinates for display.", timestamp: "08:45:04" },
      { id: "s4", type: "verdict", content: "Nearest zone is 38km away (Bearing 240°). Added to map.", timestamp: "08:45:05" },
    ],
  },
  {
    id: "log-3",
    query: "Plan a route to PFZ 02.",
    timestamp: "10 Sep 2026, 14:20 PM",
    finalVerdict: "Route planned successfully. The path stays within Indian territorial waters (IMBL clearance confirmed).",
    steps: [
      { id: "s1", type: "reasoning", content: "Generating navigational waypoints from Home Port to PFZ 02.", timestamp: "14:20:01" },
      { id: "s2", type: "tool", toolName: "nav_router", content: "calculate_route(start=[76.25, 9.96], end=[75.9, 10.17])", timestamp: "14:20:02" },
      { id: "s3", type: "tool", toolName: "geofence_checker", content: "check_imbl_crossing(route_id='rt_492')", timestamp: "14:20:04" },
      { id: "s4", type: "reasoning", content: "Geofence check passed. Route remains 15km clear of the International Maritime Boundary Line.", timestamp: "14:20:05" },
      { id: "s5", type: "verdict", content: "Route is safe and compliant. Displaying path.", timestamp: "14:20:06" },
    ],
  },
  {
    id: "log-4",
    query: "Check for any severe hazards within 50km.",
    timestamp: "10 Sep 2026, 08:30 AM",
    finalVerdict: "A Severe Squall Warning is active 12km Southwest of your location. Return to port immediately.",
    steps: [
      { id: "s1", type: "reasoning", content: "Identifying hazards within a 50km radius. Querying the Hazards agent and weather satellite layers.", timestamp: "08:30:01" },
      { id: "s2", type: "tool", toolName: "weather_satellite", content: "scan_region(radius=50, center=[9.89, 76.04])", timestamp: "08:30:02" },
      { id: "s3", type: "reasoning", content: "Satellite detected a sudden pressure drop and wind shift 12km away. This is characteristic of a squall.", timestamp: "08:30:03" },
      { id: "s4", type: "verdict", content: "Critical hazard identified. Immediate warning issued.", timestamp: "08:30:04" },
    ],
  },
  {
    id: "log-5",
    query: "Will it rain tomorrow evening?",
    timestamp: "09 Sep 2026, 19:10 PM",
    finalVerdict: "Yes, there is a 75% chance of moderate rainfall starting around 17:00 tomorrow.",
    steps: [
      { id: "s1", type: "reasoning", content: "Fetching forecast for tomorrow evening. IMD API might be delayed, trying primary first.", timestamp: "19:10:01" },
      { id: "s2", type: "tool", toolName: "imd_weather_api", content: "fetch_forecast(date='2026-09-10')", timestamp: "19:10:02" },
      { id: "s3", type: "reasoning", content: "IMD API timed out. Falling back to Open-Meteo marine forecast.", timestamp: "19:10:06" },
      { id: "s4", type: "tool", toolName: "open_meteo_api", content: "fetch_marine(lat=9.98, lon=76.01)", timestamp: "19:10:07" },
      { id: "s5", type: "verdict", content: "Precipitation models indicate rain. Alerting user.", timestamp: "19:10:08" },
    ],
  },
  {
    id: "log-6",
    query: "Is that rain going to be accompanied by strong winds?",
    timestamp: "09 Sep 2026, 19:11 PM",
    finalVerdict: "No, winds will remain moderate (12-15 knots) despite the rain.",
    steps: [
      { id: "s1", type: "reasoning", content: "User is asking a follow-up question about the previous rain forecast.", timestamp: "19:11:01" },
      { id: "s2", type: "tool", toolName: "context_memory", content: "retrieve_last_context()", timestamp: "19:11:02" },
      { id: "s3", type: "reasoning", content: "Reviewing the Open-Meteo wind data fetched in the previous turn.", timestamp: "19:11:03" },
      { id: "s4", type: "verdict", content: "Wind speeds are below advisory thresholds.", timestamp: "19:11:04" },
    ],
  },
  {
    id: "log-7",
    query: "Another boat reported debris near coordinates 9.85, 75.95.",
    timestamp: "08 Sep 2026, 11:30 AM",
    finalVerdict: "Report logged and verified against satellite imagery. Marked as a minor navigation hazard.",
    steps: [
      { id: "s1", type: "reasoning", content: "User submitted a crowdsourced hazard report. Need to log and verify.", timestamp: "11:30:01" },
      { id: "s2", type: "tool", toolName: "hazard_db", content: "insert_report(type='debris', lat=9.85, lon=75.95)", timestamp: "11:30:02" },
      { id: "s3", type: "tool", toolName: "copernicus_satellite", content: "check_anomaly(lat=9.85, lon=75.95)", timestamp: "11:30:03" },
      { id: "s4", type: "reasoning", content: "Satellite confirms a small floating mass in the area.", timestamp: "11:30:05" },
      { id: "s5", type: "verdict", content: "Verified. Broadcasting to nearby vessels.", timestamp: "11:30:06" },
    ],
  },
  {
    id: "log-8",
    query: "Are there any fishing bans currently active?",
    timestamp: "07 Sep 2026, 10:00 AM",
    finalVerdict: "No active bans. The annual monsoon trawling ban ended on July 31st.",
    steps: [
      { id: "s1", type: "reasoning", content: "Checking compliance database for active seasonal bans.", timestamp: "10:00:01" },
      { id: "s2", type: "tool", toolName: "fisheries_dept_api", content: "get_active_bans(state='Kerala')", timestamp: "10:00:02" },
      { id: "s3", type: "reasoning", content: "API confirmed no bans. Last ban was the 52-day monsoon ban.", timestamp: "10:00:03" },
      { id: "s4", type: "verdict", content: "Clear to fish in approved zones.", timestamp: "10:00:04" },
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
                    isExpanded ? "text-brand" : "text-muted group-hover:text-brand"
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
