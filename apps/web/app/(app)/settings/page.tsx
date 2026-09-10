"use client";

import { useRouter } from "next/navigation";
import {
  LanguageSection,
  VoiceSection,
  AIPreferencesSection,
  AlertPreferencesSection,
  SessionSection,
} from "../../components/app/settings";
import { useAuth } from "../../../context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="w-full h-full overflow-y-auto font-intert">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-instrument text-primary tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-muted mt-1">
            Language, voice, agent behaviour, and hazard alerts.
          </p>
        </div>

        <div className="space-y-6">
          <LanguageSection />
          <VoiceSection />
          <AIPreferencesSection />
          <AlertPreferencesSection />
          <SessionSection onSignOut={handleSignOut} />
        </div>
      </div>
    </div>
  );
}
