import type { AgentStep, Citation, MarineChartData } from "../types";

export interface MockResponse {
  content: string;
  steps: AgentStep[];
  chart?: MarineChartData;
  citations: Citation[];
  thoughtSummary: string;
  detailedThought: string;
}

const IMD_URL = "https://api.imd.gov.in";
const INCOIS_OSF_URL = "https://incois.gov.in/site/services/osf.jsp";
const INCOIS_PFZ_URL = "https://incois.gov.in/MarineFisheries/TextDataHome";
const MOSDAC_URL = "https://mosdac.gov.in";

const IMD_BULLETIN = "IMD Coastal Bulletin 14";
const OSF_NODE = "INCOIS OSF Kochi Node 24";
const PFZ_NODE = "INCOIS PFZ Advisory Node 24";
const MOSDAC_SST = "MOSDAC SST Composite";

const SAFE_RESPONSE: MockResponse = {
  thoughtSummary: "Checked IMD bulletin, INCOIS forecast, and your sector boundary",
  detailedThought:
    "Decomposed the question into three checks: active warnings for the Kochi sector, the ocean state forecast for the next 12 hours, and whether the planned route crosses a restricted boundary. All three sources answered.",
  steps: [
    {
      id: "s1",
      label: "Reading IMD coastal bulletin",
      detail: "No cyclone or squall warning active for your sector",
      status: "completed",
    },
    {
      id: "s2",
      label: "Fetching INCOIS ocean state forecast",
      detail: "Wave 0.9 to 1.4 m, swell period 7 s",
      status: "completed",
    },
    {
      id: "s3",
      label: "Checking route against maritime boundaries",
      detail: "Planned course stays inside Indian waters",
      status: "completed",
    },
    {
      id: "s4",
      label: "Computing risk verdict",
      detail: "Safe for a mechanized boat. Return by 14:00.",
      status: "completed",
    },
  ],
  citations: [
    {
      source: "IMD",
      reference: IMD_BULLETIN,
      url: IMD_URL,
      issued: "10 Sep 2026, 05:30 IST",
    },
    {
      source: "INCOIS",
      reference: OSF_NODE,
      url: INCOIS_OSF_URL,
      issued: "10 Sep 2026, 06:00 IST",
    },
  ],
  chart: {
    title: "Wave height through the day",
    unit: "metres",
    variant: "line",
    issued: "10 Sep, 06:00 IST",
    threshold: 2,
    thresholdLabel: "Your boat's limit",
    points: [
      { label: "06:00", value: 0.9 },
      { label: "09:00", value: 1.1 },
      { label: "12:00", value: 1.4 },
      { label: "15:00", value: 1.8 },
      { label: "18:00", value: 2.1 },
    ],
  },
  content: `## Verdict: **Safe to go out**

Conditions suit your mechanized boat today, but the window closes in the afternoon.

**What the sea is doing**
- Wave height holds between 0.9 and 1.4 m through the morning
- Wind 12 km/h from the north-west, well under warning level
- No cyclone, squall, or lightning advisory active for the Kochi sector

**When to come back**
Waves build after 15:00 and reach 2.1 m by evening, which is past what your boat handles comfortably. Plan the return by 14:00 to stay in calm water.

**One thing to watch**
The forecast refreshes at 06:00 and 12:00. If the afternoon reading shifts, you get an alert on this device before the sea changes.`,
};

const ZONE_RESPONSE: MockResponse = {
  thoughtSummary: "Located today's fishing zone and measured the run from Kochi",
  detailedThought:
    "Pulled the current PFZ advisory for the Kerala south sector, converted the thermal front coordinates into a bearing and distance from your harbour, then overlaid the route against today's wave field to check the run is comfortable.",
  steps: [
    {
      id: "s1",
      label: "Fetching INCOIS PFZ advisory",
      detail: "Zone published for Kerala south, valid today",
      status: "completed",
    },
    {
      id: "s2",
      label: "Converting thermal front to bearing",
      detail: "247 degrees, 38 km from Kochi harbour",
      status: "completed",
    },
    {
      id: "s3",
      label: "Overlaying route on wave field",
      detail: "Route stays in 0.8 to 1.3 m water",
      status: "completed",
    },
  ],
  citations: [
    {
      source: "INCOIS",
      reference: PFZ_NODE,
      url: INCOIS_PFZ_URL,
      issued: "10 Sep 2026, 06:00 IST",
    },
    {
      source: "INCOIS",
      reference: OSF_NODE,
      url: INCOIS_OSF_URL,
      issued: "10 Sep 2026, 06:00 IST",
    },
  ],
  chart: {
    title: "Catch likelihood by depth band",
    unit: "%",
    variant: "bar",
    issued: "10 Sep, 06:00 IST",
    points: [
      { label: "20-30 m", value: 42 },
      { label: "30-40 m", value: 78 },
      { label: "40-50 m", value: 65 },
      { label: "50+ m", value: 31 },
    ],
  },
  content: `## Today's zone: **bearing 247°, 38 km from Kochi**

The potential fishing zone sits south-west of the harbour, along a thermal front where two water masses meet.

**Why that spot**
Satellite thermal imaging shows a temperature break in this band. That edge lifts nutrients, which draws plankton, then bait fish, then your target catch.

**The run**
- 38 km, roughly 1 hour 40 minutes at your cruise
- Waves on the route stay 0.8 to 1.3 m, comfortable
- The zone holds together best between 06:00 and 14:00

**On fuel**
Heading straight to the zone instead of prospecting cuts about 60 km from the trip, which is the saving that makes advisories worth checking.`,
};

