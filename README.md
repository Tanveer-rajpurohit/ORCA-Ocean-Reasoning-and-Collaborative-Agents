# ORCA

ORCA is a conversational agent for coastal fishermen. It pulls from three
government advisory systems that don't talk to each other (INCOIS fishing zone
advisories, IMD weather warnings, and ISRO satellite ocean layers), and answers
one question in the user's own language: is it safe to go out, and where should
I fish?

Built for Smart India Hackathon 2026, problem statement SIH26176, filed by ISRO
under Disaster Management.

## Repository layout

```
sih/
├── apps/
│   ├── web/            Next.js frontend (App Router, Tailwind, MapLibre)
│   └── tts-service/    Node service that turns text into speech
├── packages/
│   ├── ui/             Shared React components
│   ├── tailwind-config/ Design tokens and Tailwind preset
│   ├── typescript-config/
│   └── eslint-config/
├── docs/               Problem statement, feature list, design notes
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Getting started

Requires Node 22 or newer and pnpm 11.

```sh
pnpm install
pnpm dev
```

`pnpm dev` starts every workspace that has a `dev` script. The web app runs on
port 3001. The TTS service runs on port 3004.

To run one at a time:

```sh
pnpm --filter web dev
pnpm --filter tts-service dev
```

## apps/web

The frontend. Everything the fisherman sees and touches.

Pages live under `app/`, split into three route groups. `(marketing)` holds the
landing page. `(auth)` holds login and register. `(app)` holds the workspace,
which is the sidebar shell and the nine pages inside it: dashboard, chat, sea
map, advisories, hazards, report, audit log, profile, and settings.

Chat is the centre of the product. A question goes out over SSE, reasoning steps
and tokens stream back, and the answer arrives with a chart, a source list, and
a Listen button. The reasoning trace under each answer shows which government
sources were checked.

State is split by lifetime. `stores/useChatStore.ts` holds conversations in
memory, so a reload clears them. Language, voice, and the fisher profile persist
to localStorage through `hooks/useLocalStorageState.ts`.

The sea map uses MapLibre with OpenFreeMap vector tiles. No API key is needed,
which keeps the demo reproducible. Wave height, wind, and sea temperature are
separate view modes, and the legend explains what each colour means in plain
words.

### Environment

Copy `.env.example` to `.env.local` if you need to point at a different TTS host.

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_TTS_URL` | `http://localhost:3004` | Where the Listen button fetches audio |

## apps/tts-service

Text to speech. Wraps Microsoft Edge's neural voices and exposes a single
endpoint that returns MP3.

```sh
cd apps/tts-service
pnpm dev
```

`GET /api/tts?text=...&lang=ml-IN` returns audio. `GET /voices` lists every
language and voice that is available.

Odia and Konkani have no Edge neural voice. The service falls back to Indian
English for those two languages and reports that in the `/voices` response, so
the UI can label the fallback instead of quietly speaking the wrong language.
Sarvam Bulbul covers both, and swapping to it means changing this service only.

## packages

`ui` exports the shared React components. `tailwind-config` holds the colour
tokens and font families that both apps import, so a change to `--brand` lands
everywhere at once. `typescript-config` and `eslint-config` are the shared
compiler and lint settings.

## Documentation

| File | Contents |
|---|---|
| `docs/idea.md` | Full problem statement and system architecture |
| `docs/features.md` | Functional and non-functional requirements |
| `docs/extra-features.md` | Search and rescue drift, crowd reports, offline mode |
| `docs/advisories-explainer.md` | What the advisories feature does and why it matters |

## Current status

The frontend runs end to end against sample data. Chat streams, charts render,
the map draws, and the voice stack works if the TTS service is running.

There is no backend yet. Agent responses come from `lib/mockResponses.ts`, and
the marine data in `lib/marineMapData.ts` is handwritten. Both files were shaped
to match what the real INCOIS and IMD tools will return, so wiring them up is a
data swap rather than a rewrite.
