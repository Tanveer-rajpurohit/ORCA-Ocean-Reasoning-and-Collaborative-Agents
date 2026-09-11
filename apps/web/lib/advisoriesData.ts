import type { Advisory } from "../types/advisories/types";

const PFZ_TITLES = [
  "High probability zone southwest of Kochi",
  "Potential fishing zone west of Vypin",
  "Fish aggregation off Munambam harbour",
  "Strong chlorophyll front near Alappuzha",
  "Thermal gradient zone off Cherai",
  "Productive waters beyond 40km west",
  "Bait fish concentration near Kollam",
  "Tuna corridor in deep Arabian water",
];

const OSF_TITLES = [
  "Moderate sea state in central Arabian Sea",
  "Calm nearshore waters along Kochi coast",
  "Building swell expected after 15:00",
  "Southwest winds steady at 12 to 15 knots",
  "Sea temperature near seasonal normal",
  "Squall risk in the late evening",
  "Currents slack near the harbour mouth",
  "Wave heights settling by morning",
];

const PFZ_NOTES = [
  "Satellite imagery shows strong chlorophyll concentration and a sharp sea surface temperature front. Best window is 6 AM to 2 PM.",
  "Moderate fish aggregation detected. Recommended for mechanized boats; the zone holds until early afternoon.",
  "Plankton bloom visible from Oceansat imagery. Oilfish and tuna reported in this sector over the last three days.",
  "Front is weakening but still worth a run. Diesel cost is offset by the shorter search time.",
  "Zone shifted 6km north since yesterday's advisory. Updated coordinates from this morning's pass.",
  "Deep water zone for larger vessels only. Small craft should not attempt the crossing in afternoon winds.",
];

const OSF_NOTES = [
  "Wave heights between 1.2 and 1.8 metres through the day. Winds steady from the southwest.",
  "Nearshore conditions stable, waves below 0.8 metres. Safe for small craft operations.",
  "Swell builds after 15:00 with the sea breeze. Plan the return leg before the afternoon turn.",
  "Winds are below warning level but gusts can reach 20 knots in squall lines. Keep watch on the horizon.",
  "Sea surface temperature is close to the seasonal mean. No anomaly flagged for this sector.",
  "Thunderstorm activity possible after sunset. INCOIS recommends staying within 10km of shore.",
];

const LOCATIONS = [
  "9.9°N to 10.4°N, 75.6°E to 75.9°E",
  "Kochi port region",
  "10.0°N to 10.5°N, 75.8°E to 76.1°E",
  "Kochi coast",
  "9.6°N to 9.9°N, 76.1°E to 76.4°E",
  "Alappuzha offshore sector",
  "9.3°N to 9.6°N, 75.9°E to 76.3°E",
  "Arabian Sea, beyond 40km",
];

function buildMockAdvisories(): Advisory[] {
  return Array.from({ length: 22 }, (_, i) => {
    const isPfz = i % 2 === 0;
    const titles = isPfz ? PFZ_TITLES : OSF_TITLES;
    const notes = isPfz ? PFZ_NOTES : OSF_NOTES;
    const title = titles[Math.floor(i / 2) % titles.length];
    const description = notes[i % notes.length];
    if (!title || !description) throw new Error("advisory content missing");
    const severity: Advisory["severity"] =
      i % 5 === 0 ? "high" : i % 3 === 0 ? "medium" : "low";
    const day = i < 8 ? "11 Sep 2026" : i < 16 ? "10 Sep 2026" : "09 Sep 2026";
    return {
      id: `adv-${i + 1}`,
      type: isPfz ? "PFZ" : "OSF",
      title,
      description,
      location: LOCATIONS[i % LOCATIONS.length] ?? "Kochi coast",
      date: day,
      citation: isPfz
        ? "INCOIS PFZ Advisory"
        : "INCOIS Ocean State Forecast",
      severity,
    };
  });
}

export const MOCK_ADVISORIES: Advisory[] = buildMockAdvisories();

export const ADVISORY_PAGE_SIZE = 10;
