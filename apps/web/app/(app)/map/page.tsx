"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Map as MapLibreMap } from "maplibre-gl";
import { MapControls, MapLegend, MapSideList } from "../../components/app/map";
import type { MapDataMode, MapViewMode } from "../../../types";

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

const START_CENTER: [number, number] = [75.85, 9.78];
const START_ZOOM = 8.4;

export default function MapPage() {
  const [mode, setMode] = useState<MapDataMode>("waves");
  const [viewMode, setViewMode] = useState<MapViewMode>("2d");
  const mapRef = useRef<MapLibreMap | null>(null);

  const handleMapReady = useCallback((map: MapLibreMap) => {
    mapRef.current = map;
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.easeTo({
      center: START_CENTER,
      zoom: START_ZOOM,
      pitch: viewMode === "3d" ? 55 : 0,
      bearing: viewMode === "3d" ? -18 : 0,
      duration: 700,
    });
  }, [viewMode]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
          Sea map
        </h1>
        <p className="text-sm text-muted font-intert mt-1">
          Where the fish are, how rough the water is, and where you must not go.
        </p>
      </div>

      <div className="flex-1 min-h-0 px-6 sm:px-10 lg:px-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-4 h-full min-h-0">
          <div className="hidden lg:flex min-h-0">
            <div className="w-full">
              <MapSideList mode={mode} onChangeMode={setMode} />
            </div>
          </div>

          <div className="relative rounded-xl border border-border bg-surface overflow-hidden min-h-0">
            <SeaMap mode={mode} viewMode={viewMode} onMapReady={handleMapReady} />
            <MapLegend mode={mode} />
            <MapControls
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              onZoomIn={() => mapRef.current?.zoomIn()}
              onZoomOut={() => mapRef.current?.zoomOut()}
              onReset={resetView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
