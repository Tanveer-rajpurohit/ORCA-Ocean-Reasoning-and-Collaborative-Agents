"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { X, MapPin, LocateFixed, Check } from "lucide-react";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (loc: { lat: number; lng: number; label: string }) => void;
  initialCoords?: { lat: number; lng: number };
}

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const WATER_COLOR = "#c8e0e8";
const KOCHI_PORT_COORDS: [number, number] = [76.25, 9.96];

interface MarineLandmark {
  name: string;
  lat: number;
  lng: number;
}

const COASTAL_LANDMARKS: MarineLandmark[] = [
  { name: "Kochi Port Waters", lat: 9.960, lng: 76.250 },
  { name: "Fort Kochi Coast", lat: 9.965, lng: 76.242 },
  { name: "Mattancherry Channel", lat: 9.950, lng: 76.255 },
  { name: "Vypin Fishing Sector", lat: 10.020, lng: 76.210 },
  { name: "Cherai Beach Waters", lat: 10.140, lng: 76.180 },
  { name: "Munambam Harbor Waters", lat: 10.180, lng: 76.170 },
  { name: "Chellanam Coastal Waters", lat: 9.790, lng: 76.280 },
  { name: "Andhakaranazhy Waters", lat: 9.720, lng: 76.290 },
  { name: "Alappuzha North Offshore", lat: 9.500, lng: 76.300 },
  { name: "Perinjanam Sector", lat: 10.280, lng: 76.140 },
  { name: "Kochi South Approach", lat: 9.880, lng: 76.180 },
  { name: "Outer Arabian Shelf", lat: 9.900, lng: 75.750 },
];

function resolveMarineLocationName(lat: number, lng: number): string {
  if (lng < 75.82) {
    return "Deep Arabian Sea Basin";
  }

  let closestName = "Kochi Port Waters";
  let minDistanceSq = Number.MAX_VALUE;

  for (const landmark of COASTAL_LANDMARKS) {
    const dLat = (lat - landmark.lat) * 111;
    const dLng = (lng - landmark.lng) * 111 * Math.cos((lat * Math.PI) / 180);
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestName = landmark.name;
    }
  }

  const distanceKm = Math.round(Math.sqrt(minDistanceSq));
  if (distanceKm <= 3) {
    return closestName;
  }

  return `${distanceKm} km off ${closestName}`;
}

function createRedPinElement(): HTMLElement {
  const el = document.createElement("div");
  el.className = "select-none cursor-pointer";
  el.style.width = "30px";
  el.style.height = "42px";
  el.style.display = "block";
  el.style.position = "relative";
  el.innerHTML = `
    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 5px; background: rgba(0,0,0,0.35); border-radius: 50%; filter: blur(1px);"></div>
    <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));">
      <path d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.716 23.284 0 15 0Z" fill="#EA4335"/>
      <path d="M15 0.75C7.13 0.75 0.75 7.13 0.75 15C0.75 25.1 14.25 39.8 15 40.6C15.75 39.8 29.25 25.1 29.25 15C29.25 7.13 22.87 0.75 15 0.75Z" stroke="#B31412" stroke-width="1.5"/>
      <circle cx="15" cy="15" r="6" fill="#762723"/>
      <circle cx="15" cy="15" r="3.5" fill="#FFFFFF"/>
    </svg>
  `;
  return el;
}

