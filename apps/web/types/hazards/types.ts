export type HazardLevel = 'warning' | 'danger';

export interface Hazard {
  id: string;
  title: string;
  description: string;
  level: HazardLevel;
  distance: number; // Distance in kilometers from current location
  timestamp: string;
  coordinates: { lat: number; lng: number };
}
