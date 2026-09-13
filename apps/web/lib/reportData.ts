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

const TITLES = [
  "Rougher than forecast past 5 km",
  "Debris field near the channel markers",
  "Good catch by the south markers",
  "Strong current, watch your fuel",
  "Squall passed at noon, all clear",
  "Boats clustering on the south side",
  "Visibility under 200 m in rain",
  "Swell building from the west",
  "Calm stretch along the 20-fathom line",
  "Nets heavy with mackerel at dawn",
  "Jellyfish bloom along the shore",
  "Engine trouble, towed back by Neendakara",
  "Water warmer than last week",
  "Dolphins working bait south of Vypin",
  "Net torn on submerged rope",
  "Birds diving 8 km out, fish below",
  "Unmarked buoy drifting off Cherai",
  "Choppy crossing at the bar mouth",
  "Clean water line at 12 km",
  "Early return, wind picked up fast",
];

const NOTES = [
  "Water much rougher than the forecast said. Heading back early.",
  "Mostly logs floating past 5 km. Careful with your propeller.",
  "Two hours by the markers and the hold was already half full.",
  "Current running against the ebb. Took extra fuel to get back.",
  "Ten minutes of hard rain and wind, then it cleared completely.",
  "Eight boats working the same patch. Fish must be holding there.",
  "Rain cut visibility hard. Kept the horn going the whole way in.",
  "Swell turning from the west around noon. Earlier is better.",
  "Flat water on the 20-fathom line all morning. Rare for this month.",
  "Best mackerel run this season. Back by nine with a full hold.",
  "Thick jellyfish from the harbour mouth to about 3 km out.",
  "Fuel line choked mid-trip. Another boat towed us in, all safe.",
  "Water feels two degrees warmer than last week near the shore.",
  "A big pod pushing bait fish. Tuna likely close behind them.",
  "Caught something heavy and synthetic. Net needs a patch.",
  "Terns diving in one spot for an hour. Stopped and filled the box.",
  "White buoy with no light, drifting fast. Reported to the harbour.",
  "Bar mouth was choppy at half tide. Waited forty minutes to cross.",
  "Clear blue water starts sharp at 12 km. Good line to work.",
  "Wind jumped from calm to blustery in fifteen minutes. Turned back.",
];

function buildMockReports(): ReportSubmission[] {
  return Array.from({ length: 40 }, (_, i) => {
    const loc = LOCATIONS[i % LOCATIONS.length];
    if (!loc) throw new Error("location missing");
    return {
      id: `rep-${i + 1}`,
      title: TITLES[i % TITLES.length] ?? `Sea report from ${loc.label}`,
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
