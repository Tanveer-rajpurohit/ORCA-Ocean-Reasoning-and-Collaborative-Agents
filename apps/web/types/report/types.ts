export type SeaRoughness = "calm" | "slight" | "choppy" | "rough" | "very_rough";
export type WindStrength = "none" | "light" | "strong" | "storm";
export type Observation = "good_catch" | "no_fish" | "jellyfish" | "debris" | "dolphins" | "current" | "squall" | "fog";
export type ForecastAccuracy = "accurate" | "worse" | "calmer";

export interface ReportSubmission {
  id: string;
  title: string;
  reporter: string;
  seaState: string;
  wind: string;
  roughness?: SeaRoughness;
  windStrength?: WindStrength;
  observations?: Observation[];
  forecastMatch?: ForecastAccuracy;
  notes?: string;
  location: {
    lat: number;
    lng: number;
    label: string;
  };
  attachments: Array<{
    type: "photo" | "voice";
    url: string;
  }>;
  timestamp: string;
}
