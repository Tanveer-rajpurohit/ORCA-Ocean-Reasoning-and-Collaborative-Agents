export type AuditStepType = 'reasoning' | 'tool' | 'verdict';

export interface AuditStep {
  id: string;
  type: AuditStepType;
  content: string;
  toolName?: string;
  toolInput?: unknown;
  toolOutput?: unknown;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  query: string;
  steps: AuditStep[];
  timestamp: string;
  finalVerdict: string;
}
