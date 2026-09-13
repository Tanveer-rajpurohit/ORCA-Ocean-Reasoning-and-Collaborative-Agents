"use client";

import { useState, useMemo } from "react";
import { LocationChip } from "../../components/app/report/LocationChip";
import { ReportItem } from "../../components/app/report/ReportItem";
import { ReportDetail } from "../../components/app/report/ReportDetail";
import { Camera, Mic, Send, Search, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Select } from "../../components/ui/Select";
import { MOCK_REPORTS, PAGE_SIZE } from "../../../lib/reportData";
import type { ReportSubmission, SeaRoughness, WindStrength, Observation, ForecastAccuracy } from "../../../types/report/types";
import dynamic from "next/dynamic";

const LocationPickerModal = dynamic(() => import("../../components/app/report/LocationPickerModal"), {
  ssr: false,
});

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
  const [location, setLocation] = useState("Kochi Port Waters · 9.9600°N, 76.2500°E");
  const [localReports, setLocalReports] = useState<ReportSubmission[]>(MOCK_REPORTS);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [roughness, setRoughness] = useState<SeaRoughness | undefined>();
  const [windStrength, setWindStrength] = useState<WindStrength | undefined>();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [forecastMatch, setForecastMatch] = useState<ForecastAccuracy | undefined>();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: 9.96,
    lng: 76.25,
  });

  const handleLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation("Kochi Port Waters · 9.9600°N, 76.2500°E");
      setSelectedCoords({ lat: 9.96, lng: 76.25 });
      setIsLocating(false);
    }, 900);
  };

  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matches = localReports.filter((r) => {
      const matchesSearch =
        !q ||
        r.location.label.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.seaState.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (filterValue === "photo") return r.attachments.some((a) => a.type === "photo");
      return true;
    });
    return filterValue === "oldest" ? [...matches].reverse() : matches;
  }, [searchQuery, filterValue, localReports]);

  const pageCount = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageReports = filteredReports.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const goToPage = (next: number) => {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newReport: ReportSubmission = {
        id: Math.random().toString(36).substring(7),
        title: "Field Report",
        reporter: "You",
        seaState: roughness ? roughness.replace("_", " ") : "Unknown",
        wind: windStrength ? windStrength : "Unknown",
        roughness,
        windStrength,
        observations,
        forecastMatch,
        notes,
        location: {
          lat: selectedCoords.lat,
          lng: selectedCoords.lng,
          label: location !== "Detecting..." ? location : "Kochi Port Waters · 9.9600°N, 76.2500°E",
        },
        attachments: [],
        timestamp: new Date().toISOString(),
      };
      setLocalReports([newReport, ...localReports]);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setView({ kind: "feed" });
        setRoughness(undefined);
        setWindStrength(undefined);
        setObservations([]);
        setForecastMatch(undefined);
        setNotes("");
        setIsSubmitting(false);
      }, 1500);
    }, 800);
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

            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-8 w-full relative overflow-hidden">
              {showSuccess && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mb-4">
                    <Send className="text-brand" size={24} />
                  </div>
                  <h3 className="text-xl font-instrument text-primary mb-2">Report Sent!</h3>
                  <p className="text-sm text-secondary font-intert">Thank you for updating the fleet.</p>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Current Location
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <LocationChip
                      label={location}
                      onClick={handleLocate}
                      isLoading={isLocating}
                    />
                    <button 
                      onClick={() => setShowMapPicker(true)}
                      className="inline-flex w-fit items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-all cursor-pointer"
                    >
                      <MapPin size={14} />
                      Pick from map
                    </button>
                  </div>
                  <p className="text-[10px] text-muted font-intert">Tap location on the map page to set coordinates</p>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    How rough is the water?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { val: "calm", label: "Calm (flat water)" },
                      { val: "slight", label: "Slight (small waves)" },
                      { val: "choppy", label: "Choppy (rocking)" },
                      { val: "rough", label: "Rough (big waves)" },
                      { val: "very_rough", label: "Very Rough (dangerous)" }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setRoughness(opt.val as SeaRoughness)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          roughness === opt.val
                            ? "bg-brand border-brand text-white"
                            : "bg-surface border-border text-secondary hover:bg-surface-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    How strong is the wind?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { val: "none", label: "No wind" },
                      { val: "light", label: "Light breeze" },
                      { val: "strong", label: "Strong wind" },
                      { val: "storm", label: "Storm wind" }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setWindStrength(opt.val as WindStrength)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          windStrength === opt.val
                            ? "bg-brand border-brand text-white"
                            : "bg-surface border-border text-secondary hover:bg-surface-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    What did you see?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { val: "good_catch", label: "Good catch" },
                      { val: "no_fish", label: "No fish" },
                      { val: "jellyfish", label: "Jellyfish" },
                      { val: "debris", label: "Debris / Trash" },
                      { val: "dolphins", label: "Dolphins" },
                      { val: "current", label: "Strong current" },
                      { val: "squall", label: "Squall / Rain" },
                      { val: "fog", label: "Fog" }
                    ].map(opt => {
                      const isSelected = observations.includes(opt.val as Observation);
                      return (
                        <button
                          key={opt.val}
                          onClick={() => {
                            if (isSelected) {
                              setObservations(observations.filter(o => o !== opt.val));
                            } else {
                              setObservations([...observations, opt.val as Observation]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-brand border-brand text-white"
                              : "bg-surface border-border text-secondary hover:bg-surface-muted"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Does the forecast match what you see?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { val: "accurate", label: "Yes, accurate" },
                      { val: "worse", label: "No, worse than forecast" },
                      { val: "calmer", label: "No, calmer than forecast" }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setForecastMatch(opt.val as ForecastAccuracy)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          forecastMatch === opt.val
                            ? "bg-brand border-brand text-white"
                            : "bg-surface border-border text-secondary hover:bg-surface-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted font-intert">
                    Anything else to report?
                  </label>
                  <textarea
                    rows={5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us what you noticed out there..."
                    className="w-full min-h-[120px] bg-transparent border border-border rounded-lg p-3 text-sm text-primary outline-none focus:border-brand transition-colors resize-y"
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-8 inline-flex items-center justify-center gap-2 py-3.5 rounded-lg btn-brand-solid text-sm font-medium shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span className="font-intert">Submitting...</span>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Condition Report
                  </>
                )}
              </button>
            </div>
            
            <LocationPickerModal
              isOpen={showMapPicker}
              initialCoords={selectedCoords}
              onClose={() => setShowMapPicker(false)}
              onSelect={(loc) => {
                setLocation(loc.label);
                setSelectedCoords({ lat: loc.lat, lng: loc.lng });
                setShowMapPicker(false);
              }}
            />
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
