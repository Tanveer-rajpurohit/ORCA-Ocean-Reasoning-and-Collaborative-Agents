"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import type { MapViewMode } from "../../../../types";

interface MapChromeProps {
  viewMode: MapViewMode;
  onChangeViewMode: (mode: MapViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const CHROME =
  "rounded-lg border border-border bg-surface/85 backdrop-blur-md shadow-sm";

export function MapControls({
  viewMode,
  onChangeViewMode,
  onZoomIn,
  onZoomOut,
  onReset,
}: MapChromeProps) {
  return (
    <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
      <div className={`${CHROME} flex flex-col overflow-hidden`}>
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          className="w-8 h-8 grid place-items-center text-secondary hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
        >
          <Plus size={15} />
        </button>
        <span aria-hidden className="h-px bg-border" />
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          className="w-8 h-8 grid place-items-center text-secondary hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
        >
          <Minus size={15} />
        </button>
      </div>

      <div className={`${CHROME} flex flex-col overflow-hidden`}>
        {(["2d", "3d"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChangeViewMode(option)}
            aria-pressed={viewMode === option}
            className={`w-8 h-8 grid place-items-center text-[10px] font-semibold transition-colors cursor-pointer ${
              viewMode === option
                ? "bg-brand text-white"
                : "text-secondary hover:text-primary hover:bg-surface-muted"
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onReset}
        aria-label="Reset view"
        className={`${CHROME} w-8 h-8 grid place-items-center text-secondary hover:text-primary transition-colors cursor-pointer`}
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
