# ORCA: Marine Ecosystem Reasoning with Collaborative Agents

## 1. Problem Statement Details

* **Problem Statement ID**: SIH26176
* **Problem Statement Title**: ORCA Marine Ecosystem Reasoning with Collaborative Agents
* **Organization**: Indian Space Research Organisation (ISRO)
* **Department**: Department of Space / Indian Space Research Organisation
* **Theme**: Disaster Management
* **Category**: Software
* **Team Name**: Don't Expecto

### Context and Core Problem
India possesses a 7,500 km coastline supporting over 7 million people dependent on marine fishing. Daily operations require cross-referencing three separate government advisory broadcasts:
1. INCOIS Potential Fishing Zone (PFZ) advisories and ocean state forecasts (WebGIS maps and text bulletins).
2. IMD coastal weather bulletins, cyclone alerts, and wind warnings (SMS and text advisories).
3. ISRO Bhuvan and MOSDAC satellite oceanographic layers (SST, chlorophyll, ocean heat potential).

These broadcasts exist in silos. Fishermen and coastal authorities must manually correlate complex technical data published mostly in English or Hindi. ORCA replaces this manual process with a multi-agent conversational system that fuses satellite observations, live ocean feeds, and weather forecasts into one regional-language voice and map interface.



## 2. Proposed Solution and System Overview

ORCA operates as an Agentic AI decision-support platform. When a user submits an operational query (such as asking if it is safe to venture out tomorrow or where the nearest fishing zone is located), an orchestrator agent decomposes the request into sub-tasks. Specialized sub-agents query live APIs and vector stores in parallel, synthesize the evidence, and deliver an explainable response with visual map layers and audio output.

### Key Capabilities
* **Multi-Agent Reasoning**: Dedicated domain agents handle planning, weather, ocean conditions, risk analysis, and reporting. Each agent binds to authoritative government data.
* **Conversational Multi-Turn Interaction**: Full context retention across follow-up queries (such as asking about conditions further north or alternative departure times).
* **Indic Voice First**: Automated language detection with speech-to-text and text-to-speech across Indian regional languages using Sarvam AI.
* **Evidence Grounding**: Every safety alert or fishing zone recommendation cites its exact source (IMD, INCOIS, MOSDAC) alongside confidence levels.
* **Proactive Hazard Alerts and Geofencing**: Real-time push notifications for cyclones, high waves, and lightning, paired with spatial checks against international maritime boundary lines (IMBL) and marine protected zones.
* **Safe Route Guidance**: Navigation recommendations that balance fuel economy against prevailing wave height, currents, and wind vectors.



## 3. Technical Architecture (ORCA v2)

The system follows a decoupled, cloud-ready architecture divided into five clear tiers:

```text
[User] (Voice / Text / Map Interaction)
   │
   ▼
[Web Platform: Next.js (App Router, PWA, Tailwind CSS, Leaflet/Mapbox)]
   │
   │ HTTP / WebSocket Streaming
   ▼
[FastAPI Backend Gateway] (direct cache / auth: Redis Cache)
   │
   ▼
[Pydantic AI Agent Orchestrator (Base LLM: Sarvam AI)]
   │
   ▼
┌─────────────────────────────────────────────────────────────┐
│          Multi-Agent Reasoning Core (Shared Services)       │
│                                                             │
│  1. User Interaction      2. Marine Data Discovery          │
│  3. Weather Intelligence  4. Ocean Analytics                │
│  5. Geospatial Reasoning  6. Risk Assessment                │
│  7. Visualization         8. Reporting                      │
└───────────────────┬─────────────────────────────────────────┘
                    │
          Tool and Data Layer
          ┌─────────┴────────────────────────┐
          ▼                                  ▼
[RAG Retrieval Tool]               [Live Data API / MCP Tools]
(pgvector over PostgreSQL)         (IMD, INCOIS, Open-Meteo, MOSDAC)
```

### Component Breakdown

#### Frontend Application (`apps/web`)
* **Framework**: Next.js App Router with SSR and PWA service workers for offline caching of the latest bulletins.
* **Styling**: Tailwind CSS with shared design tokens from `packages/ui` and `packages/tailwind-config`.
* **Geospatial Visualization**: Leaflet and Mapbox GL for interactive rendering of PFZ coordinates, cyclone tracks, wave cones, and maritime boundary overlays.
* **Realtime Communication**: WebSocket client for streaming live agent thought steps, citations, and tokens.
* **Audio Input/Output**: Browser MediaRecorder feeding Sarvam Saaras (STT) and playback via Sarvam Bulbul (TTS).

