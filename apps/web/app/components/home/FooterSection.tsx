"use client";

import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="w-full bg-bg">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between pt-12 pb-10 gap-8">
        <div className="space-y-3">
          <Link
            href="/"
            className="text-primary text-2xl font-normal font-instrument italic hover:opacity-85 transition-opacity"
          >
            ORCA
          </Link>
          <p className="text-muted text-xs sm:text-sm font-intert max-w-xs">
            Ocean Reasoning and Collaborative Agents for marine ecosystem decision support.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-secondary bg-surface border border-border px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Track · Disaster Management (SIH26176)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-12 text-xs font-intert text-secondary">
          <div className="space-y-2.5">
            <div className="text-muted font-semibold uppercase tracking-wider font-mono">
              Capabilities
            </div>
            <div className="space-y-1.5">
              <div>
                <Link
                  href="#product"
                  className="hover:text-primary transition-colors"
                >
                  PFZ Advisories
                </Link>
              </div>
              <div>
                <Link
                  href="#product"
                  className="hover:text-primary transition-colors"
                >
                  Cyclone Warnings
                </Link>
              </div>
              <div>
                <Link
                  href="#product"
                  className="hover:text-primary transition-colors"
                >
                  SAR Drift Simulation
                </Link>
              </div>
              <div>
                <Link
                  href="#product"
                  className="hover:text-primary transition-colors"
                >
                  Crowdsourced Ground Truth
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-muted font-semibold uppercase tracking-wider font-mono">
              Resources
            </div>
            <div className="space-y-1.5">
              <div>
                <Link
                  href="#faq"
                  className="hover:text-primary transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </div>
              <div>
                <Link
                  href="https://incois.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  INCOIS Ocean Portal
                </Link>
              </div>
              <div>
                <Link
                  href="https://mausam.imd.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  IMD Mausam
                </Link>
              </div>
              <div>
                <Link
                  href="/chat"
                  className="hover:text-primary transition-colors"
                >
                  Launch Marine Console
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
