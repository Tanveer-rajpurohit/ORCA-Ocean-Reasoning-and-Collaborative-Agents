"use client";

import React from "react";
import { ResponsiveContainer } from "recharts";

export interface ChartSeriesConfig {
  label: string;
  color: string;
  unit?: string;
}

export type ChartConfig = Record<string, ChartSeriesConfig>;

interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactElement;
  className?: string;
}

export function ChartContainer({
  config,
  children,
  className,
}: ChartContainerProps) {
  const seriesVars = Object.entries(config).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color;
      return acc;
    },
    {},
  );

  return (
    <div
      style={seriesVars as React.CSSProperties}
      className={`h-full w-full ${className ?? ""}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface TooltipPayloadItem {
  value?: number | string;
  dataKey?: string | number;
  color?: string;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  config: ChartConfig;
  labelFormatter?: (label: string | number) => string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  config,
  labelFormatter,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-2.5 py-2 shadow-lg shadow-black/5 font-intert">
      {label !== undefined && (
        <p className="text-[11px] text-muted mb-1">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}

      <div className="flex flex-col gap-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? "");
          const series = config[key];
          if (!series) return null;

          const raw = item.value;
          const value = typeof raw === "number" ? raw : Number(raw);
          if (Number.isNaN(value)) return null;

          return (
            <div key={key} className="flex items-center gap-2">
              <span
                aria-hidden
                className="w-3 h-0.5 rounded-full shrink-0"
                style={{ backgroundColor: series.color }}
              />
              <span className="text-[13px] font-semibold text-primary tabular-nums">
                {Number.isInteger(value) ? value : value.toFixed(1)}
              </span>
              <span className="text-[11px] text-muted">{series.unit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