function createBlueDotElement(): HTMLElement {
  const el = document.createElement("div");
  el.className = "select-none cursor-pointer";
  el.style.width = "28px";
  el.style.height = "28px";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.position = "relative";
  el.innerHTML = `
    <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(26, 115, 232, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
    <span style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(26, 115, 232, 0.35);"></span>
    <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #1A73E8; border: 2.5px solid #FFFFFF; box-shadow: 0 1px 4px rgba(0,0,0,0.4);"></div>
  `;
  return el;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialCoords,
}: LocationPickerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const baseMarkerRef = useRef<maplibregl.Marker | null>(null);
  const selectedMarkerRef = useRef<maplibregl.Marker | null>(null);

  const initialLat = initialCoords?.lat ?? KOCHI_PORT_COORDS[1];
  const initialLng = initialCoords?.lng ?? KOCHI_PORT_COORDS[0];

  const coordsRef = useRef<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
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
      center: [coordsRef.current.lng, coordsRef.current.lat],
      zoom: 11,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("error", (event) => {
      if (cancelled) return;
      const message =
        event.error instanceof Error
          ? event.error.message
          : "Map warning";
      console.warn("LocationPickerMap event:", message);
    });

    map.on("load", () => {
      if (cancelled) return;
      setMapLoaded(true);
      map.resize();

      try {
        for (const layer of map.getStyle().layers ?? []) {
          if (layer.type === "fill" && layer.id.includes("water")) {
            map.setPaintProperty(layer.id, "fill-color", WATER_COLOR);
          }
        }
      } catch {
      }
    });

    const blueDot = createBlueDotElement();
    const baseMarker = new maplibregl.Marker({
      element: blueDot,
      anchor: "center",
    })
      .setLngLat(KOCHI_PORT_COORDS)
      .addTo(map);
    baseMarkerRef.current = baseMarker;

    const redPin = createRedPinElement();
    const pin = new maplibregl.Marker({
      element: redPin,
      anchor: "bottom",
    })
      .setLngLat([coordsRef.current.lng, coordsRef.current.lat])
      .addTo(map);
    selectedMarkerRef.current = pin;

    map.on("click", (e: { lngLat: { lng: number; lat: number } }) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoords({ lat, lng });
      coordsRef.current = { lat, lng };

      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.setLngLat([lng, lat]);
      }
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(() => {
            map.resize();
          })
        : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const t1 = setTimeout(() => {
      if (!cancelled && mapRef.current) {
        mapRef.current.resize();
      }
    }, 100);

    const t2 = setTimeout(() => {
      if (!cancelled && mapRef.current) {
        mapRef.current.resize();
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver?.disconnect();
      baseMarkerRef.current?.remove();
      baseMarkerRef.current = null;
      selectedMarkerRef.current?.remove();
      selectedMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, [isOpen]);

  const snapToKochiPort = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: KOCHI_PORT_COORDS, zoom: 11.5, duration: 600 });
    setSelectedCoords({ lat: KOCHI_PORT_COORDS[1], lng: KOCHI_PORT_COORDS[0] });
    coordsRef.current = { lat: KOCHI_PORT_COORDS[1], lng: KOCHI_PORT_COORDS[0] };

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setLngLat(KOCHI_PORT_COORDS);
    }
  };

  if (!isOpen) return null;

  const locationName = resolveMarineLocationName(selectedCoords.lat, selectedCoords.lng);
  const formattedCoords = `${selectedCoords.lat.toFixed(4)}°N, ${selectedCoords.lng.toFixed(4)}°E`;

  const handleConfirm = () => {
    onSelect({
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      label: `${locationName} · ${formattedCoords}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[92vw] max-w-4xl h-[82vh] max-h-[740px] my-auto rounded-2xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0 bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <MapPin size={16} />
            </div>
            <div>
              <h2 className="text-base font-instrument text-primary leading-tight">
                Pick report location
              </h2>
              <p className="text-xs text-muted font-intert">
                Tap anywhere on the sea map to set report coordinates
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-muted text-muted hover:text-primary transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative flex-1 min-h-0 w-full bg-[#cce2e9] overflow-hidden">
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${mapLoaded ? "opacity-0" : "opacity-40"}`}>
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
                strokeWidth={2}
              />
              <g stroke="#a4c3d1" fill="none" opacity="0.4">
                <path d="M420 -30Q440 90 480 150T550 390" />
                <path d="M380 -30Q400 90 440 150T510 390" />
                <path d="M330 -30Q360 90 390 150T460 390" />
              </g>
              <path
                d="M558 170L320 214"
                stroke="#447192"
                strokeWidth={2}
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
                strokeWidth={3}
              />
            </svg>
          </div>

          <div
            ref={containerRef}
            className={`absolute inset-0 transition-opacity duration-500 [&_.maplibregl-ctrl-attrib]:hidden ${
              mapLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-surface-muted/30">
              <p className="text-xs text-muted font-intert">Loading marine map...</p>
            </div>
          )}

          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={snapToKochiPort}
              aria-label="Center on Kochi Port"
              title="Center on Kochi Port"
              className="w-9 h-9 rounded-xl border border-border-subtle bg-surface/95 backdrop-blur-md shadow-xs grid place-items-center text-secondary hover:text-brand hover:bg-surface-muted transition-all cursor-pointer active:scale-95"
            >
              <LocateFixed size={18} />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface/95 border border-border-subtle shadow-xs text-xs font-intert text-secondary backdrop-blur-md">
              <span className="relative flex items-center justify-center w-3 h-3 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] border border-white shadow-2xs"></span>
              </span>
              <span>Kochi Port (Base)</span>
              <span className="text-muted/60">|</span>
              <svg width="12" height="17" viewBox="0 0 28 40" fill="none" className="shrink-0 drop-shadow-xs">
                <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 40 14 40C14 40 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#EA4335"/>
                <path d="M14 0.5C6.544 0.5 0.5 6.544 0.5 14C0.5 24 13.5 38.8 14 39.4C14.5 38.8 27.5 24 27.5 14C27.5 6.544 21.456 0.5 14 0.5Z" stroke="#B31412" strokeWidth={1}/>
                <circle cx="14" cy="14" r="5.5" fill="#762723"/>
                <circle cx="14" cy="14" r="3.5" fill="#FFFFFF"/>
              </svg>
              <span>Selected pin</span>
            </div>
          </div>
        </div>

        <div className="relative z-30 shrink-0 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border bg-surface">
          <div className="min-h-[36px] flex flex-col justify-center">
            <p className="text-sm font-semibold text-primary font-intert leading-tight">
              {locationName}
            </p>
            <p className="text-xs text-muted font-mono mt-0.5">
              {formattedCoords}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-xs font-medium shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>Confirm location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
