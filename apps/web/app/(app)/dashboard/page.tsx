"use client";

import { useState } from "react";
import { Waves, Wind, Compass, Fish } from "lucide-react";
import { Select } from "../../components/ui/Select";
import { MarineChartCard } from "../../components/app/chat";
import {
  BriefingCard,
  OceanHero,
  SourcesBar,
  StatCard,
} from "../../components/app/dashboard";
import { useLocalStorageState } from "../../../hooks";
import type { MarineChartData, ProfileData } from "../../../types";
import { DEFAULT_PROFILE } from "../../../types";

const PORTS = [
  { label: "Kochi", value: "Kochi, Kerala", description: "Kerala · south coast" },
  {
    label: "Chennai",
    value: "Chennai, Tamil Nadu",
    description: "Tamil Nadu · south-east coast",
  },
  {
    label: "Visakhapatnam",
    value: "Visakhapatnam, Andhra Pradesh",
    description: "Andhra Pradesh · east coast",
  },
  {
    label: "Mumbai",
    value: "Mumbai, Maharashtra",
    description: "Maharashtra · west coast",
  },
  { label: "Puri", value: "Puri, Odisha", description: "Odisha · east coast" },
];

const DEFAULT_PORT = "Kochi, Kerala";

const FORECAST: MarineChartData = {
  title: "Wave and swell height",
  unit: "metres",
  variant: "line",
  subtitle: "Kochi coast",
  issued: "10 Sep, 06:00 IST",
  source: "Sample INCOIS ocean state forecast",
  threshold: 2,
  thresholdLabel: "Your boat's limit",
  periods: [
    {
      id: "today",
      label: "Today",
      times: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
      series: [
        {
          key: "wave",
          label: "Wave height",
          values: [0.9, 1.1, 1.4, 1.8, 2.1, 1.7],
        },
        {
          key: "swell",
          label: "Swell height",
          values: [0.6, 0.7, 0.9, 1.2, 1.4, 1.1],
        },
      ],
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      times: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      series: [
        {
          key: "wave",
          label: "Wave height",
          values: [1.3, 1.2, 1.5, 1.9, 1.6, 1.2],
        },
        {
          key: "swell",
          label: "Swell height",
          values: [0.9, 0.8, 1.0, 1.3, 1.1, 0.8],
        },
      ],
    },
    {
      id: "day3",
      label: "Day 3",
      times: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      series: [
        {
          key: "wave",
          label: "Wave height",
          values: [2.0, 2.2, 2.6, 2.4, 2.0, 1.8],
        },
        {
          key: "swell",
          label: "Swell height",
          values: [1.4, 1.6, 1.8, 1.7, 1.4, 1.2],
        },
      ],
    },
  ],
};

export default function DashboardPage() {
  const [profile, setProfile] = useLocalStorageState<ProfileData>(
    "orca_profile",
    DEFAULT_PROFILE,
  );
  const [port, setPort] = useState(profile.home_port || DEFAULT_PORT);

  const handlePortChange = (next: string) => {
    setPort(next);
    setProfile({ ...profile, home_port: next });
  };

  return (
    <div className="w-full h-full overflow-y-auto font-intert">
      <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
              Your ocean, at a glance
            </h1>
            <p className="text-sm text-muted font-intert mt-1">
              A clearer picture of the sea, and a more confident day ahead.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Select
              size="sm"
              value={port}
              onChange={handlePortChange}
              options={PORTS}
              placeholder="Select port"
              aria-label="Home port"
              className="w-44"
              menuClassName="w-60"
            />
          </div>
        </div>

        <OceanHero
          waveHeight="1.4"
          windSpeed="12 km/h NW"
          seaTemp="28.4 °C"
          zoneDistance="38 km · bearing 247°"
          headline="Settle seas through the morning, building after 15:00"
          description="Conditions suit a mechanized boat today. No active warning for your sector, and the fishing zone holds until early afternoon."
          verdict="Within your boat's safe range"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Wave height"
            value="1.4"
            unit="m"
            icon={Waves}
            trend={[0.9, 1.1, 1.4, 1.8, 2.1, 1.7]}
            footnote="Peaks at 2.1 m by evening"
          />
          <StatCard
            label="Wind"
            value="12"
            unit="km/h"
            icon={Wind}
            trend={[9, 12, 16, 21, 14, 10]}
            footnote="North-west, under warning level"
          />
          <StatCard
            label="Sea temperature"
            value="28.4"
            unit="°C"
            icon={Compass}
            tone="ocean"
            trend={[28.4, 28.1, 27.6, 28.3, 28.9]}
            footnote="0.8 °C above seasonal norm"
          />
          <StatCard
            label="Fishing zone"
            value="38"
            unit="km"
            icon={Fish}
            tone="ocean"
            trend={[31, 42, 65, 78, 61]}
            footnote="Bearing 247° from your port"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border bg-surface overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-medium text-primary">
                Ocean outlook
              </h2>
              <p className="text-[11px] text-muted font-intert mt-0.5">
                Wave and swell forecast for your coast
              </p>
            </div>
            <div className="px-5 pb-5">
              <MarineChartCard data={FORECAST} className="mt-4" />
            </div>
          </div>

          <BriefingCard />
        </div>

        <SourcesBar />
      </div>
    </div>
  );
}
