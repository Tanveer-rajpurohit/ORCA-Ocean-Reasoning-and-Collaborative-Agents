# ORCA Advisories Feature Explainer

Reference document for the Advisories page (`/advisories`) and its role in the pitch. Written for the team — use it for the PPT, the demo video script, and judge Q&A.

## The Data Behind It

Two INCOIS broadcasts, published daily, for free:

1. **PFZ Advisory (Potential Fishing Zone)**: Fish do not spread evenly across the sea. They aggregate at thermal fronts — places where water masses of different temperatures meet. The mixing stirs up nutrients and plankton, which pulls in bait fish, which pulls in the catch. Satellites (Oceansat, NOAA AVHRR) see these fronts from space as temperature and chlorophyll gradients. Every day INCOIS converts that satellite data into zone coordinates per coastal sector. A real advisory reads like: "bearing 247 degrees, 38 km off Kochi, zone valid today 6 AM to 6 PM."

2. **Ocean State Forecast (OSF)**: Wave height, swell period, wind, and tides for each sector over the next few days. This is the "should my boat even go out" data.

## What the ORCA Page Does With It

The raw advisory today is a WebGIS map or an English text bulletin. ORCA transforms it into:

```text
Satellite pass → INCOIS PFZ model → English bulletin / WebGIS map   (today's "product")
                              │
                              ▼  ORCA
        "Today's zone for Kochi: 247°, 38 km out. Waves 1.2 m,
         fine for your mechanized boat. Zone strongest till 2 PM."
         — in Tamil/Malayalam, on the map, with the source cited
```

* **Localized**: The home port set in the fisher profile selects the sector's advisory.
* **In the fisher's language**: Not English. Twelve coastal languages plus auto-detect.
* **Explained, not just broadcast**: What the zone means, when it is valid, and what the wave height means for that vessel type.
* **Visualized**: The zone polygon drawn on the Sea Map page.
* **Cited**: Which INCOIS advisory node and what date — the grounding requirement from the problem statement.

## Why It Makes Impact

The strongest economic argument in the pitch (SIH presentation, slide 5):

> A 2002 study (Nayak et al.) found that PFZ advisories saved ₹545 crore a year nationally at just 10% adoption, rising to ₹1,635 crore at 25% adoption.

The savings come from diesel. A fishing boat's biggest operating cost is fuel, and the traditional model is searching: motoring around prospecting, burning diesel, hoping to find fish — often 6 to 10 hours of hunting per trip. A PFZ advisory tells the boat where to go before it leaves shore, cutting search time dramatically. Straighter trips, less fuel, same catch. A few hundred litres saved per boat per month, across hundreds of thousands of boats, becomes crores.

## The Catch — and Why ORCA Is the Answer

The impact story is not "we built a better forecast." The forecast already exists and is proven. The impact is last-mile delivery:

| Barrier today | What the Advisories page does |
|---|---|
| English/Hindi text bulletin | 12 languages plus auto-detect |
| Static WebGIS map the user must find and interpret | Pushed to the user, drawn on the map, one tap away |
| Raw coordinates and jargon | Explained in plain speech: direction, distance, what it means for this boat |
| Separate from weather | Fused with OSF wave data — a zone is useless if the route to it is rough |

## One Line for Judges

The government already produces a proven, free, crores-saving service every day. ORCA is the layer that finally puts it in the fisherman's pocket, in his language, with a voice.

## Where It Sits in the Product

The Chat page answers "where should I fish today?" conversationally. The Advisories page is the same intelligence as a daily feed — checkable in three seconds without typing anything. Both pull from the same INCOIS PFZ and OSF sources; the chat is the asking interface, the advisories feed is the browsing interface.
