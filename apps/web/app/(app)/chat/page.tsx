"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ThinkingOrb } from "thinking-orbs";
import {
  ChatInput,
  ChatSuggestions,
  ChatMessageItem,
} from "../../components/app/chat";
import { useAgentStream, useLocalStorageState } from "../../../hooks";
import { useChatStore } from "../../../stores";
import type { ChatMessageData, ProfileData } from "../../../types";
import { DEFAULT_PROFILE } from "../../../types";

function formatLatency(ms?: number): string {
  if (!ms || ms <= 0) return "240ms";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserNearBottomRef = useRef(true);

  const {
    sendMessage,
    isStreaming,
    streamingUserMessage,
    streamingAssistantResponse,
    streamingSteps,
  } = useAgentStream();

  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const runsBySession = useChatStore((state) => state.runsBySession);
  const newSession = useChatStore((state) => state.newSession);
  const [profile] = useLocalStorageState<ProfileData>(
    "orca_profile",
    DEFAULT_PROFILE,
  );

  useEffect(() => {
    const handleNewChat = () => {
      newSession();
      isUserNearBottomRef.current = true;
    };
    window.addEventListener("orca:new-chat", handleNewChat);
    return () => window.removeEventListener("orca:new-chat", handleNewChat);
  }, [newSession]);

  const runs = currentSessionId
    ? (runsBySession[currentSessionId] ?? [])
    : [];

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isUserNearBottomRef.current = distanceToBottom < 150;
  };

  useEffect(() => {
    if (!isUserNearBottomRef.current) return;
    scrollToBottom("auto");
  }, [
    streamingAssistantResponse,
    streamingUserMessage,
    isStreaming,
    scrollToBottom,
  ]);

  useEffect(() => {
    scrollToBottom("auto");
  }, [runs.length, scrollToBottom]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      isUserNearBottomRef.current = true;
      setQuery("");
      sendMessage(trimmed);
      requestAnimationFrame(() => scrollToBottom("auto"));
      setTimeout(() => scrollToBottom("auto"), 120);
    },
    [sendMessage, scrollToBottom],
  );

  const messages: ChatMessageData[] = [];
  runs.forEach((run) => {
    messages.push({
      id: `user-${run.id}`,
      role: "user",
      content: run.user_message,
    });
    messages.push({
      id: `assistant-${run.id}`,
      role: "assistant",
      content: run.agent_response,
      thinking: {
        durationSeconds: Math.max(1, Math.round(run.latency_ms / 1000)),
        summary: `Checked ${run.citations?.length ?? 0} government sources in ${formatLatency(run.latency_ms)}`,
        steps: run.steps,
        detailedThought: `User asked: "${run.user_message}"\nQueried IMD, INCOIS, and geospatial layers in parallel.\nMerged findings into one verdict with sources attached.`,
      },
      chart: run.chart,
      citations: run.citations,
    });
  });

  const isEmpty = messages.length === 0 && !isStreaming;
  const contextLabel = `${profile.home_port.split(",")[0]} · ${profile.vessel_type}`;

  const composer = (
    <ChatInput
      value={query}
      onChange={setQuery}
      onSubmit={handleSend}
      disabled={isStreaming}
      contextLabel={contextLabel}
      placeholder={
        isStreaming
          ? "ORCA is replying..."
          : "Ask about sea conditions, fishing zones, or your next trip..."
      }
    />
  );

  return (
    <div className="relative flex-1 flex flex-col min-h-0 h-full">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-7 animate-in fade-in duration-300 my-auto py-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <ThinkingOrb state="breathing" size={64} theme="light" />
              </div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ocean mb-3 font-intert">
                Your sea. Your language. Your ORCA.
              </p>
              <h1 className="text-3xl sm:text-4xl font-instrument text-primary tracking-tight">
                What&apos;s on your horizon?
              </h1>
              <p className="mt-3 text-sm text-muted font-intert max-w-md mx-auto leading-relaxed">
                Ask about the sea, your next trip, or where the fish might be.
                A clearer answer starts with a simple question.
              </p>
            </div>

            {composer}
            <ChatSuggestions onSelect={handleSend} />
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 pt-6 pb-40"
          >
            <div className="mx-auto max-w-3xl space-y-2 animate-in fade-in duration-300">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}

              {isStreaming && streamingUserMessage && (
                <>
                  <ChatMessageItem
                    message={{
                      id: "active-user-turn",
                      role: "user",
                      content: streamingUserMessage,
                    }}
                  />
                  <ChatMessageItem
                    message={{
                      id: "active-assistant-turn",
                      role: "assistant",
                      content: streamingAssistantResponse,
                      thinking: {
                        durationSeconds: 2,
                        summary: "Routing your question across the agent core...",
                        steps: streamingSteps,
                        detailedThought: `Active prompt: "${streamingUserMessage}"\nDispatching weather, ocean, and geospatial agents in parallel...`,
                      },
                    }}
                    isStreaming={true}
                  />
                </>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-4 sm:px-8 pb-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg via-bg/95 to-transparent"
            />
            <div className="relative mx-auto max-w-3xl">
              {composer}
              <p className="text-center text-[10px] text-muted mt-2 font-intert">
                Advisory support only · Verify official bulletins before making
                decisions at sea.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
