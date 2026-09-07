# ORCA Extra Features and High-Value Extensions

This document outlines high-impact extension features for ORCA (Ocean Reasoning and Collaborative Agents). These features bridge satellite models with ground-level marine reality and critical emergency workflows.

## 1. Search and Rescue (SAR) Drift Prediction

### Simple Explanation

**What it does**: When a fishing boat does not return on time, this feature predicts where the vessel has drifted based on real-time ocean currents, wind vectors, and wave patterns.

**Think of it like this**: Imagine you drop a leaf into a flowing river. The river current pushes the leaf in a specific direction. If you know water velocity and wind direction, you can calculate where the leaf will end up after 2 hours, 5 hours, or 12 hours. This feature performs the exact same physics simulation for a missing fishing boat.

**Why it matters**: Currently, when a vessel goes missing, the Indian Coast Guard and local marine police must search vast oceanic grids blindly. This feature calculates a high-probability search corridor, directing rescue vessels to the most likely drift zone first. This directly saves lives during golden-hour rescue windows.

### Technical Approach

* **Library**: OpenDrift, an open-source Python framework built by the Norwegian Meteorological Institute specifically for oceanic search-and-rescue trajectory modeling.
* **Integration**:
  * Install package: `pip install opendrift`
  * Add a dedicated Pydantic AI agent named `SARDriftAgent`
* **Operational Flow**:
  1. Operator inputs the boat last confirmed GPS fix and timestamp.
  2. The agent pulls live ocean surface currents from INCOIS and wind fields from IMD.
  3. Executes a Monte Carlo simulation (releasing 100 virtual particles from the last known coordinates that drift according to physical drag and current forces).
  4. Generates a GeoJSON probability density heatmap showing where the vessel is located now, rendered directly on the Next.js Leaflet map canvas.

## 2. Crowdsourced Fishermen Observations and Ground-Truth Verification

### Simple Explanation

**What it does**: Fishermen at sea report real conditions directly from their boats (actual wave heights, sudden gusts, or localized squalls). This real-world ground truth verifies whether satellite forecasts are accurate or flawed.

**Think of it like this**: Your weather app says it is sunny, but you look outside and see rain pouring down. If enough people report rain, the app corrects itself. This feature applies the same crowd-intelligence model to the sea: fishermen act as human ocean sensors verifying satellite models.

**Why it matters**: Satellites scan on orbital passes and can miss sudden localized coastal swells. If satellite forecasts predict calm 1.5 meter seas, but boats in that sector encounter dangerous 10-foot waves, the platform warns incoming fishermen: "Satellite predicts calm waters, but active boats in this sector report 10-foot swells. Proceed with caution."

### Dedicated Ground-Truth Reporting Page

A dedicated mobile screen (`/report-conditions`) enables fishermen to submit real-time ground observations:
* **Camera Capture**: Fisherman snaps a live photo or short video of the sea surface.
* **Automatic GPS Pinning**: The device browser captures precise latitude and longitude coordinates.
* **Voice or Text Discrepancy Note**: The user reports what is wrong (for example: "Satellite says calm, but we have 10-foot waves and heavy wind from the south").
* **Discrepancy Resolution**: The backend compares the reported 10-foot waves against the official calm forecast, updates local risk ratings, and broadcasts a high-priority warning to all vessels navigating toward that sector.

### Technical Approach

* **Operational Flow**:
  1. Fisherman opens the app and taps the "Report Conditions" button.
  2. Attaches a live camera photo of the sea state alongside device GPS coordinates.
  3. Speaks in their regional dialect: "Waves are 10 feet high, wind from north, heavy squall."
  4. Sarvam Saaras (STT) transcribes the speech into text.
  5. Pydantic AI extracts structured fields (wave height estimate, wind direction, weather category, severity index).
  6. Multimodal analysis checks the photo to confirm sea roughness and foam coverage.
  7. Record is saved into PostgreSQL with GPS coordinates, media URL, and timestamp.
  8. The Comparison Agent checks the ground report against official IMD and INCOIS satellite feeds.
  9. When a significant difference is detected, the system triggers a localized proximity alert to nearby vessels.

## 3. Offline Mode and Sync When Back Online

### Simple Explanation

**What it does**: When fishermen travel beyond coastal mobile tower range with zero cellular reception, the app continues displaying the latest downloaded weather forecast, Potential Fishing Zone coordinates, and safety geofences. Once the vessel returns within cellular range, the app automatically synchronizes fresh data.

**Think of it like this**: It works like saving an offline map before a trip into the mountains. You can still navigate without internet. Once connectivity returns, the map refreshes with current traffic and road closures.

**Why it matters**: Indian marine fishing predominantly happens 15 to 30 km offshore where 4G and 5G cellular coverage drops completely. If a marine app relies solely on live internet access, it becomes useless exactly when fishermen are in open waters. Offline caching guarantees continuous navigational safety.

### Technical Approach

* **Library**: Workbox (Google service worker library) integrated into the Next.js Progressive Web App (PWA).
* **Operational Flow**:
  * The Service Worker intercepts all frontend network and API requests.
  * When online: Fetches fresh advisories and stores a copy inside browser CacheStorage and IndexedDB.
  * When offline: Serves the locally cached advisory and map tiles (advisories remain valid with a clear freshness timestamp).
  * When back online: Background sync automatically detects network re-establishment and pulls updated bulletins silently.
