"use client";

import { create } from "zustand";
import type { VoiceOption } from "../types";

export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: "en-IN",
    name: "Prabhat",
    language: "English",
    native: "English",
    gender: "male",
    description: "Clear Indian English for official warnings and advisories.",
    previewText: "Today's sea is calm. Wave height is 1.4 metres. Safe to go out.",
    supported: true,
  },
  {
    id: "ml-IN",
    name: "Midhun",
    language: "Malayalam",
    native: "മലയാളം",
    gender: "male",
    description: "Natural Malayalam, tuned for coastal Kerala fishing terms.",
    previewText:
      "ഇന്ന് കടൽ ശാന്തമാണ്. തിരമാല 1.4 മീറ്റർ. പുറപ്പെടാം.",
    supported: true,
  },
  {
    id: "ta-IN",
    name: "Valluvar",
    language: "Tamil",
    native: "தமிழ்",
    gender: "male",
    description: "Steady Tamil voice for the Coromandel and Gulf of Mannar coast.",
    previewText:
      "இன்று கடல் அமைதியாக உள்ளது. அலை உயரம் 1.4 மீட்டர். புறப்படலாம்.",
    supported: true,
  },
  {
    id: "te-IN",
    name: "Mohan",
    language: "Telugu",
    native: "తెలుగు",
    gender: "male",
    description: "Clear Telugu for the Andhra and Odisha coastal belt.",
    previewText:
      "ఈ రోజు సముద్రం ప్రశాంతంగా ఉంది. అలల ఎత్తు 1.4 మీటర్లు. బయలుదేరవచ్చు.",
    supported: true,
  },
  {
    id: "hi-IN",
    name: "Madhur",
    language: "Hindi",
    native: "हिन्दी",
    gender: "male",
    description: "Conversational Hindi for advisories shared inland too.",
    previewText:
      "आज समुद्र शांत है। लहर की ऊंचाई 1.4 मीटर है। निकल सकते हैं।",
    supported: true,
  },
  {
    id: "bn-IN",
    name: "Bashkar",
    language: "Bengali",
    native: "বাংলা",
    gender: "male",
    description: "Bengali voice for the Sundarbans and Digha fishing fleet.",
    previewText: "আজ সমুদ্র শান্ত। ঢেউয়ের উচ্চতা ১.৪ মিটার। বেরোনো যাবে।",
    supported: true,
  },
  {
    id: "gu-IN",
    name: "Niranjan",
    language: "Gujarati",
    native: "ગુજરાતી",
    gender: "male",
    description: "Gujarati voice for the Saurashtra and Kutch coastline.",
    previewText:
      "આજે સમુદ્ર શાંત છે. મોજાની ઊંચાઈ 1.4 મીટર છે. નીકળી શકાય.",
    supported: true,
  },
  {
    id: "kn-IN",
    name: "Gagan",
    language: "Kannada",
    native: "ಕನ್ನಡ",
    gender: "male",
    description: "Kannada voice for the Karwar and Mangaluru coast.",
    previewText:
      "ಇಂದು ಸಮುದ್ರ ಶಾಂತವಾಗಿದೆ. ಅಲೆಯ ಎತ್ತರ 1.4 ಮೀಟರ್. ಹೊರಡಬಹುದು.",
    supported: true,
  },
  {
    id: "mr-IN",
    name: "Manohar",
    language: "Marathi",
    native: "मराठी",
    gender: "male",
    description: "Marathi voice for the Konkan fishing belt.",
    previewText: "आज समुद्र शांत आहे. लाटांची उंची 1.4 मीटर आहे. निघू शकतो.",
    supported: true,
  },
];

export const DEFAULT_VOICE_ID = "en-IN";

interface VoiceState {
  selectedVoice: string;
  setSelectedVoice: (voiceId: string) => void;
}

export const useVoiceStore = create<VoiceState>()((set) => ({
  selectedVoice: DEFAULT_VOICE_ID,
  setSelectedVoice: (voiceId) => set({ selectedVoice: voiceId }),
}));

export function findVoice(voiceId: string): VoiceOption | undefined {
  return AVAILABLE_VOICES.find((voice) => voice.id === voiceId);
}
