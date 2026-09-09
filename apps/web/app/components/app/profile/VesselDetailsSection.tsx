"use client";

import { useState } from "react";
import { Ship, Tag, MapPin, FileText } from "lucide-react";
import { Select } from "../../ui/Select";

export interface VesselDetailsData {
  vesselName?: string;
  vesselType?: string;
  homePort?: string;
  registrationId?: string;
}

interface VesselDetailsSectionProps {
  data?: VesselDetailsData;
}

const VESSEL_TYPES = [
  "Artisanal / Country Craft",
  "Motorised Boat",
  "Mechanized Boat",
  "Deep-Sea Trawler",
  "Multi-Day Vessel",
];

export function VesselDetailsSection({ data }: VesselDetailsSectionProps) {
  const [vesselType, setVesselType] = useState<string>(
    data?.vesselType || VESSEL_TYPES[2] || "Mechanized Boat",
  );
  const [prevVesselType, setPrevVesselType] = useState(data?.vesselType);

  if (data?.vesselType !== prevVesselType) {
    setPrevVesselType(data?.vesselType);
    setVesselType(data?.vesselType || VESSEL_TYPES[2] || "Mechanized Boat");
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6 font-intert">
      <div className="mb-4 pb-3 border-b border-border">
        <h3 className="text-sm sm:text-base font-semibold text-primary">
          Vessel &amp; Home Port
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Route guidance and advisories are matched to your vessel and coast.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-primary block mb-1.5 flex items-center gap-1.5">
            <Ship size={13} className="text-muted" />
            <span>Vessel Name</span>
          </label>
          <input
            name="vesselName"
            type="text"
            defaultValue={data?.vesselName || ""}
            key={data?.vesselName || ""}
            placeholder="e.g. Sea Gull II"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-bg text-primary focus:outline-none focus:border-brand/50 transition-colors font-intert"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-primary block mb-1.5 flex items-center gap-1.5">
            <Tag size={13} className="text-muted" />
            <span>Vessel Type</span>
          </label>
          <input type="hidden" name="vesselType" value={vesselType} />
          <Select
            size="sm"
            value={vesselType}
            onChange={setVesselType}
            options={VESSEL_TYPES}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-primary block mb-1.5 flex items-center gap-1.5">
            <MapPin size={13} className="text-muted" />
            <span>Home Port / Landing Centre</span>
          </label>
          <input
            name="homePort"
            type="text"
            defaultValue={data?.homePort || ""}
            key={data?.homePort || ""}
            placeholder="Kochi, Kerala"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-bg text-primary focus:outline-none focus:border-brand/50 transition-colors font-intert"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-primary block mb-1.5 flex items-center gap-1.5">
            <FileText size={13} className="text-muted" />
            <span>Registration / Licence No. (Optional)</span>
          </label>
          <input
            name="registrationId"
            type="text"
            defaultValue={data?.registrationId || ""}
            key={data?.registrationId || ""}
            placeholder="IND-KL-08214"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-bg text-primary focus:outline-none focus:border-brand/50 transition-colors uppercase font-mono"
          />
        </div>
      </div>
    </section>
  );
}
