"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Check } from "lucide-react";
import Badge from "../ui/Badge";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "annually",
  );

  const pricing = {
    community: {
      monthly: 0,
      annually: 0,
    },
    fleet: {
      monthly: 499,
      annually: 399,
    },
    institutional: {
      monthly: 4999,
      annually: 3999,
    },
  };

  return (
    <section id="pricing" className="w-full border-b border-border">
      <div className="w-full max-w-6xl mx-auto">
        <div className="pt-14 sm:pt-18 pb-10 sm:pb-12 px-4 sm:px-6 flex flex-col items-center text-center border-b border-border">
          <Badge icon={<CreditCard size={12} />} text="Deployment Tiers" />
          <div className="text-primary text-3xl sm:text-4xl md:text-5xl font-normal font-instrument tracking-tight mt-3 mb-2.5">
            Transparent access for coastal safety
          </div>
          <div className="text-muted text-sm sm:text-base font-intert max-w-xl mb-7">
            Open government intelligence for artisanal fishermen with scalable infrastructure for maritime authorities.
          </div>

          <div className="p-1 bg-surface border border-border rounded-xl flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => setBillingPeriod("annually")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium font-intert transition-all ${
                billingPeriod === "annually"
                  ? "btn-brand-solid shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              Annually (Save 20%)
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium font-intert transition-all ${
                billingPeriod === "monthly"
                  ? "btn-brand-solid shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div>
                <div className="text-lg font-semibold font-intert text-primary">
                  Community
                </div>
                <div className="text-sm text-muted font-intert">
                  For artisanal and traditional fishermen along Indian coasts.
                </div>
              </div>
              <div>
                <div className="text-4xl font-instrument text-primary">
                  ₹{pricing.community[billingPeriod]}
                </div>
                <div className="text-xs text-muted font-intert">
                  per month, forever free
                </div>
              </div>
              <Link
                href="/chat"
                className="w-full py-2.5 rounded-xl border border-border bg-surface text-primary text-xs font-medium font-intert flex items-center justify-center hover:border-brand/40 transition-colors"
              >
                Access free
              </Link>
            </div>
            <div className="space-y-2.5 text-xs font-intert text-secondary">
              {[
                "Sarvam Indic voice interface (22 languages)",
                "Daily INCOIS PFZ advisory nodes",
                "IMD cyclone bulletins and wind alerts",
                "Offline PWA advisory storage",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-success shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between gap-8 bg-surface">
            <div className="space-y-6">
              <div>
                <div className="text-lg font-semibold font-intert text-primary flex items-center justify-between">
                  <span>Fleet & Co-ops</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-brand text-white">
                    Recommended
                  </span>
                </div>
                <div className="text-sm text-muted font-intert">
                  For mechanized fishing boats and coastal cooperatives.
                </div>
              </div>
              <div>
                <div className="text-4xl font-instrument text-primary">
                  ₹{pricing.fleet[billingPeriod]}
                </div>
                <div className="text-xs text-muted font-intert">
                  per boat / month, billed {billingPeriod}
                </div>
              </div>
              <Link
                href="/chat"
                className="btn-brand-solid w-full py-2.5 rounded-xl text-xs font-medium font-intert flex items-center justify-center shadow-xs"
              >
                Start deployment
              </Link>
            </div>
            <div className="space-y-2.5 text-xs font-intert text-secondary">
              {[
                "Multi-vessel telemetry tracking",
                "OpenDrift SAR drift trajectory simulation",
                "Crowdsourced wave ground-truth submission",
                "Fuel-efficient safe route recommendations",
                "Priority WebSocket push alerts",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-success shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div>
                <div className="text-lg font-semibold font-intert text-primary">
                  Institutional
                </div>
                <div className="text-sm text-muted font-intert">
                  For Coast Guard, Port Trust, and Disaster Management authorities.
                </div>
              </div>
              <div>
                <div className="text-4xl font-instrument text-primary">
                  ₹{pricing.institutional[billingPeriod]}
                </div>
                <div className="text-xs text-muted font-intert">
                  per sector / month, billed {billingPeriod}
                </div>
              </div>
              <Link
                href="/chat"
                className="w-full py-2.5 rounded-xl border border-border bg-surface text-primary text-xs font-medium font-intert flex items-center justify-center hover:border-brand/40 transition-colors"
              >
                Contact deployment team
              </Link>
            </div>
            <div className="space-y-2.5 text-xs font-intert text-secondary">
              {[
                "Custom MCP server tools and ERP bridges",
                "Live automated international boundary geofencing",
                "Full post-incident PostgreSQL audit trail",
                "Dedicated container cluster with high SLA",
                "Multi-modal SAR rescue corridor export",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-success shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
