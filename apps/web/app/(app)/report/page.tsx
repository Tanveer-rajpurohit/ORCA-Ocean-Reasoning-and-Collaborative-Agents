"use client";

import { useState, useMemo } from "react";
import { LocationChip } from "../../components/app/report/LocationChip";
import { ReportItem } from "../../components/app/report/ReportItem";
import { ReportDetail } from "../../components/app/report/ReportDetail";
import { Camera, Mic, Send, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "../../components/ui/Select";
import { MOCK_REPORTS, PAGE_SIZE } from "../../../lib/reportData";
import type { ReportSubmission } from "../../../types/report/types";

const FILTER_OPTIONS = [
  { label: "All reports", value: "all" },
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "With photos", value: "photo" },
];

type View =
  | { kind: "feed" }
  | { kind: "submit" }
  | { kind: "detail"; report: ReportSubmission };

export default function ReportPage() {
  const [view, setView] = useState<View>({ kind: "feed" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [page, setPage] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState("Detecting...");

  const handleLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation("76.04°E, 9.89°N · Kochi Coast");
      setIsLocating(false);
    }, 1200);
  };

  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matches = MOCK_REPORTS.filter((r) => {
      const matchesSearch =
        !q ||
        r.location.label.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.seaState.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (filterValue === "photo") return r.attachments.some((a) => a.type === "photo");
      return true;
    });
    // Newest entries first, then oldest-first flips the same order.
    return filterValue === "oldest" ? [...matches].reverse() : matches;
  }, [searchQuery, filterValue]);

  const pageCount = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageReports = filteredReports.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const goToPage = (next: number) => {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto font-intert bg-bg">
      <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
              Report
            </h1>
            <p className="text-sm text-muted font-intert mt-1">
              Real conditions from the fleet, reported as they see them.
            </p>
          </div>
          {view.kind === "feed" && (
            <button
              onClick={() => setView({ kind: "submit" })}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-brand-solid text-xs font-medium shadow-xs cursor-pointer active:scale-95"
            >
              <Send size={14} />
              Submit Report
            </button>
          )}
        </header>

        {view.kind === "feed" && (
          <div className="animate-in fade-in duration-300">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Search by location or condition..."
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface border border-border text-sm text-primary outline-none focus:border-brand transition-colors"
                />
              </div>
              <Select
                size="sm"
                value={filterValue}
                onChange={(v) => {
                  setFilterValue(v);
                  setPage(0);
                }}
                options={FILTER_OPTIONS}
                aria-label="Filter reports"
                triggerClassName="h-10"
                className="w-44"
                menuClassName="w-48"
              />
            </div>

            {/* Reports Feed */}
            <div>
              {pageReports.length > 0 ? (
                pageReports.map((report, index) => (
                  <ReportItem
                    key={report.id}
                    report={report}
                    index={safePage * PAGE_SIZE + index}
                    onClick={() => setView({ kind: "detail", report })}
                  />
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-3 text-muted">
                    <Search size={20} />
                  </div>
                  <p className="text-sm text-secondary font-medium">No reports found</p>
                  <p className="text-xs text-muted mt-1">Try adjusting your search or filter</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 0}
                  className="p-2 rounded-lg border border-border bg-surface text-muted hover:text-primary hover:bg-surface-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-muted font-intert">
                  Page {safePage + 1} of {pageCount}
                </span>
                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === pageCount - 1}
                  className="p-2 rounded-lg border border-border bg-surface text-muted hover:text-primary hover:bg-surface-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {view.kind === "detail" && (
          <div className="w-full">
            <ReportDetail
              report={view.report}
              onBack={() => setView({ kind: "feed" })}
            />
          </div>
        )}

        {view.kind === "submit" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-instrument text-primary">Submit Condition Report</h2>
              <button
                onClick={() => setView({ kind: "feed" })}
                className="p-2 rounded-full hover:bg-surface-muted text-muted transition-colors cursor-pointer"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-8 w-full">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Current Location
                  </label>
                  <div className="flex items-center gap-3">
                    <LocationChip
                      label={location}
                      onClick={handleLocate}
                      isLoading={isLocating}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Sea State / Wave Height
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Moderate, 1.5m"
                    className="w-full bg-transparent border-b border-border py-2.5 text-sm text-primary outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Wind Condition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SW 15 knots"
                    className="w-full bg-transparent border-b border-border py-2.5 text-sm text-primary outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any anomalies or debris..."
                    className="w-full bg-transparent border border-border rounded-lg p-3 text-sm text-primary outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-surface text-xs font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-all cursor-pointer active:scale-95">
                    <Camera size={14} />
                    Attach Photo
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-surface text-xs font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-all cursor-pointer active:scale-95">
                    <Mic size={14} />
                    Voice Note
                  </button>
                </div>
              </div>

              <button
                onClick={() => setView({ kind: "feed" })}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-lg btn-brand-solid text-sm font-medium shadow-xs cursor-pointer active:scale-95"
              >
                <Send size={16} />
                Submit Condition Report
              </button>
            </div>
          </div>
        )}
        {view.kind === "feed" && (
          <button
            onClick={() => setView({ kind: "submit" })}
            className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full btn-brand-solid shadow-lg flex items-center justify-center cursor-pointer"
            aria-label="Submit report"
          >
            <Send size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
