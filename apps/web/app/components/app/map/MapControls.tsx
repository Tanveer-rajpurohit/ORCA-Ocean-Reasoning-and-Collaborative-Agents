"use client";

import {
  Globe,
  LocateFixed,
  Map as MapIcon,
  Minus,
  Moon,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { BasemapStyle, MapViewMode } from "../../../../types";

interface MapChromeProps {
  viewMode: MapViewMode;
  onChangeViewMode: (mode: MapViewMode) => void;
  basemapStyle: BasemapStyle;
  onChangeBasemapStyle: (style: BasemapStyle) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenterBoat?: () => void;
}

const CHROME =
  "rounded-xl border border-border-subtle bg-surface/90 backdrop-blur-md shadow-xs";

const BASEMAP_OPTIONS = [
  {
    id: "chart" as const,
    label: "Chart",
    title: "Nautical vector chart",
    icon: MapIcon,
  },
  {
    id: "satellite" as const,
    label: "Satellite",
    title: "ESRI satellite imagery",
    icon: Globe,
  },
  {
    id: "dark" as const,
    label: "Radar",
    title: "Tactical night radar",
    icon: Moon,
  },
];

export function MapControls({
  viewMode,
  onChangeViewMode,
  basemapStyle,
  onChangeBasemapStyle,
  onZoomIn,
  onZoomOut,
  onReset,
  onCenterBoat,
}: MapChromeProps) {
  return (
    <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 font-intert">
      <div className={`${CHROME} flex flex-col overflow-hidden`}>
        {BASEMAP_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = basemapStyle === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeBasemapStyle(option.id)}
              aria-pressed={isActive}
              title={option.title}
              className={`w-8 h-8 grid place-items-center transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-brand text-white shadow-xs"
                  : "text-secondary hover:text-primary hover:bg-surface-muted"
              }`}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>

      <div className={`${CHROME} flex flex-col overflow-hidden`}>
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          className="w-8 h-8 grid place-items-center text-secondary hover:text-primary hover:bg-surface-muted transition-all duration-200 cursor-pointer active:scale-95"
        >
          <Plus size={15} />
        </button>
        <span aria-hidden className="h-px bg-border" />
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          className="w-8 h-8 grid place-items-center text-secondary hover:text-primary hover:bg-surface-muted transition-all duration-200 cursor-pointer active:scale-95"
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
            title={option === "3d" ? "Nautical 3D perspective" : "Top down 2D chart"}
            className={`w-8 h-8 grid place-items-center text-[10.5px] font-semibold transition-colors cursor-pointer ${
              viewMode === option
                ? "bg-brand text-white shadow-xs"
                : "text-secondary hover:text-primary hover:bg-surface-muted"
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      {onCenterBoat && (
        <button
          type="button"
          onClick={onCenterBoat}
          aria-label="Center on your location"
          title="Locate your location"
          className={`${CHROME} w-8 h-8 grid place-items-center text-secondary hover:text-brand hover:bg-surface-muted transition-colors cursor-pointer`}
        >
          <LocateFixed size={15} />
        </button>
      )}

      <button
        type="button"
        onClick={onReset}
        aria-label="Reset orientation and center"
        title="Reset to North orientation"
        className={`${CHROME} w-8 h-8 grid place-items-center text-secondary hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer`}
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
