export interface AIPreferences {
  help_with: string[];
  rule: string;
}

export const DEFAULT_AI_PREFS: AIPreferences = {
  help_with: ["Safety verdicts before departure", "Fishing zone guidance"],
  rule: "",
};

export interface LanguageOption {
  id: string;
  name: string;
  hint: string;
}

export interface AlertPreference {
  id: string;
  label: string;
  description: string;
}

export type VoiceGender = "male" | "female";

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  native: string;
  gender: VoiceGender;
  description: string;
  previewText: string;
  supported: boolean;
}

export type SpeechPlaybackStatus = "idle" | "loading" | "speaking";
