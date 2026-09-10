"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  FISHING_ZONES,
  HOME_PORT,
  IMBL_LINE,
  NAV_ROUTE,
  TEMP_POINTS,
  VESSEL_POSITION,
  WAVE_POINTS,
  WIND_POINTS,
  buildZonesGeoJson,
  tempColor,
  waveColor,
} from "../../../../lib/marineMapData";
import type { BasemapStyle, MapDataMode, MapViewMode } from "../../../../types";

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const WATER_COLOR = "#c8e0e8";
const START_CENTER: [number, number] = [76.015, 9.98];

interface SeaMapProps {
  mode: MapDataMode;
  viewMode: MapViewMode;
  basemapStyle?: BasemapStyle;
  onMapReady?: (map: maplibregl.Map) => void;
}

function element(className: string, inner: string): HTMLElement {
  const el = document.createElement("div");
  el.className = className;
  el.innerHTML = inner;
  return el;
}

export function SeaMap({
  mode,
  viewMode,
  basemapStyle = "chart",
  onMapReady,
}: SeaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const dataMarkersRef = useRef<maplibregl.Marker[]>([]);
  const baseMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (typeof window !== "undefined") {
      try {
        maplibregl.setWorkerUrl("/lib/maplibre/maplibre-gl-worker.mjs");
      } catch {
      }
    }

    let cancelled = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: START_CENTER,
      zoom: 8.6,
      pitch: viewMode === "3d" ? 56 : 0,
      bearing: viewMode === "3d" ? -18 : 0,
      dragRotate: true,
      pitchWithRotate: true,
      maxPitch: 70,
      attributionControl: false,
    });

    mapRef.current = map;
    onMapReady?.(map);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(() => {
            map.resize();
          })
        : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const timeout = window.setTimeout(() => {
      if (cancelled || map.loaded()) return;
      setError(
        "Map tiles did not load. Check your network connection, then retry.",
      );
    }, 15000);

    map.on("error", (event) => {
      if (cancelled) return;
      const message =
        event.error instanceof Error
          ? event.error.message
          : "Map failed to load";
      if (!map.loaded() && !ready) {
        console.warn("MapLibre tile event:", message);
      }
    });

    map.on("load", () => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      setError(null);

      try {
        for (const layer of map.getStyle().layers ?? []) {
          if (layer.type === "fill" && layer.id.includes("water")) {
            map.setPaintProperty(layer.id, "fill-color", WATER_COLOR);
          }
        }
      } catch {
      }

      try {
        map.addSource("satellite-tiles", {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 19,
        });
        map.addLayer({
          id: "satellite-layer",
          type: "raster",
          source: "satellite-tiles",
          layout: {
            visibility: basemapStyle === "satellite" ? "visible" : "none",
          },
        });

        map.addSource("dark-tiles", {
          type: "raster",
          tiles: [
            "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          ],
          tileSize: 256,
          maxzoom: 19,
        });
        map.addLayer({
          id: "dark-layer",
          type: "raster",
          source: "dark-tiles",
          layout: {
            visibility: basemapStyle === "dark" ? "visible" : "none",
          },
        });
      } catch {
      }

      map.addSource("zones", { type: "geojson", data: buildZonesGeoJson() });
      map.addLayer({
        id: "zone-fill",
        type: "fill",
        source: "zones",
        paint: { "fill-color": "#3ca996", "fill-opacity": 0.22 },
      });
      map.addLayer({
        id: "zone-line",
        type: "line",
        source: "zones",
        paint: {
          "line-color": "#2a8072",
          "line-width": 1.8,
          "line-dasharray": [4, 3],
        },
      });

      map.addSource("corridor", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: NAV_ROUTE,
          },
        },
      });
      map.addLayer({
        id: "corridor-glow",
        type: "line",
        source: "corridor",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 6,
          "line-opacity": 0.2,
        },
      });
      map.addLayer({
        id: "corridor-line",
        type: "line",
        source: "corridor",
        paint: {
          "line-color": "#2563eb",
          "line-width": 2.2,
          "line-dasharray": [4, 3],
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
          "line-color": "#dc2626",
          "line-width": 1.8,
          "line-dasharray": [5, 4],
        },
      });

      setReady(true);
    });

    baseMarkersRef.current.push(
      new maplibregl.Marker({
        element: element(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/95 backdrop-blur-sm border border-border text-[10.5px] font-semibold text-primary font-intert shadow-xs whitespace-nowrap cursor-pointer",
          "<span>⚓</span><span>Kochi · Home port</span>",
        ),
      })
        .setLngLat(HOME_PORT)
        .addTo(map),
    );

    baseMarkersRef.current.push(
      new maplibregl.Marker({
        element: element(
          "relative flex items-center justify-center cursor-pointer",
          `<span class="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-ping pointer-events-none"></span>` +
          `<span class="absolute w-6 h-6 rounded-full bg-blue-500/25 pointer-events-none"></span>` +
          `<div class="relative w-4 h-4 rounded-full bg-[#1a73e8] border-[2.5px] border-white shadow-md"></div>`,
        ),
      })
        .setLngLat(VESSEL_POSITION)
        .setPopup(
          new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(
            `<div style="font-family:inherit;padding:2px 4px">
               <div style="display:flex;align-items:center;gap:6px">
                 <span style="width:7px;height:7px;border-radius:50%;background:#1a73e8"></span>
                 <strong style="font-size:12px;color:#0f172a">Your location</strong>
               </div>
               <div style="font-size:11px;color:#64748b;margin-top:3px">
                 76.04°E, 9.89°N · Inside Indian waters
               </div>
             </div>`,
          ),
        )
        .addTo(map),
    );

    for (const zone of FISHING_ZONES) {
      baseMarkersRef.current.push(
        new maplibregl.Marker({
          element: element(
            "flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/95 backdrop-blur-sm border border-emerald-600/40 text-[10px] font-bold text-emerald-800 font-intert shadow-xs cursor-pointer",
            `<span>◈</span><span>${zone.name.split(" · ")[0]}</span>`,
          ),
        })
          .setLngLat(zone.centroid)
          .setPopup(
            new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div style="font-family:inherit">
                 <strong style="font-size:12px">${zone.name}</strong>
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
      resizeObserver?.disconnect();
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
          "grid place-items-center rounded-full border-2 border-white shadow-sm font-intert cursor-pointer",
          `<span style="font-size:9.5px;font-weight:700;color:#fff">${point.heightM}m</span>`,
        );
        el.style.width = "32px";
        el.style.height = "32px";
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
          "grid place-items-center rounded-full border-2 border-white shadow-sm font-intert cursor-pointer",
          `<span style="font-size:9.5px;font-weight:700;color:#fff">${point.celsius}°</span>`,
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
          "flex flex-col items-center font-intert cursor-pointer",
          `<svg width="22" height="22" viewBox="0 0 24 24" style="transform:rotate(${point.directionDeg}deg)">
             <path d="M12 3 L12 19 M12 3 L7 9 M12 3 L17 9"
                   stroke="#193E53" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" fill="none"/>
           </svg>
           <span style="font-size:9px;font-weight:700;color:#193E53;background:#fff;padding:1px 4px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.1)">${point.speedKmh}</span>`,
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
    if (viewMode === "3d") {
      map.dragRotate.enable();
      map.touchPitch.enable();
      map.easeTo({
        pitch: 58,
        bearing: -18,
        duration: 900,
      });
    } else {
      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 700,
      });
    }
  }, [viewMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    try {
      if (map.getLayer("satellite-layer")) {
        map.setLayoutProperty(
          "satellite-layer",
          "visibility",
          basemapStyle === "satellite" ? "visible" : "none",
        );
      }
      if (map.getLayer("dark-layer")) {
        map.setLayoutProperty(
          "dark-layer",
          "visibility",
          basemapStyle === "dark" ? "visible" : "none",
        );
      }
    } catch {
    }
  }, [basemapStyle, ready]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#cce2e9]">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 800 370"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <rect width="800" height="370" fill="#cce2e9" />
          <path
            d="M515 -30L537 20L530 60L555 110L550 150L581 198L591 245L634 290L648 390H850V-30Z"
            fill="#eef0e8"
            stroke="#a9c8c8"
            strokeWidth="2"
          />
          <g stroke="#a4c3d1" fill="none" opacity="0.4">
            <path d="M420 -30Q440 90 480 150T550 390" />
            <path d="M380 -30Q400 90 440 150T510 390" />
            <path d="M330 -30Q360 90 390 150T460 390" />
          </g>
          <path
            d="M558 170L320 214"
            stroke="#447192"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <g fill="#65858e" fontSize="13" fontFamily="sans-serif">
            <text x="581" y="174">
              Kochi
            </text>
            <text x="525" y="68">
              Vypin
            </text>
            <text x="640" y="304">
              Alappuzha
            </text>
            <text x="100" y="170" letterSpacing="4" opacity="0.7">
              ARABIAN SEA
            </text>
          </g>
          <circle
            cx="558"
            cy="170"
            r="7"
            fill="#366986"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-500 [&_.maplibregl-ctrl-attrib]:hidden ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      {!ready && !error && (
        <div className="absolute inset-0 grid place-items-center bg-surface-muted/60 pointer-events-none">
          <p className="text-xs text-muted font-intert">
            Connecting to nautical chart…
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-surface-muted/90 px-6 z-20">
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
