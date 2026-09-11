"use client";

import { Compass, LifeBuoy, CloudLightning, Wind } from "lucide-react";
import type { SuggestionItem } from "../../../../types";

const SUGGESTIONS: SuggestionItem[] = [
  {
    id: "1",
    icon: Wind,
    title: "Is it safe tomorrow?",
    subtitle: "Understand conditions for your boat",
    prompt: "Is it safe to go fishing tomorrow morning from Kochi?",
  },
  {
    id: "2",
    icon: Compass,
    title: "Where are the fish today?",
    subtitle: "Find a zone, spend less time searching",
    prompt: "Where is the fishing zone today and how far is it from my port?",
  },
  {
    id: "3",
    icon: CloudLightning,
    title: "Any warnings near my port?",
    subtitle: "Stay ahead of changing weather",
    prompt: "Are there any cyclone or storm warnings near my position?",
  },
  {
    id: "4",
    icon: LifeBuoy,
    title: "What is the wave outlook?",
    subtitle: "A little foresight before you set sail",
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
            className="card-interactive flex items-start gap-3 p-3.5 rounded-xl border border-border-subtle bg-surface shadow-xs hover:bg-surface-muted/70 hover:border-brand/30 text-left group cursor-pointer transition-all duration-200 active:scale-[0.98]"
          >
            <Icon
              size={18}
              className="text-muted group-hover:text-brand transition-colors shrink-0 mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-primary font-intert">
                {item.title}
              </p>
              <p className="text-[11px] text-muted font-intert mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
