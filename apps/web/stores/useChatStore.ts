"use client";

import { create } from "zustand";
import type { AgentRun, ChatSessionSummary } from "../types";

interface ChatState {
  sessions: ChatSessionSummary[];
  runsBySession: Record<string, AgentRun[]>;
  currentSessionId: string | null;
  newSession: () => string;
  setCurrentSession: (sessionId: string) => void;
  addRun: (run: AgentRun) => void;
  renameSession: (sessionId: string, title: string) => void;
  deleteSession: (sessionId: string) => void;
}

function titleFromMessage(message: string): string {
  const clean = message.trim().replace(/\s+/g, " ");
  if (clean.length <= 42) return clean;
  return `${clean.slice(0, 42)}...`;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  sessions: [],
  runsBySession: {},
  currentSessionId: null,

  newSession: () => {
    const id = crypto.randomUUID();
    set({ currentSessionId: id });
    return id;
  },

  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

  addRun: (run) => {
    const { sessions, runsBySession } = get();
    const existingRuns = runsBySession[run.session_id] ?? [];
    const existingSession = sessions.find(
      (s) => s.session_id === run.session_id,
    );

    const nextSession: ChatSessionSummary = existingSession
      ? { ...existingSession, last_active_at: new Date().toISOString() }
      : {
          session_id: run.session_id,
          title: titleFromMessage(run.user_message),
          last_active_at: new Date().toISOString(),
        };

    set({
      runsBySession: {
        ...runsBySession,
        [run.session_id]: [...existingRuns, run],
      },
      sessions: existingSession
        ? sessions.map((s) =>
            s.session_id === run.session_id ? nextSession : s,
          )
        : [nextSession, ...sessions],
      currentSessionId: run.session_id,
    });
  },

  renameSession: (sessionId, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.session_id === sessionId ? { ...s, title } : s,
      ),
    })),

  deleteSession: (sessionId) =>
    set((state) => {
      const nextRuns = { ...state.runsBySession };
      delete nextRuns[sessionId];
      return {
        runsBySession: nextRuns,
        sessions: state.sessions.filter((s) => s.session_id !== sessionId),
        currentSessionId:
          state.currentSessionId === sessionId ? null : state.currentSessionId,
      };
    }),
}));
