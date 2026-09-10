"use client";

import { useCallback, useRef, useState } from "react";
import { pickMockResponse } from "../lib/mockResponses";
import { useChatStore } from "../stores";
import type { AgentStep } from "../types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface UseAgentStreamResult {
  sendMessage: (text: string) => void;
  stopStreaming: () => void;
  isStreaming: boolean;
  streamingUserMessage: string;
  streamingAssistantResponse: string;
  streamingSteps: AgentStep[];
}

export function useAgentStream(): UseAgentStreamResult {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingUserMessage, setStreamingUserMessage] = useState("");
  const [streamingAssistantResponse, setStreamingAssistantResponse] =
    useState("");
  const [streamingSteps, setStreamingSteps] = useState<AgentStep[]>([]);
  const cancelledRef = useRef(false);

  const sendMessage = useCallback((text: string) => {
    const prompt = text.trim();
    if (!prompt) return;

    cancelledRef.current = false;

    const run = async () => {
      const startedAt = Date.now();
      const response = pickMockResponse(prompt);

      setIsStreaming(true);
      setStreamingUserMessage(prompt);
      setStreamingAssistantResponse("");
      setStreamingSteps([]);

      const { currentSessionId, newSession, addRun } = useChatStore.getState();
      const sessionId = currentSessionId ?? newSession();

      for (let index = 0; index < response.steps.length; index += 1) {
        if (cancelledRef.current) return;

        const pending = response.steps.map((step, i) => ({
          ...step,
          status:
            i < index
              ? ("completed" as const)
              : i === index
                ? ("in_progress" as const)
                : ("pending" as const),
        }));
        setStreamingSteps(pending);
        await sleep(520);
      }

      if (cancelledRef.current) return;
      setStreamingSteps(
        response.steps.map((step) => ({ ...step, status: "completed" as const })),
      );
      await sleep(280);

      const words = response.content.split(" ");
      const chunkSize = 4;
      for (let i = 0; i < words.length; i += chunkSize) {
        if (cancelledRef.current) return;
        const end = Math.min(i + chunkSize, words.length);
        setStreamingAssistantResponse(words.slice(0, end).join(" "));
        await sleep(34);
      }

      if (cancelledRef.current) return;

      addRun({
        id: crypto.randomUUID(),
        session_id: sessionId,
        user_message: prompt,
        agent_response: response.content,
        latency_ms: Date.now() - startedAt,
        steps: response.steps,
        chart: response.chart,
        citations: response.citations,
      });

      setIsStreaming(false);
      setStreamingUserMessage("");
      setStreamingAssistantResponse("");
      setStreamingSteps([]);
    };

    void run();
  }, []);

  const stopStreaming = useCallback(() => {
    cancelledRef.current = true;
    setIsStreaming(false);
    setStreamingUserMessage("");
    setStreamingAssistantResponse("");
    setStreamingSteps([]);
  }, []);

  return {
    sendMessage,
    stopStreaming,
    isStreaming,
    streamingUserMessage,
    streamingAssistantResponse,
    streamingSteps,
  };
}
