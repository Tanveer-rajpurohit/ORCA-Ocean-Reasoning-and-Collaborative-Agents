"use client";

import { Compass, LifeBuoy, CloudLightning, Wind } from "lucide-react";
import type { SuggestionItem } from "../../../../types";

const SUGGESTIONS: SuggestionItem[] = [
  {
    id: "1",
    icon: Wind,
    title: "Is it safe tomorrow?",
    subtitle: "Check if conditions suit your boat for an early start",
    prompt: "Is it safe to go fishing tomorrow morning from Kochi?",
  },
  {
    id: "2",
    icon: Compass,
    title: "Where are the fish?",
    subtitle: "Today's potential fishing zone and the run to it",
    prompt: "Where is the fishing zone today and how far is it from my port?",
  },
  {
    id: "3",
    icon: CloudLightning,
    title: "Any warnings near me?",
    subtitle: "Cyclone, squall, and lightning activity for your sector",
    prompt: "Are there any cyclone or storm warnings near my position?",
  },
  {
    id: "4",
    icon: LifeBuoy,
    title: "Wave outlook",
    subtitle: "Sea state for the next few days before you plan",
    prompt: "What will the wave height be over the next three days?",
  },
];

interface ChatSuggestionsProps {
  onSelect: (prompt: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full font-intert">
      {SUGGESTIONS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.prompt)}
            className="card-interactive flex items-start gap-3 p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-muted/70 hover:border-brand/30 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-muted group-hover:bg-brand/15 text-muted group-hover:text-brand flex items-center justify-center shrink-0 transition-colors">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-primary font-intert truncate">
                {item.title}
              </p>
              <p className="text-xs text-muted font-intert line-clamp-1 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
