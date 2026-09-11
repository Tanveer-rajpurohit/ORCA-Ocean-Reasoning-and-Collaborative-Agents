"use client";

import { MapPin } from "lucide-react";

interface LocationChipProps {
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export function LocationChip({ label, onClick, isLoading }: LocationChipProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-muted border border-border text-[11px] font-medium text-secondary hover:text-primary hover:bg-surface-muted transition-all cursor-pointer disabled:opacity-50"
    >
      <MapPin size={10} className="shrink-0" />
      <span className="truncate max-w-[120px]">{isLoading ? "Locating..." : label}</span>
    </button>
  );
}
