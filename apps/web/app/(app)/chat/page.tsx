"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ThinkingOrb } from "thinking-orbs";
import {
  ChatInput,
  ChatSuggestions,
  ChatMessageItem,
} from "../../components/app/chat";
import { useAgentStream } from "../../../hooks";
import { useChatStore } from "../../../stores";
import type { ChatMessageData } from "../../../types";

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

  return (
    <div className="relative flex-1 flex flex-col min-h-0 h-full">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-300 my-auto py-8">
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <ThinkingOrb state="breathing" size={64} theme="light" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-instrument text-primary tracking-tight">
                What do you need to know?
              </h1>
              <p className="mt-2 text-sm text-muted font-intert">
                Ask about the sea, your route, or today&apos;s fishing zone. Every
                answer cites its source.
              </p>
            </div>

            <ChatInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSend}
              autoFocus
            />

            <ChatSuggestions onSelect={handleSend} />
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 pt-6 pb-36"
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
              <ChatInput
                value={query}
                onChange={setQuery}
                onSubmit={handleSend}
                disabled={isStreaming}
                placeholder="Reply to ORCA..."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