#### Backend Services (FastAPI service)
* **Framework**: FastAPI (async Python 3.11+) exposing REST and WebSocket endpoints.
* **Agent Framework**: Pydantic AI for schema-validated, type-safe agent execution with automated retry on malformed outputs.
* **LLM Engine**: Sarvam AI Indic-tuned LLMs for multilingual comprehension and generation.

#### Multi-Agent Reasoning Core (8 Specialized Agents)
1. **User Interaction Agent**: Manages conversation history, regional language translation hooks, and clarification prompts.
2. **Marine Data Discovery Agent**: Identifies required datasets (SST, chlorophyll, wave records) based on query context.
3. **Weather Intelligence Agent**: Ingests IMD bulletins, cyclone trajectories, and wind speed thresholds.
4. **Ocean Analytics Agent**: Evaluates INCOIS PFZ coordinates, tide tables, and mixed-layer depths.
5. **Geospatial Reasoning Agent**: Calculates distances, vessel coordinate checks, and boundary proximities.
6. **Risk Assessment Agent**: Computes hazard indices (Safe, Caution, Severe Danger). If an upstream API fails, it flags missing data rather than assuming safety.
7. **Visualization Agent**: Generates GeoJSON payloads, chart configs, and map tile markers for the frontend.
8. **Reporting Agent**: Formats structured advisory summaries and downloadable event logs for coastal authorities.



## 4. Data Integration and Storage

### Real-Time Live Data Feeds (MCP Tools)
* **IMD API**: Cyclone tracks, wind speed warnings, lightning strikes, coastal bulletins, and fishermen alerts.
* **INCOIS PFZ Advisory**: Daily Potential Fishing Zones derived from Oceansat and NOAA AVHRR thermal data.
* **INCOIS Ocean State Forecast (OSF)**: Wave heights, swell period, sea surface temperature, and port tide tables.
* **Open-Meteo Marine API**: Zero-credential fallback service providing hourly wave, current, and wind forecasts during third-party downtime.
* **ISRO Bhuvan and MOSDAC**: OGC WMS/WMTS tile services for ocean heat content, cyclone heat potential, and SST.

### Knowledge Base and RAG Layer
* **Store**: PostgreSQL with `pgvector` extension.
* **Corpus**: ICAR-CMFRI Marine Fish Stock Status reports, historical INCOIS advisories, and standard operating procedures (SOPs) for disaster management.
* **Use Case**: Answers complex queries such as historical productivity drops, seasonal migration shifts, and alert escalation protocols.

### Caching and Session Storage
* **Redis**: Caches third-party API payloads (TTL: 15 minutes to 3 hours), stores active WebSocket session states, and handles query rate limiting.



## 5. Feasibility, Impact, and Viability

### Technical Feasibility
* Publicly documented, free government endpoints (IMD, INCOIS, MOSDAC) form the primary backbone.
* Open-Meteo acts as an immediate zero-friction fallback so development and testing continue without registration blockers.
* Pydantic AI enforces type validation on LLM output schemas, preventing broken JSON responses.

### Operational Feasibility
* Regional language voice input bridges the digital divide for coastal fishing communities.
* Strict citation policies require every advisory to display its origin (such as IMD Cyclone Bulletin 04 or INCOIS PFZ Advisory Node 24).

### Economic and Societal Impact
* Indian fisheries studies (Nayak et al. 2002) documented annual fuel savings of 545 crore INR at 10% PFZ adoption, increasing to 1,635 crore INR at 25% adoption.
* ORCA simplifies access through voice and vernacular chat, directly driving adoption among artisanal and mechanized boat operators.
* Extensible architecture allows state disaster authorities, port operators, and the Indian Coast Guard to tap into the same intelligence pipelines without codebase forks.



## 6. Monorepo Structure

```text
sih/
├── apps/
│   ├── web/                    (Next.js frontend with Tailwind and Leaflet)
│   └── docs/                   (Next.js documentation portal)
├── docs/
│   ├── SIH2026-IDEA-Presentation-Format.pptx  (Source presentation template)
│   └── idea.md                 (Complete project specification and architecture)
├── packages/
│   ├── eslint-config/          (Shared ESLint rules)
│   ├── tailwind-config/        (Shared Tailwind presets)
│   ├── typescript-config/      (Shared tsconfig profiles)
│   └── ui/                     (Shared UI component library)
├── package.json                (Turborepo root package definition)
├── pnpm-workspace.yaml         (pnpm workspace definition)
└── turbo.json                  (Turborepo pipeline configuration)
```