const WAVE_RESPONSE: MockResponse = {
  thoughtSummary: "Pulled the three-day ocean state forecast for your sector",
  detailedThought:
    "Read the ocean state forecast for the Kochi node, extracted the wave and swell series, then compared each window against your vessel's safe operating limit.",
  steps: [
    {
      id: "s1",
      label: "Reading INCOIS ocean state forecast",
      detail: "Three-day wave and swell series retrieved",
      status: "completed",
    },
    {
      id: "s2",
      label: "Comparing against vessel limits",
      detail: "Mechanized boat, safe under 2 m wave height",
      status: "completed",
    },
    {
      id: "s3",
      label: "Flagging unsafe windows",
      detail: "Third day exceeds your safe limit",
      status: "completed",
    },
  ],
  citations: [
    {
      source: "INCOIS",
      reference: OSF_NODE,
      url: INCOIS_OSF_URL,
      issued: "10 Sep 2026, 06:00 IST",
    },
  ],
  chart: {
    title: "Wave height, next 3 days",
    unit: "metres",
    variant: "line",
    issued: "10 Sep, 06:00 IST",
    threshold: 2,
    thresholdLabel: "Your boat's limit",
    points: [
      { label: "Today", value: 1.2 },
      { label: "Tomorrow", value: 1.6 },
      { label: "Day 3", value: 2.6 },
      { label: "Day 4", value: 1.5 },
    ],
  },
  content: `## Two workable days, then it turns

The sea stays inside your limit for two days, then crosses it.

**Day by day**
- **Today**: 1.2 m, comfortable
- **Tomorrow**: 1.6 m, still workable but choppy by afternoon
- **Day 3**: 2.6 m, above what your boat handles. Treat it as a shore day.

**Why height is not the whole story**
Swell period runs 7 to 9 seconds. Long-period swell carries more energy than the height suggests, so the day 3 reading deserves the extra caution.`,
};

const TEMPERATURE_RESPONSE: MockResponse = {
  thoughtSummary: "Read satellite sea surface temperature for your fishing grounds",
  detailedThought:
    "Pulled the sea surface temperature composite from MOSDAC and compared it against the seasonal norm to identify where the thermal breaks sit.",
  steps: [
    {
      id: "s1",
      label: "Reading MOSDAC sea surface temperature",
      detail: "Satellite composite retrieved for the Kerala coast",
      status: "completed",
    },
    {
      id: "s2",
      label: "Comparing against seasonal norm",
      detail: "Coastal band running 0.8 C above normal",
      status: "completed",
    },
    {
      id: "s3",
      label: "Locating thermal breaks",
      detail: "Two fronts identified south-west of the harbour",
      status: "completed",
    },
  ],
  citations: [
    {
      source: "MOSDAC",
      reference: MOSDAC_SST,
      url: MOSDAC_URL,
      issued: "10 Sep 2026, 05:00 IST",
    },
  ],
  chart: {
    title: "Sea surface temperature by distance",
    unit: "°C",
    variant: "line",
    issued: "10 Sep, 05:00 IST",
    points: [
      { label: "Coast", value: 28.4 },
      { label: "10 km", value: 28.1 },
      { label: "25 km", value: 27.6 },
      { label: "40 km", value: 28.3 },
      { label: "55 km", value: 28.9 },
    ],
  },
  content: `## Sea temperature is running warm

The coastal band reads 0.8 °C above the seasonal norm for this time of year.

**What that means for fishing**
- Warm surface water holds less dissolved oxygen, so fish push slightly deeper
- The temperature dip at 25 km marks a front. Fronts concentrate bait fish, which is why the zone advisory keeps pointing there

**The shape of the curve**
Temperature falls to 27.6 °C at 25 km, then climbs back to 28.9 °C further out. That V is a thermal break, and it is the most productive part of this transect.`,
};

