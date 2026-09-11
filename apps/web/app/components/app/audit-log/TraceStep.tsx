"use client";

import { AuditStep } from "../../../../types/audit-log/types";

interface TraceStepProps {
  step: AuditStep;
  isLast: boolean;
}

export function TraceStep({ step, isLast }: TraceStepProps) {
  const isReasoning = step.type === "reasoning";
  const isTool = step.type === "tool";
  const isVerdict = step.type === "verdict";

  return (
    <div className="relative pl-6 pb-6">
      {/* Spine — 1px line centered on the 10px dot above it */}
      {!isLast && (
        <div className="absolute left-[4.5px] top-4 bottom-0 w-px bg-border" />
      )}
      {/* Dot */}
      <div
        className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-bg ${
          isVerdict ? "bg-brand" : isTool ? "bg-ocean" : "bg-border"
        }`}
      />

      <div className="flex flex-col gap-1">
        {isReasoning && (
          <p className="text-xs italic text-muted font-intert leading-relaxed">
            {step.content}
          </p>
        )}

        {isTool && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-muted border border-border text-secondary uppercase font-bold">
                {step.toolName}
              </span>
              <span className="text-[10px] text-muted font-intert">Calling agent...</span>
            </div>
            <div className="p-2 rounded-md bg-surface-muted border border-border font-mono text-[11px] text-secondary overflow-x-auto">
              {step.content}
            </div>
          </div>
        )}

        {isVerdict && (
          <p className="text-sm font-medium text-primary font-intert leading-relaxed">
            {step.content}
          </p>
        )}
      </div>
    </div>
  );
}
