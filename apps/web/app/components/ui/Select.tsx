"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export type SelectSize = "xs" | "sm" | "md" | "lg";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  size?: SelectSize;
  leadingIcon?: LucideIcon;
  align?: "start" | "end";
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  "aria-label"?: string;
}

const TRIGGER_SIZE: Record<SelectSize, string> = {
  xs: "px-2.5 py-1.5 text-[11px] rounded-md gap-2",
  sm: "px-3 py-2 text-xs rounded-lg gap-2",
  md: "px-4 py-3 text-sm rounded-xl gap-3",
  lg: "px-4.5 py-3.5 text-[15px] rounded-xl gap-3",
};

const MENU_SIZE: Record<SelectSize, string> = {
  xs: "p-1 text-[11px] rounded-md max-h-44",
  sm: "p-1.5 text-xs rounded-lg max-h-48",
  md: "p-2 text-sm rounded-xl max-h-60",
  lg: "p-2.5 text-[15px] rounded-xl max-h-72",
};

const ITEM_SIZE: Record<SelectSize, string> = {
  xs: "px-2.5 py-1.5 rounded-sm",
  sm: "px-3 py-2 rounded-md",
  md: "px-3.5 py-2.5 rounded-lg",
  lg: "px-4 py-3 rounded-lg",
};

function normalize(options: (string | SelectOption)[]): SelectOption[] {
  return options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  size = "md",
  leadingIcon: LeadingIcon,
  align = "start",
  disabled = false,
  id,
  name,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  "aria-label": ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = normalize(options);
  const selected = items.find((item) => item.value === value);
  const displayLabel = selected?.label ?? value ?? placeholder;

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlighted(-1);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () =>
      document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen || highlighted < 0) return;
    const node = listRef.current?.children[highlighted];
    if (node instanceof HTMLElement) {
      node.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlighted]);

  const commit = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onChange(item.value);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setHighlighted(
          Math.max(
            0,
            items.findIndex((item) => item.value === value),
          ),
        );
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(highlighted);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between bg-surface border transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${TRIGGER_SIZE[size]} ${
          isOpen ? "border-brand ring-2 ring-brand" : "border-border"
        } ${value ? "text-primary" : "text-muted"} ${triggerClassName}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {LeadingIcon && (
            <LeadingIcon size={14} className="text-muted shrink-0" />
          )}
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          size={size === "xs" || size === "sm" ? 13 : 16}
          className={`text-muted shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          className={`absolute z-50 mt-1.5 min-w-full bg-surface border border-border shadow-lg shadow-black/5 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100 ${
            align === "end" ? "right-0" : "left-0"
          } ${MENU_SIZE[size]} ${menuClassName}`}
        >
          {items.map((item, index) => {
            const isSelected = item.value === value;
            const isHighlighted = index === highlighted;

            return (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={item.disabled}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => commit(index)}
                className={`w-full flex items-center justify-between gap-2 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${ITEM_SIZE[size]} ${
                  isSelected
                    ? "text-brand bg-brand/5 font-medium"
                    : isHighlighted
                      ? "text-primary bg-surface-muted"
                      : "text-primary"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  {item.description && (
                    <span className="block text-[10px] text-muted truncate mt-0.5">
                      {item.description}
                    </span>
                  )}
                </span>
                {isSelected && <Check size={13} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
