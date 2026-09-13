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
  "Water conditions were considerably rougher than the morning advisory indicated, with swell picking up rapidly from the southwest after 08:00 AM. Wave crests regularly reached 1.8m with strong cross-chop developing across the main navigation fairway, making stability challenging for smaller vessels. Several skiffs from our local fleet decided to cut their operations short and returned to port by 10:00 AM. Recommend smaller craft stay within the 5 km coastal sector until late afternoon when sea surface winds are forecast to ease.",
  "Heavy floating debris was sighted roughly 5 km offshore directly along the shipping channel approach. We encountered multiple large timber logs and knotted synthetic fishing nets drifting just below the surface, posing serious danger to steering gear and propellers. Maintain a sharp visual lookout when navigating through this sector. Exact coordinates have been relayed to the coastal patrol on channel 16 for safety clearance.",
  "After two hours working along the outer reef edge, our fish hold was already more than half full. A dense sardine shoal was settled right along the 15-fathom contour in clear turquoise water, with surface currents moving gently from the west to create optimal drift conditions for encircling gear. Surface activity only began tapering off once noon sunlight increased upper layer water temperatures.",
  "Strong subsurface current was running hard against the outgoing ebb tide throughout the entire sector today. Vessel fuel consumption was nearly thirty percent higher than normal when working back toward the west, requiring extra engine throttle against the outflow. Make sure all vessels carry reserve diesel before venturing past the outer navigation markers, as anchoring was also unreliable on the drifting sandy bottom.",
  "A sudden squall front rolled in from the northwest around 09:00 AM, bringing intense rain squalls and gusts peaking close to 26 knots before conditions stabilized thirty-five minutes later. Once the squall cleared completely, surface clarity recovered quickly and baitfish schools surfaced again. We landed a substantial mackerel catch once the westerly breeze settled down to manageable levels.",
  "Eight mechanised craft were working the same concentrated sector roughly 6 km west of the port entrance. A dense pelagic concentration has settled along the thermal front between shelf layers, providing steady catches throughout the morning. Active radio communication between skippers ensured adequate safety margins during hauling operations. Expect high fleet traffic in this sector during the early morning tide.",
  "Heavy tropical downpours reduced horizontal visibility to below 200 metres for forty minutes during mid-morning transit. We sounded automated fog signals and kept navigation masthead lights illuminated continuously throughout the squall. Surrounding vessels were clearly trackable on radar but invisible to the naked eye until within 150 metres. Recommend waiting for rain squalls to pass before attempting channel entry.",
  "Deep ocean swell shifted around noon from south to west, creating steep beam seas on the crossing back to harbour. The harbour mouth sandbar was especially rough at mid-tide with breaking waves across the channel fairway. Lighter vessels had to throttle back significantly to avoid taking green water over the bow, making high water slack tide the optimal window for inbound transits.",
  "Flat calm surface along the 20-fathom contour all morning, exceptionally calm and stable for this time of year. Water clarity was superb with visible depths exceeding eight metres in open sea, allowing smaller fiberglass craft to operate comfortably up to 14 km offshore. Slight haze remained on the horizon, but wind remained negligible under four knots throughout our shift.",
  "Superb mackerel run recorded across the northern sector starting right at first light. Every line dropped produced steady strikes within the first ninety minutes of deployment, matching the satellite advisory thermal coordinates with high accuracy. Returned to the jetty early with holds fully iced and preserved in prime condition.",
  "Dense jellyfish concentration drifting along the inshore belt from the river mouth to 3 km out along the coastline. Mesh nets required clearing every twenty minutes to prevent gear tear and excessive boat drag. Clear, unencumbered water was found once pushing past the 6 km offshore boundary line, so working deeper waters is strongly advised until this drift passes.",
  "Fuel line obstruction occurred roughly 4 km out due to sediment buildup in our auxiliary tank. A neighbouring vessel from Munambam offered an immediate tow line and stood by until our crew was safely secured. All four crew members and gear remained safe throughout the recovery procedure. Boat operators are reminded to check fuel water separators prior to dawn departures.",
  "Sea surface temperature feels markedly warmer than last week along the inner shelf corridor. A distinct convergence line was clearly visible about 8 km out where water colour shifts from greenish coastal runoff to clear ocean blue. Large schools of baitfish were concentrated tightly along this temperature boundary, indicating high potential for pelagic catches over the coming days.",
  "Spotted a large pod of dolphins actively driving baitfish toward the shallower sandbanks this morning. Tuna and carangids were breaking the surface directly behind the main concentration, with diving terns providing clear visual guidance to the richest zones across several nautical miles. Worth exploring this exact sector tomorrow if westerly winds remain gentle.",
  "Submerged synthetic rope and abandoned netting caught our starboard trawl footrope roughly 8 km out. It took nearly thirty minutes of careful deck maneuvering to cut away without hull contact or engine fouling. The net required minor dockside stitching, but all main gear was preserved without permanent damage. Skippers should exercise vigilance regarding unmarked lost tackle in this area.",
  "Continuous flocks of sea birds were diving over a single thermal eddy near the advisory boundary line. Our vessel positioned into the drift and completed the morning catch quota in under two hours. Coordination over local fleet radio kept everyone aware of the moving school perimeter, with smooth 1-metre rolling swell from the southwest making handling straightforward.",
  "An unlit steel navigation buoy was observed drifting adrift roughly 7 km offshore in active fishing waters. The buoy poses a serious collision risk for night operations and low-profile fishing skiffs navigating without radar. Relayed exact GPS coordinates to the coastal guard and harbour traffic authorities, and extreme caution is advised when crossing this sector after sunset.",
  "Bar mouth crossing was treacherous during mid-ebb tide with steep three-foot standing waves forming over the sand bar. We waited forty minutes in the sheltered lee until water levels rose sufficiently for crossing safely. Several overloaded craft experienced propeller cavitation while fighting the outflow, so always verify tidal tables before scheduling return journeys.",
  "Distinct oceanic shelf edge starts around 12 km out where depths drop sharply into deep blue Arabian Sea water. A clear thermal break was observed with surface temperature jumping nearly 1.8 degrees along the boundary line. Prime conditions for pelagic drift netting with minimal coastal turbidity, and sea state remained consistent with low-frequency swell all day.",
  "Wind velocity surged abruptly from near calm to over 24 knots in less than fifteen minutes around midday. The morning forecast did not anticipate this sudden squall line advancing from the west, prompting the entire local fleet to initiate immediate precautionary returns toward protected waters. All vessels docked safely without loss of catch or structural damage.",
];

