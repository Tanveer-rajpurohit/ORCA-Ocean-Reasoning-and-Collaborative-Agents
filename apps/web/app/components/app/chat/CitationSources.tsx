"use client";

import type { Citation } from "../../../../types";

interface CitationSourcesProps {
  citations: Citation[];
}

export function CitationSources({ citations }: CitationSourcesProps) {
  if (citations.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-3 font-intert">
      <span className="text-[11px] text-muted">
        Sources ({citations.length})
      </span>

      {citations.map((citation, index) => (
        <a
          key={`${citation.source}-${citation.reference}`}
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${citation.source} · ${citation.reference} · issued ${citation.issued}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand/10 text-brand hover:bg-brand/15 transition-colors max-w-full"
        >
          <span className="tabular-nums">{index + 1}</span>
          <span className="text-brand/40">·</span>
          <span className="truncate max-w-[220px]">{citation.reference}</span>
        </a>
      ))}
    </div>
  );
}
