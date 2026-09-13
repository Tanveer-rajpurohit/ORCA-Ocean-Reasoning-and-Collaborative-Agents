export type HazardLevel = 'danger' | 'warning' | 'info';

export interface Hazard {
  id: string;
  title: string;
  description: string;
  level: HazardLevel;
  distance: number;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  action: string;
  source: string;
  affectedArea: string;
  validUntil: string;
}
