import { CloudLightning, Compass } from "lucide-react";

interface BriefingItem {
  icon: typeof CloudLightning;
  tone?: "default" | "warm";
  title: string;
  detail: string;
  source: string;
}

const BRIEFING_ITEMS: BriefingItem[] = [
  {
    icon: CloudLightning,
    tone: "warm",
    title: "Squall line holding 90 km north",
    detail:
      "Outside your sector for now. If it tracks south, the warning list updates within the hour.",
    source: "IMD Coastal Bulletin 14",
  },
  {
    icon: Compass,
    title: "Fishing zone at 247°, 38 km out",
    detail:
      "Thermal front holding until early afternoon. Waves on the route stay under 1.3 m.",
    source: "INCOIS PFZ Advisory Node 24",
  },
];

export function BriefingCard() {
  return (
    <section className="rounded-xl border border-border-subtle bg-surface overflow-hidden flex flex-col shadow-xs transition-all duration-200 hover:border-border">
      <div className="px-5 py-3.5 border-b border-border-subtle">
        <h2 className="text-sm font-medium text-primary font-instrument">Agent briefing</h2>
        <p className="text-[11px] text-muted font-intert mt-0.5">
          What ORCA found while you were away
        </p>
      </div>

      <div className="flex-1 divide-y divide-border">
        {BRIEFING_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 px-5 py-3.5"
          >
            <item.icon
              size={15}
              className={`shrink-0 mt-0.5 ${
                item.tone === "warm" ? "text-brand-2" : "text-ocean"
              }`}
            />
            <div className="min-w-0">
              <p className="text-[13px] text-primary leading-snug">
                {item.title}
              </p>
              <p className="text-xs text-muted font-intert mt-1 leading-relaxed">
                {item.detail}
              </p>
              <p className="text-[10px] text-muted font-intert mt-1.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-brand shrink-0" />
                {item.source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