const HAZARD_RESPONSE: MockResponse = {
  thoughtSummary: "Scanned IMD warnings and lightning data around your position",
  detailedThought:
    "Queried the cyclone track feed, the squall warning list, and lightning strike density for the Kochi coastal band, then ranked each hazard by distance from your position.",
  steps: [
    {
      id: "s1",
      label: "Checking IMD cyclone track feed",
      detail: "Depression tracked 420 km south-east",
      status: "completed",
    },
    {
      id: "s2",
      label: "Scanning squall wind warnings",
      detail: "Squall line active 90 km north of your sector",
      status: "completed",
    },
    {
      id: "s3",
      label: "Reading lightning strike density",
      detail: "Low activity inside 50 km",
      status: "completed",
    },
  ],
  citations: [
    {
      source: "IMD",
      reference: "IMD Cyclone Bulletin 04",
      url: IMD_URL,
      issued: "10 Sep 2026, 08:00 IST",
    },
    {
      source: "IMD",
      reference: IMD_BULLETIN,
      url: IMD_URL,
      issued: "10 Sep 2026, 05:30 IST",
    },
  ],
  chart: {
    title: "Hazard distance from your position",
    unit: "km",
    variant: "bar",
    issued: "10 Sep, 08:00 IST",
    threshold: 50,
    thresholdLabel: "Watch radius",
    points: [
      { label: "Cyclone", value: 420 },
      { label: "Squall", value: 90 },
      { label: "Lightning", value: 47 },
      { label: "Swell", value: 0 },
    ],
  },
  content: `## No active hazard for your position

Three systems are being tracked near the Kerala coast. None currently threatens the Kochi sector.

**What is out there**
- **Depression** 420 km south-east, track curving away from the coast
- **Squall line** 90 km north of you, holding position, outside your sector
- **Lightning** light activity inside 50 km, normal for the season

**What would change this**
If the depression curves north, the warning list updates within the hour and you get an alert before the sea reacts.

**Standing advice**
The squall is the one to keep half an eye on. It is far, but squall lines move fast.`,
};

const GENERAL_RESPONSE: MockResponse = {
  thoughtSummary: "Routed across the weather, ocean, and geospatial agents",
  detailedThought:
    "Parsed the question for location, time, and intent, dispatched the relevant sub-agents in parallel, and merged their findings into a single answer with sources attached.",
  steps: [
    {
      id: "s1",
      label: "Understanding your question",
      detail: "Extracted location, timing, and intent",
      status: "completed",
    },
    {
      id: "s2",
      label: "Querying weather and ocean agents",
      detail: "IMD bulletins and INCOIS forecast in parallel",
      status: "completed",
    },
    {
      id: "s3",
      label: "Merging findings into one answer",
      detail: "Every claim carries its source",
      status: "completed",
    },
  ],
  citations: [
    {
      source: "IMD",
      reference: IMD_BULLETIN,
      url: IMD_URL,
      issued: "10 Sep 2026, 05:30 IST",
    },
    {
      source: "INCOIS",
      reference: OSF_NODE,
      url: INCOIS_OSF_URL,
      issued: "10 Sep 2026, 06:00 IST",
    },
  ],
  chart: {
    title: "Wind speed through the day",
    unit: "km/h",
    variant: "bar",
    issued: "10 Sep, 06:00 IST",
    points: [
      { label: "06:00", value: 9 },
      { label: "09:00", value: 12 },
      { label: "12:00", value: 16 },
      { label: "15:00", value: 21 },
      { label: "18:00", value: 14 },
    ],
  },
  content: `## Here is what I found

I split your question across the weather, ocean, and navigation agents and pulled their answers together.

**Current picture for the Kochi sector**
- Wind 9 to 16 km/h through the morning, easing again in the evening
- Waves 0.9 to 1.4 m, building through the afternoon
- No cyclone, squall, or boundary warning active

**What I would do**
Head out early, work the morning window, and plan to be back by 14:00 when the swell picks up.

**Ask me next**
Try "what about further north" or "what if I leave at noon" and I will keep your port and vessel in mind.`,
};

interface IntentRule {
  keywords: string[];
  response: MockResponse;
}

const INTENT_RULES: IntentRule[] = [
  {
    keywords: ["safe", "should i go", "go out", "tomorrow", "worth going"],
    response: SAFE_RESPONSE,
  },
  {
    keywords: ["temperature", "sst", "warm", "thermal", "satellite"],
    response: TEMPERATURE_RESPONSE,
  },
  {
    keywords: ["fish", "zone", "pfz", "where", "catch", "catching", "spot"],
    response: ZONE_RESPONSE,
  },
  {
    keywords: ["wave", "swell", "rough", "sea state", "height"],
    response: WAVE_RESPONSE,
  },
  {
    keywords: ["cyclone", "storm", "hazard", "warning", "lightning", "squall"],
    response: HAZARD_RESPONSE,
  },
];

export function pickMockResponse(prompt: string): MockResponse {
  const lower = prompt.toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.response;
    }
  }
  return GENERAL_RESPONSE;
}
