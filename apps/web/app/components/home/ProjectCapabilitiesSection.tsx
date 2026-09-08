"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPinned, RadioTower, Route, Sparkles } from "lucide-react";
import Badge from "../ui/Badge";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    title: "Live ocean intelligence",
    description: "Fuses INCOIS PFZ, IMD weather, and ISRO satellite layers into one current sea-state view.",
  },
  {
    title: "Eight-agent reasoning core",
    description: "Specialists for weather, ocean analytics, geospatial checks, risk, and reporting work in parallel.",
  },
  {
    title: "Voice in coastal languages",
    description: "Speak naturally and receive clear regional-language guidance designed for use at sea.",
  },
  {
    title: "Evidence-first safety",
    description: "Every recommendation carries source citations, confidence signals, and a clear safety verdict.",
  },
];

const workflow = [
  { icon: RadioTower, label: "Official live feeds", detail: "IMD · INCOIS · MOSDAC" },
  { icon: Sparkles, label: "Collaborative agents", detail: "Classify · verify · reason" },
  { icon: MapPinned, label: "Actionable advisory", detail: "Voice · maps · citations" },
];

export default function ProjectCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".capability-card",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".capability-grid",
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".workflow-panel",
        { autoAlpha: 0, x: 20 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".capability-grid",
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="w-full border-b border-border bg-bg"
    >
      <div className="w-full max-w-6xl mx-auto border-x border-border">
        <div className="px-6 sm:px-12 md:px-16 pt-20 sm:pt-28 pb-12 sm:pb-16 border-b border-border">
          <Badge icon={<Route size={12} />} text="Project capabilities" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand mb-4">
                From fragmented data to a decision at sea
              </p>
              <h2 className="max-w-3xl font-instrument text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-primary">
                An ocean operations room, built for the people on the water.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-7 text-secondary font-intert lg:pb-1">
              ORCA turns multiple technical feeds into a single explainable advisory—so a safe departure, productive route, or rescue response can be decided with confidence.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="capability-grid grid sm:grid-cols-2 border-b lg:border-b-0 lg:border-r border-border">
            {capabilities.map((capability, index) => {
              return (
                <article
                  key={capability.title}
                  className={`capability-card group min-h-52 p-6 sm:p-8 flex flex-col border-border transition-colors hover:bg-surface ${
                    index < 2 ? "border-b" : ""
                  } ${index % 2 === 0 ? "sm:border-r" : ""}`}
                >
                  <span className="mb-auto font-mono text-4xl sm:text-5xl tracking-[-0.08em] text-border transition-colors duration-200 group-hover:text-brand/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 font-intert text-base font-semibold text-primary">
                    {capability.title}
                  </h3>
                  <p className="mt-2 max-w-xs font-intert text-[13px] leading-5 text-muted">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>

          <aside className="workflow-panel bg-surface p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-10">
            <div>
              <div className="flex items-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">ORCA workflow</span>
              </div>
              <div className="mt-8 space-y-0">
                {workflow.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="relative flex gap-4 pb-7 last:pb-0">
                      {index < workflow.length - 1 && (
                        <span className="absolute left-[15px] top-8 h-[calc(100%-8px)] border-l border-dashed border-border" />
                      )}
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-brand">
                        <Icon size={15} />
                      </div>
                      <div className="pt-0.5">
                        <p className="font-intert text-sm font-semibold text-primary">{step.label}</p>
                        <p className="mt-1 font-mono text-[11px] text-muted">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Designed for real conditions</p>
              <p className="mt-2 font-instrument text-2xl leading-tight text-primary">Offline-ready, source-cited, and built to degrade safely.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
