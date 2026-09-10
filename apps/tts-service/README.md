# ORCA TTS Service

Text-to-speech synthesis for ORCA voice output. Wraps Microsoft Edge's neural
TTS voices so the platform can speak advisories in the fisherman's own language.

## Why a separate service

Edge TTS runs on Node and shells out to a synthesis engine. Keeping it out of the
Next.js app means:

- The web app stays a pure frontend and can be deployed to any static host.
- Synthesis failures degrade to text-only instead of taking the app down (NFR-6).
- Swapping to Sarvam Bulbul later is a one-service change, not an app rewrite.

## Run

```bash
cd apps/tts-service
pnpm install
pnpm dev
```

Listens on `http://localhost:3004`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness + voice count |
| `GET` | `/voices` | Full language → voice map, plus fallback notes |
| `GET` | `/api/tts?text=…&lang=…` | Returns `audio/mpeg` |

### Query parameters

| Param | Required | Default | Notes |
|---|---|---|---|
| `text` | yes | — | Truncated to 1500 characters |
| `lang` | no | `en-IN` | BCP-47 tag; `-female` suffix selects the female voice |
| `rate` | no | `+0%` | Edge rate string, e.g. `-10%` for slower speech |

### Language coverage

| Code | Language | Male voice | Female voice |
|---|---|---|---|
| `en-IN` | English | Prabhat | Neerja |
| `hi-IN` | Hindi | Madhur | Swara |
| `bn-IN` | Bengali | Bashkar | Tanishaa |
| `gu-IN` | Gujarati | Niranjan | Dhwani |
| `kn-IN` | Kannada | Gagan | Sapna |
| `ml-IN` | Malayalam | Midhun | Sobhana |
| `mr-IN` | Marathi | Manohar | Aarohi |
| `ta-IN` | Tamil | Valluvar | Pallavi |
| `te-IN` | Telugu | Mohan | Shruti |

**Odia and Konkani have no Edge neural voice.** The service falls back to Indian
English and says so in the `/voices` response — the UI surfaces that to the user
rather than silently speaking the wrong language. When Sarvam Bulbul is wired in
(11 Indian languages, including both), this fallback disappears.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3004` | Listen port |
