"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info, Table2, ChartLine } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "../../ui/chart";
import type { ChartConfig } from "../../ui/chart";
import type { ChartPeriod, MarineChartData } from "../../../../types";

interface MarineChartCardProps {
  data: MarineChartData;
  className?: string;
}

const SERIES_COLORS = ["#6085AD", "#338E7F"];

const AXIS_TICK = { fontSize: 10, fill: "var(--text-muted)" };
const MARGIN = { top: 12, right: 12, bottom: 0, left: -18 };

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

interface ChartRow {
  label: string;
  [key: string]: string | number;
}

function buildRows(period: ChartPeriod): ChartRow[] {
  return period.times.map((time, index) => {
    const row: ChartRow = { label: time };
    for (const series of period.series) {
      row[series.key] = series.values[index] ?? 0;
    }
    return row;
  });
}

export function MarineChartCard({
  data,
  className = "my-4",
}: MarineChartCardProps) {
  const [periodId, setPeriodId] = useState(data.periods[0]?.id ?? "today");
  const [showTable, setShowTable] = useState(false);

  const period =
    data.periods.find((p) => p.id === periodId) ?? data.periods[0];
  if (!period) return null;

  const rows = buildRows(period);
  const allValues = period.series.flatMap((series) => series.values);
  const peak = Math.max(...allValues, data.threshold ?? 0);
  const domainMax =
    data.unit === "%" ? 100 : Math.max(Math.ceil(peak * 1.15), 1);
  const exceedsThreshold =
    data.threshold !== undefined && peak > data.threshold;
  const hasMultipleSeries = period.series.length > 1;

  const config: ChartConfig = period.series.reduce<ChartConfig>(
    (acc, series, index) => {
      acc[series.key] = {
        label: series.label,
        color: SERIES_COLORS[index % SERIES_COLORS.length] as string,
        unit: data.unit,
      };
      return acc;
    },
    {},
  );

  const axis = (
    <>
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
        padding={{ left: 10, right: 12 }}
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
        content={<ChartTooltipContent config={config} />}
      />
      {data.threshold !== undefined && (
        <ReferenceLine
          y={data.threshold}
          stroke="var(--border)"
          strokeWidth={1}
        />
      )}
    </>
  );

  return (
    <div
      className={`w-full font-intert animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-primary block leading-none tracking-[-0.01em]">
            {data.title}
          </span>
          <span className="text-[11px] text-muted">
            {data.subtitle ? `${data.subtitle} · ` : ""}
            {data.issued ? `issued ${data.issued}` : data.unit}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {data.periods.length > 1 && (
            <div className="flex gap-0.5 p-0.5 rounded-lg bg-surface-muted border border-border">
              {data.periods.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPeriodId(option.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                    option.id === period.id
                      ? "bg-surface text-primary shadow-xs"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowTable((prev) => !prev)}
            title={showTable ? "Show chart" : "Show values as table"}
            aria-label={showTable ? "Show chart" : "Show values as table"}
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted hover:text-primary hover:bg-surface-muted active:scale-[0.94] transition-[color,background-color,transform] duration-100 cursor-pointer"
          >
            {showTable ? <ChartLine size={13} /> : <Table2 size={13} />}
          </button>
        </div>
      </div>

      {hasMultipleSeries && !showTable && (
        <div className="flex items-center gap-3 mb-1.5">
          {period.series.map((series, index) => (
            <span
              key={series.key}
              className="inline-flex items-center gap-1.5 text-[11px] text-secondary"
            >
              <span
                aria-hidden
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    SERIES_COLORS[index % SERIES_COLORS.length],
                }}
              />
              {series.label}
            </span>
          ))}
          <span className="ml-auto text-[10px] font-mono text-muted">
            {data.unit}
          </span>
        </div>
      )}

      {showTable ? (
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-1.5 font-medium text-muted">
                  Time
                </th>
                {period.series.map((series) => (
                  <th
                    key={series.key}
                    className="text-right px-3 py-1.5 font-medium text-muted"
                  >
                    {series.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-1.5 text-secondary">{row.label}</td>
                  {period.series.map((series) => (
                    <td
                      key={series.key}
                      className="px-3 py-1.5 text-right text-primary font-medium tabular-nums"
                    >
                      {formatValue(Number(row[series.key] ?? 0))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border p-2">
          <div className="h-34 w-full">
            <ChartContainer config={config}>
              {data.variant === "bar" ? (
                <BarChart data={rows} margin={MARGIN}>
                  {axis}
                  {period.series.map((series, index) => (
                    <Bar
                      key={series.key}
                      dataKey={series.key}
                      fill={SERIES_COLORS[index % SERIES_COLORS.length]}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={20}
                      isAnimationActive={false}
                    />
                  ))}
                </BarChart>
              ) : (
                <AreaChart data={rows} margin={MARGIN}>
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
                        stopColor={SERIES_COLORS[0]}
                        stopOpacity={0.12}
                      />
                      <stop
                        offset="100%"
                        stopColor={SERIES_COLORS[0]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  {axis}
                  <Area
                    type="monotone"
                    dataKey={period.series[0]?.key ?? "value"}
                    stroke={SERIES_COLORS[0]}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="url(#orca-area-fill)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      stroke: "var(--surface)",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                  {period.series.slice(1).map((series, index) => (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={SERIES_COLORS[(index + 1) % SERIES_COLORS.length]}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={false}
                      activeDot={{
                        r: 4,
                        stroke: "var(--surface)",
                        strokeWidth: 2,
                      }}
                      isAnimationActive={false}
                    />
                  ))}
                </AreaChart>
              )}
            </ChartContainer>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-2.5">
        {data.source && (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] text-muted min-w-0">
            <Info size={11} className="shrink-0" />
            <span className="truncate">{data.source}</span>
          </span>
        )}

        {data.thresholdLabel && data.threshold !== undefined && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ml-auto ${
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