const ROUGHNESS_CYCLE: Array<"calm" | "slight" | "choppy" | "rough" | "very_rough"> = [
  "slight", "choppy", "calm", "rough", "slight", "choppy", "very_rough", "calm", "rough", "slight",
  "calm", "choppy", "slight", "rough", "calm", "choppy", "slight", "calm", "rough", "slight",
];

const WIND_CYCLE: Array<"none" | "light" | "strong" | "storm"> = [
  "light", "strong", "none", "light", "strong", "storm", "light", "none", "strong", "light",
  "none", "light", "strong", "light", "none", "strong", "light", "none", "storm", "light",
];

const OBSERVATION_SETS: Array<Array<"good_catch" | "no_fish" | "jellyfish" | "debris" | "dolphins" | "current" | "squall" | "fog">> = [
  ["good_catch"],
  ["no_fish", "current"],
  ["jellyfish", "debris"],
  ["good_catch", "dolphins"],
  ["squall", "fog"],
  ["current"],
  ["good_catch"],
  ["debris"],
  ["dolphins", "good_catch"],
  ["fog"],
  ["no_fish"],
  ["squall"],
  ["good_catch", "current"],
  ["jellyfish"],
  ["good_catch", "dolphins"],
  ["debris", "current"],
  ["no_fish", "fog"],
  ["good_catch"],
  ["squall", "current"],
  ["dolphins"],
];

const FORECAST_CYCLE: Array<"accurate" | "worse" | "calmer"> = [
  "worse", "accurate", "calmer", "accurate", "worse", "accurate", "accurate", "calmer", "worse", "accurate",
  "accurate", "worse", "calmer", "accurate", "accurate", "worse", "accurate", "calmer", "accurate", "worse",
];

function buildMockReports(): ReportSubmission[] {
  return Array.from({ length: 20 }, (_, i) => {
    const loc = LOCATIONS[i % LOCATIONS.length];
    if (!loc) throw new Error("location missing");
    return {
      id: `rep-${i + 1}`,
      title: TITLES[i % TITLES.length] ?? `Sea report from ${loc.label}`,
      reporter: REPORTERS[i % REPORTERS.length] ?? "Anonymous",
      seaState: SEA_STATES[i % SEA_STATES.length] ?? "Slight, 0.8m",
      wind: WINDS[i % WINDS.length] ?? "SW 10 knots",
      roughness: ROUGHNESS_CYCLE[i],
      windStrength: WIND_CYCLE[i],
      observations: OBSERVATION_SETS[i],
      forecastMatch: FORECAST_CYCLE[i],
      notes: NOTES[i % NOTES.length],
      location: loc,
      attachments:
        i % 3 === 0
          ? [{ type: "photo" as const, url: "#" }, { type: "voice" as const, url: "#" }]
          : i % 2 === 0
            ? [{ type: "photo" as const, url: "#" }]
            : [{ type: "voice" as const, url: "#" }],
      timestamp: i < 10 ? `11 Sep, ${(i % 6) + 5}:${i % 2 ? "30" : "00"} AM` : `10 Sep, ${(i % 8) + 1}:00 PM`,
    };
  });
}

export const MOCK_REPORTS: ReportSubmission[] = buildMockReports();

export const PAGE_SIZE = 10;
