import type { LucideIcon } from "lucide-react";
import { Sparkline } from "../../ui/Sparkline";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: number[];
  tone?: "default" | "ocean";
  footnote?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  tone = "default",
  footnote,
}: StatCardProps) {
  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-4 min-w-0 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm active:scale-[0.98] cursor-default">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-xs text-muted truncate font-intert">{label}</p>
        <Icon size={14} className="text-muted shrink-0" />
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-instrument text-primary leading-none tracking-tight">
          {value}
          {unit && (
            <span className="text-[13px] font-intert text-muted ml-1">
              {unit}
            </span>
          )}
        </p>
        {trend && (
          <Sparkline
            values={trend}
            color={tone === "ocean" ? "var(--ocean)" : "var(--brand-2)"}
          />
        )}
      </div>

      {footnote && (
        <p className="text-[11px] text-muted font-intert mt-2.5">{footnote}</p>
      )}
    </section>
  );
}
