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
  coordinates: Coordinate[];
}

export const HOME_PORT: Coordinate = [76.25, 9.96];

export const VESSEL_POSITION: Coordinate = [75.86, 9.72];

export const FISHING_ZONES: ZonePolygon[] = [
  {
    name: "Zone A",
    bearingDeg: 247,
    distanceKm: 38,
    coordinates: [
      [75.62, 9.74],
      [75.74, 9.7],
      [75.82, 9.58],
      [75.7, 9.52],
      [75.58, 9.62],
      [75.62, 9.74],
    ],
  },
  {
    name: "Zone B",
    bearingDeg: 231,
    distanceKm: 52,
    coordinates: [
      [75.34, 9.46],
      [75.48, 9.42],
      [75.54, 9.3],
      [75.4, 9.26],
      [75.3, 9.36],
      [75.34, 9.46],
    ],
  },
];

export const WIND_POINTS: WindPoint[] = [
  { position: [75.9, 10.15], directionDeg: 315, speedKmh: 14 },
  { position: [76.1, 10.05], directionDeg: 320, speedKmh: 11 },
  { position: [75.7, 9.95], directionDeg: 305, speedKmh: 16 },
  { position: [75.9, 9.8], directionDeg: 310, speedKmh: 12 },
  { position: [76.15, 9.75], directionDeg: 300, speedKmh: 9 },
  { position: [75.6, 9.6], directionDeg: 295, speedKmh: 19 },
  { position: [75.85, 9.5], directionDeg: 300, speedKmh: 15 },
  { position: [76.05, 9.4], directionDeg: 290, speedKmh: 10 },
];

export const WAVE_POINTS: WavePoint[] = [
  { position: [75.95, 10.1], heightM: 0.8 },
  { position: [76.15, 9.98], heightM: 1.1 },
  { position: [75.75, 9.88], heightM: 1.4 },
  { position: [75.95, 9.72], heightM: 1.7 },
  { position: [76.2, 9.62], heightM: 1.2 },
  { position: [75.55, 9.55], heightM: 2.3 },
  { position: [75.8, 9.42], heightM: 2.0 },
  { position: [76.05, 9.32], heightM: 1.3 },
];

export const IMBL_LINE: Coordinate[] = [
  [74.9, 10.4],
  [75.05, 9.95],
  [75.12, 9.45],
  [74.95, 8.95],
  [74.7, 8.5],
];

export interface TempPoint {
  position: Coordinate;
  celsius: number;
}

export const TEMP_POINTS: TempPoint[] = [
  { position: [75.95, 10.1], celsius: 28.4 },
  { position: [76.15, 9.98], celsius: 28.2 },
  { position: [75.75, 9.88], celsius: 27.8 },
  { position: [75.95, 9.72], celsius: 27.3 },
  { position: [76.2, 9.62], celsius: 28.1 },
  { position: [75.55, 9.55], celsius: 27.1 },
  { position: [75.8, 9.42], celsius: 27.6 },
  { position: [76.05, 9.32], celsius: 28.5 },
];

export function tempColor(celsius: number): string {
  if (celsius < 27.4) return "#5B8FB9";
  if (celsius < 27.9) return "#4F9FA8";
  if (celsius < 28.3) return "#B89465";
  return "#A4665C";
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
  if (heightM < 1) return "#338E7F";
  if (heightM < 1.5) return "#5AA79A";
  if (heightM < 2) return "#B89465";
  return "#A4665C";
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
