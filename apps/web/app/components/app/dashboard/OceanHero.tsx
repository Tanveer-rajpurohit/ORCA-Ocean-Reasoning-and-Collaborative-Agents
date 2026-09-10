import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface OceanHeroProps {
  waveHeight: string;
  windSpeed: string;
  seaTemp: string;
  zoneDistance: string;
  headline: string;
  description: string;
  verdict: string;
}

interface Metric {
  label: string;
  value: string;
}

export function OceanHero({
  waveHeight,
  windSpeed,
  seaTemp,
  zoneDistance,
  headline,
  description,
  verdict,
}: OceanHeroProps) {
  const metrics: Metric[] = [
    { label: "Wind", value: windSpeed },
    { label: "Sea temperature", value: seaTemp },
    { label: "Fishing zone", value: zoneDistance },
  ];

  return (
    <section className="rounded-xl bg-[#193E53] text-white mb-8">
      <div className="p-6 sm:p-7 lg:p-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/50 mb-3">
              Today&apos;s verdict
            </p>
            <h2 className="text-2xl sm:text-[1.7rem] font-instrument leading-[1.2] tracking-tight max-w-xl">
              {headline}
            </h2>
            <p className="text-[13px] text-white/65 leading-relaxed mt-3.5 max-w-xl">
              {description}
            </p>
          </div>

          <div className="lg:text-right shrink-0">
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/50 mb-2.5">
              Wave height
            </p>
            <p className="font-instrument text-5xl lg:text-6xl leading-none tracking-tight">
              {waveHeight}
              <span className="text-xl text-white/50 ml-1">m</span>
            </p>
            <p className="text-[11px] text-white/55 mt-2.5">{verdict}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/12 rounded-lg overflow-hidden mt-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-[#193E53] px-4 py-3.5">
              <p className="text-[10px] text-white/50">{metric.label}</p>
              <p className="text-[13px] font-medium text-white/95 mt-1 truncate">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-7">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-[#193E53] text-xs font-semibold hover:bg-white/90 active:scale-[0.97] transition-[background-color,transform] duration-100"
          >
            <span>Open the sea map</span>
            <ArrowRight size={13} />
          </Link>

          <Link
            href="/advisories"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/25 text-xs font-medium text-white/90 hover:bg-white/10 active:scale-[0.97] transition-[background-color,transform] duration-100"
          >
            <span>Today&apos;s advisories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
