"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUp, Mic, MicOff, Anchor } from "lucide-react";
import type {
  SpeechRecognitionInstance,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechWindow,
} from "../../../../types";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  contextLabel?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask about sea conditions, fishing zones, or safety...",
  autoFocus = false,
  disabled = false,
  contextLabel,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(false);
  const baseTextRef = useRef("");
  const finalAccumulatedRef = useRef("");
  const lastFinalIndexRef = useRef(-1);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;
      if (!recognition) return;
      try {
        recognition.abort();
      } catch {
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleInput = (val: string) => {
    onChange(val);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 160);
      textareaRef.current.style.height = `${Math.max(nextHeight, 28)}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 160 ? "auto" : "hidden";
    }
  };

  const stopRecognition = () => {
    isListeningRef.current = false;
    setIsListening(false);
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (!recognition) return;
    try {
      recognition.abort();
    } catch {
      recognitionRef.current = null;
    }
    try {
      recognition.stop();
    } catch {
      recognitionRef.current = null;
    }
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    const textToSend = value.trim();
    stopRecognition();
    onSubmit(textToSend);
    onChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecognitionSession = () => {
    if (typeof window === "undefined") return;
    const speechWin = window as unknown as SpeechWindow;
    const SpeechRecognition =
      speechWin.SpeechRecognition || speechWin.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          recognitionRef.current = null;
        }
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let newFinalThisRound = "";

        for (let i = 0; i < event.results.length; i += 1) {
          const item = event.results[i];
          if (!item || !item[0]) continue;
          const transcript = item[0].transcript.trim();

          if (item.isFinal) {
            if (i > lastFinalIndexRef.current && transcript) {
              newFinalThisRound +=
                (newFinalThisRound ? " " : "") + transcript;
            }
          } else if (i === event.results.length - 1) {
            interimTranscript = transcript;
          }
        }

        if (newFinalThisRound) {
          finalAccumulatedRef.current = `${
            finalAccumulatedRef.current ? `${finalAccumulatedRef.current} ` : ""
          }${newFinalThisRound}`;
        }

        for (let i = event.results.length - 1; i >= 0; i -= 1) {
          if (event.results[i]?.isFinal) {
            lastFinalIndexRef.current = i;
            break;
          }
        }

        const spoken = [finalAccumulatedRef.current, interimTranscript]
          .filter(Boolean)
          .join(" ");
        const fullText = [baseTextRef.current, spoken]
          .filter(Boolean)
          .join(" ");
        handleInput(fullText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "no-speech") return;
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          stopRecognition();
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          setTimeout(() => {
            if (isListeningRef.current) {
              startRecognitionSession();
            }
          }, 100);
        } else {
          stopRecognition();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      stopRecognition();
    }
  };

  const toggleSpeechRecognition = async () => {
    if (isListeningRef.current || isListening) {
      stopRecognition();
      return;
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.mediaDevices?.getUserMedia
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        return;
      }
    }

    baseTextRef.current = value.trim();
    finalAccumulatedRef.current = "";
    lastFinalIndexRef.current = -1;
    isListeningRef.current = true;
    setIsListening(true);
    startRecognitionSession();
  };

  const isSpeechSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as SpeechWindow).SpeechRecognition ||
        (window as unknown as SpeechWindow).webkitSpeechRecognition,
    );

  return (
    <div className="w-full">
      <div className="rounded-xl border border-border-subtle bg-surface shadow-xs transition-all duration-200 focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/10">
        <div className="px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={value}
            disabled={disabled}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening... speak in your language"
                : placeholder
            }
            rows={1}
            className="w-full resize-none bg-transparent text-[15px] text-primary font-intert outline-none placeholder:text-muted/60 leading-relaxed disabled:opacity-50 max-h-[160px] overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ minHeight: "28px" }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1">
          <span className="flex items-center gap-1.5 text-[11px] text-muted font-intert min-w-0">
            {contextLabel ? (
              <>
                <Anchor size={11} className="shrink-0" />
                <span className="truncate">{contextLabel}</span>
              </>
            ) : null}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isListening ? "Stop listening" : "Speak your question"}
                aria-label={isListening ? "Stop listening" : "Speak"}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-xs"
                    : "text-muted hover:text-secondary hover:bg-surface-muted"
                }`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                <span className="hidden sm:inline">
                  {isListening ? "Listening..." : "Speak"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              aria-label="Send message"
              className="flex items-center justify-center w-8 h-8 rounded-md btn-brand-solid disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
