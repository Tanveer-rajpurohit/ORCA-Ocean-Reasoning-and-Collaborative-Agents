"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Table2, ChartLine } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "../../ui/chart";
import type { ChartConfig } from "../../ui/chart";
import type { MarineChartData } from "../../../../types";

interface MarineChartCardProps {
  data: MarineChartData;
}

const AXIS_TICK = { fontSize: 10, fill: "var(--text-muted)" };
const MARGIN = { top: 14, right: 14, bottom: 0, left: -16 };

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function MarineChartCard({ data }: MarineChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  const values = data.points.map((point) => point.value);
  const peak = Math.max(...values, data.threshold ?? 0);
  const domainMax =
    data.unit === "%" ? 100 : Math.max(Math.ceil(peak * 1.15), 1);
  const lastIndex = data.points.length - 1;
  const last = data.points[lastIndex];
  const exceedsThreshold =
    data.threshold !== undefined && peak > data.threshold;

  const config: ChartConfig = {
    value: {
      label: data.title,
      color: "var(--brand)",
      unit: data.unit,
    },
  };

  const renderEndpointDot = (props: {
    cx?: number;
    cy?: number;
    index?: number;
  }) => {
    const { cx, cy, index } = props;
    if (cx === undefined || cy === undefined) return <g key="empty" />;
    const isLast = index === lastIndex;

    return (
      <g key={`dot-${index}`}>
        <circle
          cx={cx}
          cy={cy}
          r={isLast ? 4 : 2.5}
          fill="var(--brand)"
          stroke="var(--surface)"
          strokeWidth={2}
        />
        {isLast && last && (
          <text
            x={cx}
            y={cy - 10}
            textAnchor="end"
            fontSize="10"
            className="fill-[var(--text-primary)] font-medium"
          >
            {formatValue(last.value)}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full my-4 font-intert animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-primary block leading-none tracking-[-0.01em]">
            {data.title}
          </span>
          <span className="text-[11px] text-muted">
            {data.unit}
            {data.issued ? ` · issued ${data.issued}` : ""}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          title={showTable ? "Show chart" : "Show values as table"}
          aria-label={showTable ? "Show chart" : "Show values as table"}
          className="shrink-0 -mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-muted hover:text-primary hover:bg-surface-muted active:scale-[0.94] transition-[color,background-color,transform] duration-100 cursor-pointer"
        >
          {showTable ? <ChartLine size={13} /> : <Table2 size={13} />}
        </button>
      </div>

      {showTable ? (
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-1.5 font-medium text-muted">
                  Time
                </th>
                <th className="text-right px-3 py-1.5 font-medium text-muted">
                  {data.unit}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {data.points.map((point) => (
                <tr key={point.label}>
                  <td className="px-3 py-1.5 text-secondary">
                    {point.label}
                  </td>
                  <td className="px-3 py-1.5 text-right text-primary font-medium tabular-nums">
                    {formatValue(point.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border p-2">
          <div className="h-[132px] w-full">
            <ChartContainer config={config}>
              {data.variant === "bar" ? (
                <BarChart data={data.points} margin={MARGIN}>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border-subtle)"
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={AXIS_TICK}
                    padding={{ left: 4, right: 4 }}
                  />
                  <YAxis
                    domain={[0, domainMax]}
                    tickLine={false}
                    axisLine={false}
                    tick={AXIS_TICK}
                    width={36}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--surface-muted)", opacity: 0.6 }}
                    content={
                      <ChartTooltipContent config={config} />
                    }
                  />
                  {data.threshold !== undefined && (
                    <ReferenceLine
                      y={data.threshold}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  )}
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                    isAnimationActive={false}
                  />
                </BarChart>
              ) : (
                <AreaChart data={data.points} margin={MARGIN}>
                  <defs>
                    <linearGradient
                      id="orca-area-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-value)"
                        stopOpacity={0.12}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-value)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border-subtle)"
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={AXIS_TICK}
                    padding={{ left: 14, right: 18 }}
                  />
                  <YAxis
                    domain={[0, domainMax]}
                    tickLine={false}
                    axisLine={false}
                    tick={AXIS_TICK}
                    width={36}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                    content={
                      <ChartTooltipContent config={config} />
                    }
                  />
                  {data.threshold !== undefined && (
                    <ReferenceLine
                      y={data.threshold}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="url(#orca-area-fill)"
                    dot={renderEndpointDot}
                    activeDot={{
                      r: 5,
                      fill: "var(--brand)",
                      stroke: "var(--surface)",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              )}
            </ChartContainer>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-2.5">
        {last && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-muted border border-border text-[11px] text-secondary">
            <span
              aria-hidden
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="font-medium text-primary tabular-nums">
              {formatValue(last.value)} {data.unit}
            </span>
            <span className="text-muted">at {last.label}</span>
          </span>
        )}

        {data.thresholdLabel && data.threshold !== undefined && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
              exceedsThreshold
                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            }`}
          >
            <span>{data.thresholdLabel}</span>
            <span className="opacity-70 tabular-nums">
              {formatValue(data.threshold)} {data.unit}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
