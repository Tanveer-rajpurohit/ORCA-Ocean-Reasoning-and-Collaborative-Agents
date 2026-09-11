import type { Coordinate } from "../types";

export interface WindPoint {
  position: Coordinate;
  directionDeg: number;
  speedKmh: number;
}

export interface WavePoint {
  position: Coordinate;
  heightM: number;
}

export interface ZonePolygon {
  name: string;
  bearingDeg: number;
  distanceKm: number;
  centroid: Coordinate;
  coordinates: Coordinate[];
}

export const HOME_PORT: Coordinate = [76.25, 9.96];

export const VESSEL_POSITION: Coordinate = [76.04, 9.89];

export const NAV_ROUTE: Coordinate[] = [
  [76.25, 9.96],
  [76.13, 9.92],
  [76.04, 9.89],
  [75.9, 9.83],
];

export const FISHING_ZONES: ZonePolygon[] = [
  {
    name: "PFZ 01 · Southwest of Kochi",
    bearingDeg: 240,
    distanceKm: 38,
    centroid: [75.9, 9.83],
    coordinates: [
      [75.75, 9.82],
      [75.84, 9.91],
      [75.99, 9.94],
      [76.04, 9.84],
      [75.91, 9.72],
      [75.78, 9.73],
      [75.75, 9.82],
    ],
  },
  {
    name: "PFZ 02 · West of Vypin",
    bearingDeg: 295,
    distanceKm: 42,
    centroid: [75.9, 10.17],
    coordinates: [
      [75.78, 10.13],
      [75.88, 10.24],
      [76.0, 10.25],
      [76.03, 10.15],
      [75.91, 10.08],
      [75.78, 10.13],
    ],
  },
];

export const WIND_POINTS: WindPoint[] = [
  { position: [76.14, 10.04], directionDeg: 310, speedKmh: 10 },
  { position: [75.72, 10.28], directionDeg: 320, speedKmh: 14 },
  { position: [76.02, 9.55], directionDeg: 295, speedKmh: 11 },
  { position: [75.55, 9.92], directionDeg: 315, speedKmh: 16 },
  { position: [75.25, 9.7], directionDeg: 325, speedKmh: 21 },
];

export const WAVE_POINTS: WavePoint[] = [
  { position: [76.14, 10.04], heightM: 0.9 },
  { position: [75.72, 10.28], heightM: 1.2 },
  { position: [76.02, 9.55], heightM: 1.3 },
  { position: [75.55, 9.92], heightM: 1.7 },
  { position: [75.25, 9.7], heightM: 2.2 },
];

export const IMBL_LINE: Coordinate[] = [
  [74.8, 10.5],
  [74.95, 10.0],
  [75.05, 9.5],
  [74.9, 9.0],
  [74.7, 8.5],
];

export interface TempPoint {
  position: Coordinate;
  celsius: number;
}

export const TEMP_POINTS: TempPoint[] = [
  { position: [76.14, 10.04], celsius: 28.5 },
  { position: [75.72, 10.28], celsius: 28.2 },
  { position: [76.02, 9.55], celsius: 28.4 },
  { position: [75.55, 9.92], celsius: 27.6 },
  { position: [75.25, 9.7], celsius: 27.1 },
];

export function tempColor(celsius: number): string {
  if (celsius < 27.4) return "#176B87";
  if (celsius < 27.9) return "#007C70";
  if (celsius < 28.3) return "#D96B1D";
  return "#B33A2B";
}

export function tempLabel(celsius: number): string {
  if (celsius < 27.4) return "Cool break";
  if (celsius < 27.9) return "Cooling";
  if (celsius < 28.3) return "Seasonal";
  return "Warm";
}

export const FORECAST_HOURS = [
  "Now",
  "09:00",
  "12:00",
  "15:00",
  "18:00",
  "21:00",
  "Tomorrow",
];

export function waveColor(heightM: number): string {
  if (heightM < 1) return "#007C56";
  if (heightM < 1.5) return "#2F9B83";
  if (heightM < 2) return "#D96B1D";
  return "#B33A2B";
}

export function waveLabel(heightM: number): string {
  if (heightM < 1) return "Calm";
  if (heightM < 1.5) return "Slight";
  if (heightM < 2) return "Moderate";
  return "Rough";
}

export interface ZoneFeatureCollection {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: { name: string; bearingDeg: number; distanceKm: number };
    geometry: { type: "Polygon"; coordinates: Coordinate[][] };
  }[];
}

export function buildZonesGeoJson(): ZoneFeatureCollection {
  return {
    type: "FeatureCollection",
    features: FISHING_ZONES.map((zone) => ({
      type: "Feature",
      properties: {
        name: zone.name,
        bearingDeg: zone.bearingDeg,
        distanceKm: zone.distanceKm,
      },
      geometry: {
        type: "Polygon",
        coordinates: [zone.coordinates],
      },
    })),
  };
}
