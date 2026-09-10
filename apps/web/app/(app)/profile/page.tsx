"use client";

import { useState } from "react";
import { Check, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  ProfileAvatarSection,
  PersonalInfoSection,
  VesselDetailsSection,
} from "../../components/app/profile";
import { useAuth } from "../../../context/AuthContext";
import { useLocalStorageState } from "../../../hooks";
import type { ProfileData } from "../../../types";
import { DEFAULT_PROFILE } from "../../../types";
import {
  validateFullName,
  validatePhoneNumber,
  validateRegistrationId,
} from "../../../lib/validation/profileValidation";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useLocalStorageState<ProfileData>(
    "orca_profile",
    DEFAULT_PROFILE,
  );
  const [avatarUrl, setAvatarUrl] = useLocalStorageState<string | null>(
    "orca_avatar",
    null,
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleFormInput = () => {
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    const formData = new FormData(e.currentTarget);

    const fullName = (formData.get("fullName") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const vesselName = (formData.get("vesselName") as string) || "";
    const vesselType = (formData.get("vesselType") as string) || "";
    const homePort = (formData.get("homePort") as string) || "";
    const registrationId = (formData.get("registrationId") as string) || "";

    const nameError = validateFullName(fullName);
    if (nameError) {
      setGeneralError(nameError);
      return;
    }

    const phoneError = validatePhoneNumber(phone, false);
    if (phoneError) {
      setGeneralError(phoneError);
      return;
    }

    const registrationError = validateRegistrationId(registrationId);
    if (registrationError) {
      setGeneralError(registrationError);
      return;
    }

    setProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      home_port: homePort.trim() || DEFAULT_PROFILE.home_port,
      vessel_name: vesselName.trim(),
      vessel_type: vesselType || DEFAULT_PROFILE.vessel_type,
      registration_id: registrationId.trim().toUpperCase(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const fisherId = user?.id
    ? `FID_${user.id.slice(0, 8).toUpperCase()}`
    : "FID_9842019";

  const personalData = {
    fullName: profile.full_name,
    phone: profile.phone,
    email: user?.email || "",
  };

  const vesselData = {
    vesselName: profile.vessel_name,
    vesselType: profile.vessel_type,
    homePort: profile.home_port,
    registrationId: profile.registration_id,
  };

  return (
    <div className="w-full h-full overflow-y-auto font-intert">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {generalError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} onInput={handleFormInput} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  href="/settings"
                  className="text-xs text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft size={13} />
                  <span>Settings &amp; Profile</span>
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
                Profile
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Your identity, contact for hazard alerts, and vessel details.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
                  <Check size={14} />
                  <span>Profile Updated</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl btn-brand-solid text-xs font-medium flex items-center justify-center cursor-pointer shadow-xs"
              >
                <span>Save Profile</span>
              </button>
            </div>
          </div>

          <ProfileAvatarSection
            name={profile.full_name || "Fisher"}
            homePort={profile.home_port}
            fisherId={fisherId}
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
          />

          <PersonalInfoSection data={personalData} />

          <VesselDetailsSection data={vesselData} />
        </form>
      </div>
    </div>
  );
}
