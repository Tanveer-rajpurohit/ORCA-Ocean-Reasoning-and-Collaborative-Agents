"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MapDataMode } from "../../../../types";

interface SideRow {
  mode: MapDataMode;
  label: string;
  value: string;
  hint: string;
}

const ROWS: SideRow[] = [
  { mode: "waves", label: "Waves", value: "1.4 m", hint: "Slight" },
  { mode: "wind", label: "Wind", value: "12 km/h", hint: "North-west" },
  {
    mode: "temperature",
    label: "Sea warmth",
    value: "28.4 °C",
    hint: "0.8° above normal",
  },
  {
    mode: "zones",
    label: "Fishing zones",
    value: "2 zones",
    hint: "38 km and 52 km out",
  },
];

const OTHER_DATA = [
  { label: "Boundary", value: "Inside Indian waters" },
  { label: "Home port", value: "Kochi" },
  { label: "Your boat", value: "75.86°E, 9.72°N" },
];

interface MapSideListProps {
  mode: MapDataMode;
  onChangeMode: (mode: MapDataMode) => void;
}

export function MapSideList({ mode, onChangeMode }: MapSideListProps) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className="pb-5 border-b border-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Right now
        </p>
        <p className="font-instrument text-4xl text-primary leading-none tracking-tight mt-2.5">
          1.4
          <span className="text-lg text-muted ml-1">m</span>
        </p>
        <p className="text-[11.5px] text-muted font-intert mt-2">
          Within your boat&apos;s safe range
        </p>
      </div>

      <div className="border-b border-border">
        {ROWS.map((row, index) => {
          const isActive = row.mode === mode;
          return (
            <button
              key={row.mode}
              type="button"
              onClick={() => onChangeMode(row.mode)}
              aria-pressed={isActive}
              className={`group w-full flex items-center gap-3 py-3.5 text-left border-b border-border last:border-0 transition-colors cursor-pointer ${
                isActive ? "bg-brand/[0.04]" : "hover:bg-surface"
              }`}
            >
              <span
                className={`font-mono text-lg tracking-[-0.06em] w-7 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-brand/50"
                    : "text-border group-hover:text-brand/35"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[12.5px] ${
                    isActive
                      ? "text-brand font-medium"
                      : "text-primary group-hover:text-brand"
                  } transition-colors`}
                >
                  {row.label}
                </span>
                <span className="block text-[10.5px] text-muted mt-0.5">
                  {row.hint}
                </span>
              </span>

              <span className="text-[12.5px] font-medium text-primary tabular-nums shrink-0">
                {row.value}
              </span>

              <ArrowRight
                size={13}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-brand"
                    : "text-muted group-hover:text-brand"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="pt-4 pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mb-3">
          Other data
        </p>
        <div className="space-y-2">
          {OTHER_DATA.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-3"
            >
              <span className="text-[11.5px] text-muted font-intert">
                {row.label}
              </span>
              <span className="text-[11.5px] text-secondary font-intert text-right">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/chat"
        className="mt-auto shrink-0 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-border bg-surface text-xs font-intert font-medium text-secondary hover:text-brand hover:border-brand/40 transition-colors"
      >
        <span>Ask ORCA about this map</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
