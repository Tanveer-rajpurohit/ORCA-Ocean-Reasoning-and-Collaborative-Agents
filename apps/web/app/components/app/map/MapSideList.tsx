"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { MapDataMode } from "../../../../types";

interface SideRow {
  mode: MapDataMode;
  label: string;
  value: string;
  hint: string;
}

const ROWS: SideRow[] = [
  {
    mode: "waves",
    label: "Waves",
    value: "1.4 m",
    hint: "Slight",
  },
  {
    mode: "wind",
    label: "Wind",
    value: "12 km/h",
    hint: "North-west",
  },
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

interface MapSideListProps {
  mode: MapDataMode;
  onChangeMode: (mode: MapDataMode) => void;
}

export function MapSideList({ mode, onChangeMode }: MapSideListProps) {
  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="shrink-0">
        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted">
          Right now
        </p>
        <p className="font-instrument text-4xl text-primary leading-none tracking-tight mt-2">
          1.4
          <span className="text-lg text-muted ml-1">m</span>
        </p>
        <p className="text-[11.5px] text-muted font-intert mt-2">
          Within your boat&apos;s safe range
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {ROWS.map((row) => {
          const isActive = row.mode === mode;
          return (
            <button
              key={row.mode}
              type="button"
              onClick={() => onChangeMode(row.mode)}
              aria-pressed={isActive}
              className={`w-full flex items-center gap-3 px-3.5 py-3 text-left border-b border-border last:border-0 transition-colors cursor-pointer ${
                isActive ? "bg-brand/5" : "hover:bg-surface-muted/60"
              }`}
            >
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[12.5px] ${
                    isActive ? "text-brand font-medium" : "text-primary"
                  }`}
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
                className={`shrink-0 ${
                  isActive ? "text-brand" : "text-muted"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <p className="px-3.5 pt-3 pb-2 text-[10px] font-semibold tracking-[0.16em] uppercase text-muted">
          Other data
        </p>

        <div className="px-3.5 pb-3 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11.5px] text-secondary">Boundary</span>
            <span className="text-[11.5px] text-primary font-medium">
              Inside Indian waters
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11.5px] text-secondary">Home port</span>
            <span className="text-[11.5px] text-primary font-medium">Kochi</span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11.5px] text-secondary">Your boat</span>
            <span className="text-[11.5px] text-primary font-medium">
              75.86°E, 9.72°N
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/chat"
        className="mt-auto shrink-0 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl btn-brand-solid text-xs font-medium"
      >
        <span>Ask ORCA about this map</span>
        <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}
