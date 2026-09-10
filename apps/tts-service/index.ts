import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { URL } from "node:url";
import { EdgeTTS } from "node-edge-tts";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3004;
const MAX_CHARS = 1500;

interface VoiceEntry {
  voice: string;
  label: string;
}

const VOICE_MAP: Record<string, VoiceEntry> = {
  "en-IN": { voice: "en-IN-PrabhatNeural", label: "English" },
  "en-IN-female": { voice: "en-IN-NeerjaNeural", label: "English (female)" },
  "hi-IN": { voice: "hi-IN-MadhurNeural", label: "Hindi" },
  "hi-IN-female": { voice: "hi-IN-SwaraNeural", label: "Hindi (female)" },
  "bn-IN": { voice: "bn-IN-BashkarNeural", label: "Bengali" },
  "bn-IN-female": { voice: "bn-IN-TanishaaNeural", label: "Bengali (female)" },
  "gu-IN": { voice: "gu-IN-NiranjanNeural", label: "Gujarati" },
  "gu-IN-female": { voice: "gu-IN-DhwaniNeural", label: "Gujarati (female)" },
  "kn-IN": { voice: "kn-IN-GaganNeural", label: "Kannada" },
  "kn-IN-female": { voice: "kn-IN-SapnaNeural", label: "Kannada (female)" },
  "ml-IN": { voice: "ml-IN-MidhunNeural", label: "Malayalam" },
  "ml-IN-female": { voice: "ml-IN-SobhanaNeural", label: "Malayalam (female)" },
  "mr-IN": { voice: "mr-IN-ManoharNeural", label: "Marathi" },
  "mr-IN-female": { voice: "mr-IN-AarohiNeural", label: "Marathi (female)" },
  "ta-IN": { voice: "ta-IN-ValluvarNeural", label: "Tamil" },
  "ta-IN-female": { voice: "ta-IN-PallaviNeural", label: "Tamil (female)" },
  "te-IN": { voice: "te-IN-MohanNeural", label: "Telugu" },
  "te-IN-female": { voice: "te-IN-ShrutiNeural", label: "Telugu (female)" },
};

const FALLBACK_LANG = "en-IN";

const FALLBACK_NOTE: Record<string, string> = {
  "or-IN": "Odia has no Edge neural voice; falling back to Indian English.",
  "kok-IN": "Konkani has no Edge neural voice; falling back to Indian English.",
};

function pickVoice(lang: string | null): VoiceEntry {
  if (!lang) return VOICE_MAP[FALLBACK_LANG] as VoiceEntry;
  const direct = VOICE_MAP[lang];
  if (direct) return direct;

  const family = lang.split("-")[0] ?? "";
  const familyMatch = Object.keys(VOICE_MAP).find((key) =>
    key.startsWith(`${family}-`),
  );
  if (familyMatch) return VOICE_MAP[familyMatch] as VoiceEntry;

  return VOICE_MAP[FALLBACK_LANG] as VoiceEntry;
}

function sendJson(
  res: http.ServerResponse,
  status: number,
  body: Record<string, unknown>,
): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function cleanup(filePath: string): void {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      void 0;
    }
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (parsedUrl.pathname === "/" || parsedUrl.pathname === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "orca-tts",
      port: PORT,
      languages: Object.keys(VOICE_MAP).length,
    });
    return;
  }

  if (parsedUrl.pathname === "/voices") {
    sendJson(res, 200, { voices: VOICE_MAP, notes: FALLBACK_NOTE });
    return;
  }

  if (parsedUrl.pathname !== "/api/tts") {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  const text = parsedUrl.searchParams.get("text");
  const lang = parsedUrl.searchParams.get("lang") ?? req.headers["x-orca-lang"];
  const rate = parsedUrl.searchParams.get("rate") ?? "+0%";

  if (!text || !text.trim()) {
    sendJson(res, 400, { error: "text is required" });
    return;
  }

  const cleanText = text.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
  const entry = pickVoice(typeof lang === "string" ? lang : null);
  const tempFile = path.join(
    os.tmpdir(),
    `orca-tts-${crypto.randomBytes(8).toString("hex")}.mp3`,
  );

  try {
    const tts = new EdgeTTS({
      voice: entry.voice,
      rate,
      volume: "+0%",
      pitch: "+0Hz",
    });

    await tts.ttsPromise(cleanText, tempFile);

    const audioData = fs.readFileSync(tempFile);
    cleanup(tempFile);

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": audioData.length,
      "Cache-Control": "no-store",
      "X-Orca-Voice": entry.voice,
    });
    res.end(audioData);
  } catch (err) {
    cleanup(tempFile);
    console.error("[orca-tts] synthesis failed:", err);
    sendJson(res, 500, {
      error: "TTS synthesis failed",
      detail: String(err),
    });
  }
});

server.listen(PORT, () => {
  console.log(`ORCA TTS service listening on http://localhost:${PORT}`);
  console.log(`Voices loaded: ${Object.keys(VOICE_MAP).length}`);
});
