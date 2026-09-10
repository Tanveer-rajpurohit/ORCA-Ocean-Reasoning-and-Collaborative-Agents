export type Coordinate = [number, number];

export type MapDataMode = "waves" | "wind" | "temperature" | "zones";

export type MapViewMode = "2d" | "3d";

export type BasemapStyle = "chart" | "satellite" | "dark";

export interface MapModeOption {
  id: MapDataMode;
  label: string;
  question: string;
}

export interface LegendEntry {
  color: string;
  label: string;
  value: string;
}
