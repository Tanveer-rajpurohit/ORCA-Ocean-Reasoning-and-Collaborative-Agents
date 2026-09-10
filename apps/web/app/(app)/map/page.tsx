"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Map as MapLibreMap } from "maplibre-gl";
import { MapControls, MapLegend, MapSideList, SectorBadge } from "../../components/app/map";
import type { BasemapStyle, MapDataMode, MapViewMode } from "../../../types";

const SeaMap = dynamic(
  () => import("../../components/app/map/SeaMap").then((mod) => mod.SeaMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-surface-muted grid place-items-center">
        <p className="text-xs text-muted font-intert">Preparing the map…</p>
      </div>
    ),
  },
);

const START_CENTER: [number, number] = [76.015, 9.98];
const START_ZOOM = 8.6;
const MIN_SIDEBAR_WIDTH = 220;
const MAX_SIDEBAR_WIDTH = 580;
const DEFAULT_SIDEBAR_WIDTH = 280;

export default function MapPage() {
  const [mode, setMode] = useState<MapDataMode>("waves");
  const [viewMode, setViewMode] = useState<MapViewMode>("2d");
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>("chart");
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef<MapLibreMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("orca_map_sidebar_width");
      if (saved) {
        const parsed = Number.parseInt(saved, 10);
        if (
          !Number.isNaN(parsed) &&
          parsed >= MIN_SIDEBAR_WIDTH &&
          parsed <= MAX_SIDEBAR_WIDTH
        ) {
          setSidebarWidth(parsed);
        }
      }
    } catch {
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleResetWidth = useCallback(() => {
    setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
    try {
      localStorage.setItem(
        "orca_map_sidebar_width",
        String(DEFAULT_SIDEBAR_WIDTH),
      );
    } catch {
    }
    mapRef.current?.resize();
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const maxAllowed = Math.min(MAX_SIDEBAR_WIDTH, rect.width - 280);
      const clamped = Math.min(
        maxAllowed,
        Math.max(MIN_SIDEBAR_WIDTH, currentX),
      );
      setSidebarWidth(clamped);
      mapRef.current?.resize();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      try {
        localStorage.setItem("orca_map_sidebar_width", String(sidebarWidth));
      } catch {
      }
      mapRef.current?.resize();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, sidebarWidth]);

  const handleMapReady = useCallback((map: MapLibreMap) => {
    mapRef.current = map;
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.easeTo({
      center: START_CENTER,
      zoom: START_ZOOM,
      pitch: viewMode === "3d" ? 58 : 0,
      bearing: viewMode === "3d" ? -18 : 0,
      duration: 700,
    });
  }, [viewMode]);

  const centerOnLocation = useCallback(() => {
    mapRef.current?.flyTo({
      center: [76.04, 9.89],
      zoom: 9.8,
      pitch: viewMode === "3d" ? 54 : 0,
      bearing: viewMode === "3d" ? -18 : 0,
      duration: 800,
    });
  }, [viewMode]);

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${
        isDragging ? "select-none cursor-col-resize" : ""
      }`}
    >
      <div className="shrink-0 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-3">
        <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
          Sea map
        </h1>
        <p className="text-sm text-muted font-intert mt-1">
          Where the fish are, how rough the water is, and where you must not go.
        </p>
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div
          ref={containerRef}
          className="flex flex-col lg:flex-row h-full min-h-0 relative"
        >
          <div
            className="hidden lg:flex min-h-0 shrink-0"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div className="w-full h-full min-h-0 pr-2.5">
              <MapSideList mode={mode} onChangeMode={setMode} />
            </div>
          </div>

          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={handleResetWidth}
            title="Drag to resize sidebar (220px to 580px) · Double click to reset"
            className={`hidden lg:flex items-center justify-center w-2.5 cursor-col-resize group select-none shrink-0 transition-colors ${
              isDragging ? "bg-brand/10" : "hover:bg-brand/5"
            }`}
          >
            <div
              className={`w-0.5 h-8 rounded-full transition-colors ${
                isDragging
                  ? "bg-brand"
                  : "bg-border group-hover:bg-brand/60"
              }`}
            />
          </div>

          <div className="relative flex-1 rounded-xl border border-border bg-surface overflow-hidden min-h-0 min-w-0">
            <SeaMap
              mode={mode}
              viewMode={viewMode}
              basemapStyle={basemapStyle}
              onMapReady={handleMapReady}
            />
            <MapLegend mode={mode} />
            <SectorBadge />
            <MapControls
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              basemapStyle={basemapStyle}
              onChangeBasemapStyle={setBasemapStyle}
              onZoomIn={() => mapRef.current?.zoomIn()}
              onZoomOut={() => mapRef.current?.zoomOut()}
              onReset={resetView}
              onCenterBoat={centerOnLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
