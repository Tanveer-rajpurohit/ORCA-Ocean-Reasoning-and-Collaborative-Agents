import type { LucideIcon } from "lucide-react";

export type AgentStepStatus = "pending" | "in_progress" | "completed";

export type CitationSource =
  | "IMD"
  | "INCOIS"
  | "MOSDAC"
  | "Bhuvan"
  | "Open-Meteo";

export interface AgentStep {
  id: string;
  label: string;
  detail?: string;
  status: AgentStepStatus;
}

export interface Citation {
  source: CitationSource;
  reference: string;
  url: string;
  issued: string;
}

export interface InlineCitation {
  id: string;
  source: CitationSource;
  reference: string;
  url: string;
  issued: string;
}

export interface ThinkingData {
  durationSeconds: number;
  summary: string;
  steps: AgentStep[];
  detailedThought?: string;
}

export type ChartVariant = "line" | "bar";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartSeries {
  key: string;
  label: string;
  values: number[];
}

export interface ChartPeriod {
  id: string;
  label: string;
  times: string[];
  series: ChartSeries[];
}

export interface MarineChartData {
  title: string;
  unit: string;
  variant: ChartVariant;
  subtitle?: string;
  issued?: string;
  source?: string;
  threshold?: number;
  thresholdLabel?: string;
  periods: ChartPeriod[];
}

export interface AgentRun {
  id: string;
  session_id: string;
  user_message: string;
  agent_response: string;
  latency_ms: number;
  steps: AgentStep[];
  chart?: MarineChartData;
  citations?: Citation[];
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: ThinkingData;
  chart?: MarineChartData;
  citations?: Citation[];
}

export interface ChatSessionSummary {
  session_id: string;
  title: string;
  last_active_at: string;
}

export interface SuggestionItem {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  prompt: string;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export interface SpeechWindow {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}
