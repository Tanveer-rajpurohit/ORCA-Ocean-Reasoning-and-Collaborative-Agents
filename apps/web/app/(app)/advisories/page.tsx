"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdvisoryItem } from "../../components/app/advisories/AdvisoryItem";
import { MOCK_ADVISORIES, ADVISORY_PAGE_SIZE } from "../../../lib/advisoriesData";

export default function AdvisoriesPage() {
  const [page, setPage] = useState(0);

  const hero = MOCK_ADVISORIES[0];
  const list = MOCK_ADVISORIES.slice(1);

  const pageCount = Math.max(1, Math.ceil(list.length / ADVISORY_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = list.slice(
    safePage * ADVISORY_PAGE_SIZE,
    safePage * ADVISORY_PAGE_SIZE + ADVISORY_PAGE_SIZE,
  );

  const goToPage = (next: number) => {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
  };

  if (!hero) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto font-intert bg-bg">
        <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
          <header className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
              Advisories
            </h1>
            <p className="text-sm text-muted font-intert mt-1">
              No active advisories detected in your region.
            </p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto font-intert bg-bg">
      <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
            Advisories
          </h1>
          <p className="text-sm text-muted font-intert mt-1">
            Daily fishing zone (PFZ) and ocean state (OSF) updates for your region.
          </p>
        </header>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative p-6 rounded-2xl bg-surface border border-border shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl bg-ocean" />
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-full bg-ocean/10 text-ocean text-[10px] font-bold uppercase tracking-wider">
                {hero.type} Advisory
              </span>
              <span className="text-xs text-muted font-intert">
                {hero.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-instrument text-primary mb-3 leading-tight">
              {hero.title}
            </h2>
            <p className="text-sm text-secondary font-intert leading-relaxed mb-6 max-w-2xl">
              {hero.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Location:
                </span>
                <span className="text-sm text-primary font-medium">
                  {hero.location}
                </span>
              </div>
              <span className="text-xs text-muted/60 italic">
                Source: {hero.citation}
              </span>
            </div>
          </div>

          {/* Detail List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-intert">
                Other Advisories
              </h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {pageItems.map((advisory, index) => (
              <AdvisoryItem
                key={advisory.id}
                advisory={advisory}
                index={safePage * ADVISORY_PAGE_SIZE + index}
              />
            ))}

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
        </div>
      </div>
    </div>
  );
}
