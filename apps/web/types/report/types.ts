export interface ReportSubmission {
  id: string;
  title: string;
  reporter: string;
  seaState: string;
  wind: string;
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
