"use client";

import { Check, Volume2, Square, Loader2 } from "lucide-react";
import { AVAILABLE_VOICES, useVoiceStore } from "../../../../stores";
import { useSpeechPlayback } from "../../../../hooks";

export function VoiceSection() {
  const { selectedVoice, setSelectedVoice } = useVoiceStore();
  const { speak, stop, status, activeId } = useSpeechPlayback();

  const handlePreview = (voiceId: string, previewText: string) => {
    if (activeId === voiceId && status !== "idle") {
      stop();
      return;
    }
    speak(previewText, voiceId, voiceId);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 font-intert">
      <div className="mb-5">
        <h2 className="text-base font-medium text-primary">
          Voice &amp; Audio Output
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Choose the voice ORCA speaks advisories in. Tap preview to hear it
          before you decide.
        </p>
      </div>

      <div className="space-y-2.5">
        {AVAILABLE_VOICES.map((voice) => {
          const isSelected = selectedVoice === voice.id;
          const isBusy = activeId === voice.id && status !== "idle";

          return (
            <div
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-brand bg-brand/5"
                  : "border-border bg-bg hover:bg-surface-muted hover:border-border/80"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-surface"
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-primary">
                      {voice.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-muted text-secondary border border-border">
                      {voice.gender === "female" ? "Female" : "Male"}
                    </span>
                    <span className="text-[10px] text-muted">
                      {voice.language} · {voice.native}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    {voice.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(voice.id, voice.previewText);
                }}
                title={isBusy ? "Stop preview" : "Hear this voice"}
                className={`shrink-0 self-end sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isBusy
                    ? "bg-brand text-white"
                    : "border border-border bg-surface hover:bg-surface-muted text-secondary hover:text-primary"
                }`}
              >
                {status === "loading" && activeId === voice.id ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Loading</span>
                  </>
                ) : isBusy ? (
                  <>
                    <Square size={11} fill="currentColor" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2
                      size={13}
                      className={isSelected ? "text-brand" : "text-muted"}
                    />
                    <span>Preview</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted mt-4 leading-relaxed">
        Odia and Konkani have no neural voice available yet. ORCA falls back to
        Indian English for those languages and labels the response as a
        fallback rather than speaking the wrong language.
      </p>
    </section>
  );
}
