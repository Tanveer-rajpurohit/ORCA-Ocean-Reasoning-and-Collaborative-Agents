"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceStore } from "../stores";
import type { SpeechPlaybackStatus } from "../types";

const TTS_BASE_URL =
  process.env.NEXT_PUBLIC_TTS_URL ?? "http://localhost:3004";

const MAX_SPEAK_CHARS = 1200;

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/^\s{0,3}\d+\.\s+/gm, "")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SPEAK_CHARS);
}

interface UseSpeechPlaybackResult {
  speak: (text: string, id: string, voiceId?: string) => void;
  stop: () => void;
  status: SpeechPlaybackStatus;
  activeId: string | null;
}

export function useSpeechPlayback(): UseSpeechPlaybackResult {
  const [status, setStatus] = useState<SpeechPlaybackStatus>("idle");
  const [activeId, setActiveId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const selectedVoice = useVoiceStore((state) => state.selectedVoice);

  const releaseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    releaseAudio();
    setStatus("idle");
    setActiveId(null);
  }, [releaseAudio]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (audioRef.current) audioRef.current.pause();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const speak = useCallback(
    (text: string, id: string, voiceId?: string) => {
      const clean = stripMarkdown(text);
      if (!clean) return;

      abortRef.current?.abort();
      releaseAudio();

      const controller = new AbortController();
      abortRef.current = controller;
      const lang = voiceId ?? selectedVoice;

      setActiveId(id);
      setStatus("loading");

      const url = `${TTS_BASE_URL}/api/tts?text=${encodeURIComponent(
        clean,
      )}&lang=${encodeURIComponent(lang)}`;

      fetch(url, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`TTS responded ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          objectUrlRef.current = objectUrl;

          const audio = new Audio(objectUrl);
          audioRef.current = audio;

          audio.onended = () => {
            releaseAudio();
            setStatus("idle");
            setActiveId(null);
          };
          audio.onerror = () => {
            releaseAudio();
            setStatus("idle");
            setActiveId(null);
          };

          return audio.play().then(() => setStatus("speaking"));
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          releaseAudio();
          setStatus("idle");
          setActiveId(null);
        });
    },
    [releaseAudio, selectedVoice],
  );

  return { speak, stop, status, activeId };
}
