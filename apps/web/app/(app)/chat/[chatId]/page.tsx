"use client";

import { useState, useRef, useEffect, useCallback, use } from "react";
import { ThinkingOrb } from "thinking-orbs";
import {
  ChatInput,
  ChatMessageItem,
} from "../../../components/app/chat";
import { useAgentStream } from "../../../../hooks";
import { useChatStore } from "../../../../stores";
import type { ChatMessageData } from "../../../../types";

function formatLatency(ms?: number): string {
  if (!ms || ms <= 0) return "240ms";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function ChatSessionPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const resolvedParams = use(params);
  const chatId = resolvedParams.chatId;

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

  const runsBySession = useChatStore((state) => state.runsBySession);
  const sessions = useChatStore((state) => state.sessions);
  const setCurrentSession = useChatStore((state) => state.setCurrentSession);

  useEffect(() => {
    setCurrentSession(chatId);
  }, [chatId, setCurrentSession]);

  const runs = runsBySession[chatId] ?? [];
  const sessionTitle =
    sessions.find((s) => s.session_id === chatId)?.title ?? "ORCA Conversation";

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

  const isEmpty = runs.length === 0 && !isStreaming;

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

  return (
    <div className="relative flex-1 flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between h-14 px-6 border-b border-border shrink-0 bg-surface">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-muted bg-surface-muted px-2 py-0.5 rounded-md border border-border shrink-0">
            ID: {chatId.slice(0, 8)}
          </span>
          <span className="text-sm font-medium font-intert text-primary truncate">
            {sessionTitle}
          </span>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 pt-6 pb-36"
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <ThinkingOrb state="breathing" size={64} theme="light" />
            <p className="text-sm text-muted font-intert">
              This conversation is empty. Ask ORCA a question below.
            </p>
          </div>
        ) : (
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
        )}
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
            placeholder={
              isStreaming ? "ORCA is replying..." : "Reply to ORCA..."
            }
          />
        </div>
      </div>
    </div>
  );
}
