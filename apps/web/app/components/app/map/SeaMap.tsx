"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  FISHING_ZONES,
  HOME_PORT,
  IMBL_LINE,
  TEMP_POINTS,
  VESSEL_POSITION,
  WAVE_POINTS,
  WIND_POINTS,
  buildZonesGeoJson,
  tempColor,
  waveColor,
} from "../../../../lib/marineMapData";
import type { MapDataMode, MapViewMode } from "../../../../types";

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const WATER_COLOR = "#CFE3EC";
const START_CENTER: [number, number] = [75.85, 9.78];

interface SeaMapProps {
  mode: MapDataMode;
  viewMode: MapViewMode;
  onMapReady?: (map: maplibregl.Map) => void;
}

function element(className: string, inner: string): HTMLElement {
  const el = document.createElement("div");
  el.className = className;
  el.innerHTML = inner;
  return el;
}

export function SeaMap({ mode, viewMode, onMapReady }: SeaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const dataMarkersRef = useRef<maplibregl.Marker[]>([]);
  const baseMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: START_CENTER,
      zoom: 8.4,
      attributionControl: { compact: true },
      dragRotate: true,
    });

    mapRef.current = map;
    onMapReady?.(map);

    const timeout = window.setTimeout(() => {
      if (cancelled || map.loaded()) return;
      setError(
        "Map tiles did not load. Check your network connection, then retry.",
      );
    }, 12000);

    map.on("error", (event) => {
      if (cancelled) return;
      const message =
        event.error instanceof Error
          ? event.error.message
          : "Map failed to load";
      setError(message);
    });

    map.on("load", () => {
      if (cancelled) return;
      window.clearTimeout(timeout);

      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type === "fill" && layer.id.includes("water")) {
          map.setPaintProperty(layer.id, "fill-color", WATER_COLOR);
        }
      }

      map.addSource("zones", { type: "geojson", data: buildZonesGeoJson() });
      map.addLayer({
        id: "zone-fill",
        type: "fill",
        source: "zones",
        paint: { "fill-color": "#338E7F", "fill-opacity": 0.16 },
      });
      map.addLayer({
        id: "zone-line",
        type: "line",
        source: "zones",
        paint: {
          "line-color": "#338E7F",
          "line-width": 1.5,
          "line-dasharray": [3, 2],
        },
      });

      map.addSource("imbl", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: IMBL_LINE },
        },
      });
      map.addLayer({
        id: "imbl-line",
        type: "line",
        source: "imbl",
        paint: {
          "line-color": "#A4665C",
          "line-width": 1.5,
          "line-dasharray": [4, 3],
        },
      });

      setReady(true);
    });

    baseMarkersRef.current.push(
      new maplibregl.Marker({
        element: element(
          "px-2 py-0.5 rounded bg-surface/90 backdrop-blur-sm border border-border text-[10px] font-medium text-primary font-intert whitespace-nowrap",
          "Kochi · Home port",
        ),
      })
        .setLngLat(HOME_PORT)
        .addTo(map),
    );

    baseMarkersRef.current.push(
      new maplibregl.Marker({
        element: element(
          "px-2 py-0.5 rounded bg-[#193E53] text-white text-[10px] font-semibold font-intert whitespace-nowrap",
          "Your boat",
        ),
      })
        .setLngLat(VESSEL_POSITION)
        .addTo(map),
    );

    for (const zone of FISHING_ZONES) {
      baseMarkersRef.current.push(
        new maplibregl.Marker({
          element: element(
            "px-2 py-0.5 rounded bg-surface/90 backdrop-blur-sm border border-ocean/40 text-[10px] font-semibold text-ocean font-intert cursor-pointer",
            zone.name,
          ),
        })
          .setLngLat(zone.coordinates[1] as [number, number])
          .setPopup(
            new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div style="font-family:inherit">
                 <strong style="font-size:12px">${zone.name} · Fishing zone</strong>
                 <p style="margin:5px 0 0;color:#85919E;font-size:11px">
                   Bearing ${zone.bearingDeg}° · ${zone.distanceKm} km from Kochi
                 </p>
               </div>`,
            ),
          )
          .addTo(map),
      );
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      for (const marker of dataMarkersRef.current) marker.remove();
      for (const marker of baseMarkersRef.current) marker.remove();
      dataMarkersRef.current = [];
      baseMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [onMapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    for (const marker of dataMarkersRef.current) marker.remove();
    dataMarkersRef.current = [];

    if (mode === "waves") {
      for (const point of WAVE_POINTS) {
        const el = element(
          "grid place-items-center rounded-full border-2 border-white shadow-sm font-intert",
          `<span style="font-size:10px;font-weight:700;color:#fff">${point.heightM}</span>`,
        );
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.backgroundColor = waveColor(point.heightM);

        dataMarkersRef.current.push(
          new maplibregl.Marker({ element: el })
            .setLngLat(point.position)
            .addTo(map),
        );
      }
    }

    if (mode === "temperature") {
      for (const point of TEMP_POINTS) {
        const el = element(
          "grid place-items-center rounded-full border-2 border-white shadow-sm font-intert",
          `<span style="font-size:9.5px;font-weight:700;color:#fff">${point.celsius}</span>`,
        );
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.backgroundColor = tempColor(point.celsius);

        dataMarkersRef.current.push(
          new maplibregl.Marker({ element: el })
            .setLngLat(point.position)
            .addTo(map),
        );
      }
    }

    if (mode === "wind") {
      for (const point of WIND_POINTS) {
        const el = element(
          "flex flex-col items-center font-intert",
          `<svg width="24" height="24" viewBox="0 0 24 24" style="transform:rotate(${point.directionDeg}deg)">
             <path d="M12 3 L12 19 M12 3 L7 9 M12 3 L17 9"
                   stroke="#193E53" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round" fill="none"/>
           </svg>
           <span style="font-size:9.5px;font-weight:600;color:#193E53">${point.speedKmh}</span>`,
        );

        dataMarkersRef.current.push(
          new maplibregl.Marker({ element: el })
            .setLngLat(point.position)
            .addTo(map),
        );
      }
    }
  }, [mode, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      pitch: viewMode === "3d" ? 55 : 0,
      bearing: viewMode === "3d" ? -18 : 0,
      duration: 700,
    });
  }, [viewMode]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {!ready && !error && (
        <div className="absolute inset-0 grid place-items-center bg-surface-muted">
          <p className="text-xs text-muted font-intert">
            Connecting to map tiles…
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-surface-muted px-6">
          <div className="max-w-sm text-center">
            <p className="text-[13px] font-medium text-primary font-intert">
              The map could not load
            </p>
            <p className="text-[11.5px] text-muted font-intert mt-1.5 leading-relaxed break-words">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex items-center px-3 py-1.5 rounded-lg border border-border bg-surface text-[11.5px] font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
