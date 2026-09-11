import type { ReportSubmission } from "../types/report/types";

const LOCATIONS = [
  { lat: 9.88, lng: 76.05, label: "Kochi North Coast" },
  { lat: 9.92, lng: 75.95, label: "Vypin Offshore" },
  { lat: 9.75, lng: 76.12, label: "South Kochi" },
  { lat: 10.02, lng: 76.24, label: "Munambam Harbour" },
  { lat: 9.6, lng: 76.28, label: "Alappuzha Coast" },
  { lat: 9.35, lng: 76.2, label: "Chethi Sea" },
  { lat: 10.18, lng: 76.08, label: "Cherai Beach" },
  { lat: 9.05, lng: 76.5, label: "Kollam Deep Sea" },
  { lat: 8.9, lng: 76.6, label: "Neendakara" },
  { lat: 9.5, lng: 75.8, label: "Arabian Deep Water" },
];

const SEA_STATES = [
  "Calm, 0.4m",
  "Calm, 0.6m",
  "Slight, 0.8m",
  "Slight, 1.1m",
  "Moderate, 1.4m",
  "Moderate, 1.6m",
  "Rough, 2.0m",
];

const WINDS = [
  "W 5 knots",
  "SW 10 knots",
  "SW 14 knots",
  "SW 18 knots",
  "NW 22 knots",
  "NW 26 knots",
];

const REPORTERS = [
  "Ravi M.",
  "Sunil K.",
  "Anand P.",
  "Vijayan T.",
  "Joseph S.",
  "Mohan D.",
  "Sasi N.",
  "Baiju R.",
  "Rajesh V.",
  "Lal K.",
];

const NOTES = [
  "Water much rougher than the forecast said. Heading back early.",
  "Saw a large debris field, mostly logs. Careful if you go past 5km.",
  "Good catch near the channel markers this morning.",
  "Current is stronger than usual, watch your fuel.",
  "Squall passed through quickly around noon, all clear now.",
  "Fishing boats clustering near the south side, fish must be there.",
  "Visibility dropped to under 200m in the rain.",
  undefined,
  undefined,
  undefined,
];

function buildMockReports(): ReportSubmission[] {
  return Array.from({ length: 40 }, (_, i) => {
    const loc = LOCATIONS[i % LOCATIONS.length];
    if (!loc) throw new Error("location missing");
    return {
      id: `rep-${i + 1}`,
      title: `Sea report from ${loc.label}`,
      reporter: REPORTERS[i % REPORTERS.length] ?? "Anonymous",
      seaState: SEA_STATES[i % SEA_STATES.length] ?? "Slight, 0.8m",
      wind: WINDS[i % WINDS.length] ?? "SW 10 knots",
      notes: NOTES[i % NOTES.length],
      location: loc,
      attachments:
        i % 4 === 0
          ? [{ type: "photo" as const, url: "#" }]
          : i % 7 === 0
            ? [{ type: "voice" as const, url: "#" }]
            : [],
      timestamp: i < 15 ? `11 Sep, ${14 - Math.floor(i / 2)}:${i % 2 ? "30" : "00"} AM` : `10 Sep, 0${(i % 8) + 1}:00 PM`,
    };
  });
}

export const MOCK_REPORTS: ReportSubmission[] = buildMockReports();

export const PAGE_SIZE = 10;
