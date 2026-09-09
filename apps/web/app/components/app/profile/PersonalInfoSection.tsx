"use client";

import { User, Phone, Mail } from "lucide-react";

export interface PersonalInfoData {
  fullName?: string;
  phone?: string;
  email?: string;
}

interface PersonalInfoSectionProps {
  data?: PersonalInfoData;
}

export function PersonalInfoSection({ data }: PersonalInfoSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6 font-intert">
      <div className="mb-4 pb-3 border-b border-border">
        <h3 className="text-sm sm:text-base font-semibold text-primary">
          Personal &amp; Contact Details
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Used for account access and SMS hazard alerts at sea.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-primary block mb-1.5 flex items-center gap-1.5">
            <User size={13} className="text-muted" />
            <span>Full Name</span>
          </label>
          <input
            name="fullName"
            type="text"
            defaultValue={data?.fullName || ""}
            key={data?.fullName || ""}
            placeholder="e.g. Tanveer Singh"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-bg text-primary focus:outline-none focus:border-brand/50 transition-colors font-intert"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-primary flex items-center gap-1.5">
              <Phone size={13} className="text-muted" />
              <span>Mobile Number</span>
            </label>
            <span className="text-[10px] text-muted font-medium">
              Receives hazard SMS
            </span>
          </div>
          <input
            name="phone"
            type="tel"
            defaultValue={data?.phone || ""}
            key={data?.phone || ""}
            placeholder="+91 98460 12345"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-bg text-primary focus:outline-none focus:border-brand/50 transition-colors font-intert"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-primary flex items-center gap-1.5">
              <Mail size={13} className="text-muted" />
              <span>Email Address</span>
            </label>
            <span className="text-[10px] text-muted font-medium">
              Primary (Locked)
            </span>
          </div>
          <input
            type="email"
            defaultValue={data?.email || ""}
            key={data?.email || ""}
            readOnly
            disabled
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-surface-muted text-muted cursor-not-allowed font-intert"
          />
        </div>
      </div>
    </section>
  );
}
