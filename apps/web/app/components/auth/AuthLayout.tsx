import React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-bg">
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative p-6 md:p-8 lg:p-12">
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-medium text-secondary hover:text-primary transition-colors font-intert group"
          >
            <div className="w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center group-hover:border-brand/40 group-hover:bg-surface-muted transition-colors">
              <ArrowLeft
                size={15}
                className="text-secondary group-hover:text-primary transition-colors"
              />
            </div>
            <span>Back to home</span>
          </Link>
          <div className="lg:hidden text-xl font-instrument font-bold text-primary">
            ORCA
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center">{children}</div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-surface-muted border-l border-border sticky top-0 h-screen p-12 lg:p-16 flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-xs font-mono font-medium tracking-wider text-muted mb-6 uppercase">
            / WHY ORCA
          </div>

          <h1 className="font-instrument text-4xl lg:text-5xl text-primary leading-tight mb-6">
            One answer before you cast off
          </h1>

          <p className="font-intert text-lg text-secondary mb-12 max-w-lg leading-relaxed">
            Cyclone warnings, wave forecasts, and fishing zone advisories live
            in three separate government systems. ORCA listens to all of them
            and answers in your language.
          </p>

          <div className="space-y-8 max-w-lg">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                <Check size={12} strokeWidth={3} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary font-intert mb-1">
                  Every verdict cites its source
                </h3>
                <p className="text-muted text-sm font-intert leading-relaxed">
                  Recommendations point back to the exact IMD bulletin or
                  INCOIS advisory behind them
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                <Check size={12} strokeWidth={3} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary font-intert mb-1">
                  Voice-first, in your tongue
                </h3>
                <p className="text-muted text-sm font-intert leading-relaxed">
                  Speak in Tamil, Telugu, Malayalam, Bengali, and eight other
                  coastal languages
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                <Check size={12} strokeWidth={3} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary font-intert mb-1">
                  Warnings before the weather turns
                </h3>
                <p className="text-muted text-sm font-intert leading-relaxed">
                  Cyclone tracks, squall winds, and boundary alerts pushed to
                  your location
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-subtle max-w-lg">
          <blockquote className="font-instrument text-xl text-primary leading-snug italic mb-4">
            &quot;We used to check three different apps in English before
            leaving shore. Now I just ask, and the answer tells me if the sea
            is safe.&quot;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
