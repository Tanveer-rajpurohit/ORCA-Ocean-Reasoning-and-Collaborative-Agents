"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="brand-glow w-full border-b border-border py-16 sm:py-24">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-6">
        <div className="space-y-3">
          <div className="text-primary text-3xl md:text-5xl font-normal font-instrument tracking-tight">
            Access Marine Intelligence Today
          </div>
          <div className="text-muted text-sm sm:text-base font-intert">
            Operational decision support for coastal communities and disaster response teams.
          </div>
        </div>
        <Link
          href="/chat"
          className="btn-brand-solid h-12 px-10 rounded-xl shadow-xs flex justify-center items-center text-sm font-medium font-intert active:scale-95 transition-all"
        >
          Launch Marine Console
        </Link>
      </div>
    </section>
  );
}
