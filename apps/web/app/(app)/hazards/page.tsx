"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, Map, MessageSquare, Info, ChevronRight, Shield, ArrowLeft, Layers } from "lucide-react";
import { HAZARDS_DATA } from "../../../lib/hazardsData";

const LEVEL_WEIGHT = {
  danger: 3,
  warning: 2,
  info: 1,
};

const LEVEL_BADGE = {
  danger: "Severe Danger",
  warning: "Caution",
  info: "Advisory",
};

const LEVEL_BG = {
  danger: "bg-danger/10 text-danger border-danger/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-brand/10 text-brand border-brand/20",
};

const LEVEL_ACCENT = {
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-brand",
};

type FilterTab = "All" | "Severe" | "Caution" | "Advisory";

export default function HazardsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [selectedId, setSelectedId] = useState(HAZARDS_DATA[0]?.id ?? "");
  const [mobileTab, setMobileTab] = useState<"list" | "detail">("list");

  const sortedHazards = useMemo(() => {
    return [...HAZARDS_DATA].sort((a, b) => {
      if (LEVEL_WEIGHT[a.level] !== LEVEL_WEIGHT[b.level]) {
        return LEVEL_WEIGHT[b.level] - LEVEL_WEIGHT[a.level];
      }
      return a.distance - b.distance;
    });
  }, []);

  const filteredHazards = useMemo(() => {
    return sortedHazards.filter((h) => {
      if (filterTab === "All") return true;
      if (filterTab === "Severe") return h.level === "danger";
      if (filterTab === "Caution") return h.level === "warning";
      if (filterTab === "Advisory") return h.level === "info";
      return true;
    });
  }, [sortedHazards, filterTab]);

  const selected = sortedHazards.find((h) => h.id === selectedId) ?? sortedHazards[0];

  const dangerCount = sortedHazards.filter((h) => h.level === "danger").length;
  const warningCount = sortedHazards.filter((h) => h.level === "warning").length;
  const infoCount = sortedHazards.filter((h) => h.level === "info").length;

  const handleSelectHazard = (id: string) => {
    setSelectedId(id);
    setMobileTab("detail");
  };

  const TABS: { id: FilterTab; label: string; count?: number }[] = [
    { id: "All", label: "All", count: sortedHazards.length },
    { id: "Severe", label: "Severe", count: dangerCount },
    { id: "Caution", label: "Caution", count: warningCount },
    { id: "Advisory", label: "Advisory", count: infoCount },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden font-intert bg-bg">
      <div className="shrink-0 px-6 sm:px-10 lg:px-16 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
              Hazards
            </h1>
            <p className="text-sm text-muted font-intert mt-1">
              Real-time warnings, squall lines, and maritime advisories for Kochi sector.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium font-intert transition-colors border cursor-pointer ${
                  filterTab === tab.id
                    ? "bg-brand text-white border-brand shadow-xs"
                    : "bg-surface text-secondary border-border hover:bg-surface-muted hover:text-primary"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1.5 font-mono text-[11px] ${filterTab === tab.id ? "text-white/80" : "text-muted"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-2 mt-4 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium font-intert transition-colors border cursor-pointer ${
              mobileTab === "list"
                ? "bg-brand text-white border-brand shadow-xs"
                : "bg-surface text-secondary border-border hover:bg-surface-muted"
            }`}
          >
            All Alerts ({filteredHazards.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("detail")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium font-intert transition-colors border cursor-pointer ${
              mobileTab === "detail"
                ? "bg-brand text-white border-brand shadow-xs"
                : "bg-surface text-secondary border-border hover:bg-surface-muted"
            }`}
          >
            Active Detail
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-6 sm:px-10 lg:px-16 pb-6 flex gap-6 overflow-hidden">
        <div
          className={`lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col min-h-0 overflow-y-auto pr-1 ${
            mobileTab === "list" ? "flex w-full" : "hidden lg:flex"
          }`}
        >
          <div className="pb-2 px-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted font-semibold border-b border-border">
            <span>Alerts Feed</span>
            <span>Distance</span>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {filteredHazards.map((hazard, index) => {
              const isActive = hazard.id === selected?.id;
              const itemNumber = String(index + 1).padStart(2, "0");

              return (
                <button
                  key={hazard.id}
                  type="button"
                  onClick={() => handleSelectHazard(hazard.id)}
                  className={`group w-full flex items-center gap-3.5 px-3 py-3.5 text-left transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "bg-surface text-primary shadow-xs rounded-lg"
                      : "hover:bg-surface-muted/60 text-secondary hover:text-primary rounded-lg"
                  }`}
                >
                  <span
                    className={`font-mono text-base tracking-tight w-6 shrink-0 transition-colors duration-150 ${
                      isActive
                        ? "text-brand font-semibold"
                        : "text-muted group-hover:text-brand/70"
                    }`}
                  >
                    {itemNumber}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${LEVEL_BG[hazard.level]}`}
                      >
                        {LEVEL_BADGE[hazard.level]}
                      </span>
                      <span className="text-[11px] font-mono text-muted tabular-nums">
                        {hazard.distance} km
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-medium leading-snug line-clamp-1 font-intert ${
                        isActive ? "text-primary font-semibold" : "text-primary group-hover:text-brand"
                      }`}
                    >
                      {hazard.title}
                    </h4>

                    <p className="text-[11px] text-muted line-clamp-1 mt-0.5 font-intert">
                      {hazard.timestamp} · {hazard.source}
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-transform ${
                      isActive ? "text-primary translate-x-0.5" : "text-muted group-hover:text-secondary"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {selected && (
          <div
            className={`relative flex-1 rounded-2xl border border-border bg-surface shadow-xs p-6 sm:p-8 lg:p-10 min-h-0 overflow-y-auto flex-col ${
              mobileTab === "detail" ? "flex" : "hidden lg:flex"
            }`}
          >
            <div
              className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${LEVEL_ACCENT[selected.level]}`}
            />

            <div className="lg:hidden mb-4 pb-3 border-b border-border">
              <button
                type="button"
                onClick={() => setMobileTab("list")}
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors font-medium font-intert cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to alerts list</span>
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    selected.level === "danger"
                      ? "bg-danger/10 text-danger border-danger/20"
                      : selected.level === "warning"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-brand/10 text-brand border-brand/20"
                  }`}
                >
                  {selected.level === "info" ? (
                    <Info size={22} />
                  ) : (
                    <AlertTriangle size={22} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${LEVEL_BG[selected.level]}`}
                    >
                      {LEVEL_BADGE[selected.level]}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      {selected.distance} km from home port
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-instrument text-primary leading-tight">
                    {selected.title}
                  </h2>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-muted border border-border text-xs text-muted font-mono">
                <Layers size={12} />
                <span>INCOIS Live</span>
              </span>
            </div>

            <p className="text-sm sm:text-base text-secondary font-intert leading-relaxed mb-6">
              {selected.description}
            </p>

            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-surface-muted border border-border mb-6">
              <Shield size={20} className="text-brand shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-intert">
                  What should I do?
                </h3>
                <p className="text-sm sm:text-base text-primary font-intert font-medium leading-relaxed">
                  {selected.action}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-muted/50 border border-border/80 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1 font-intert">
                  Distance
                </span>
                <span className="text-sm text-primary font-medium font-mono">
                  {selected.distance} km
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1 font-intert">
                  Updated
                </span>
                <span className="text-sm text-primary font-medium font-intert">
                  {selected.timestamp}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1 font-intert">
                  Source
                </span>
                <span className="text-sm text-primary font-medium font-intert truncate">
                  {selected.source}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1 font-intert">
                  Valid until
                </span>
                <span className="text-sm text-primary font-medium font-mono">
                  {selected.validUntil}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-lg bg-surface-muted border border-border mb-8 text-xs font-intert text-secondary">
              <span className="text-muted">Affected sector zone:</span>
              <span className="font-medium text-primary">{selected.affectedArea}</span>
            </div>

            <div className="mt-auto pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <Link
                href="/map"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg font-medium text-sm hover:opacity-95 transition-opacity"
              >
                <Map size={16} />
                <span>View on map</span>
              </Link>
              <Link
                href={`/chat?q=What precautions should my fishing crew take regarding ${encodeURIComponent(selected.title)}?`}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface border border-border text-primary rounded-lg font-medium text-sm hover:bg-surface-muted transition-colors"
              >
                <MessageSquare size={16} />
                <span>Ask AI about this hazard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
