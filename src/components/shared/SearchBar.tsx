"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X, SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  onFilterClick?: () => void;
  showFilter?: boolean;
  isSearching?: boolean;
  shortcutKey?: string; // e.g. '/' or 'k'
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  onSubmit,
  onFilterClick,
  showFilter = false,
  isSearching = false,
  shortcutKey = "/",
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Listen for keyboard shortcuts to focus input
  useEffect(() => {
    if (!shortcutKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus if target is body and shortcut key is pressed
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true");

      if (e.key === shortcutKey && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value);
    }
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex h-10 w-full items-center rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/40",
          isFocused && "border-zinc-400 bg-white ring-2 ring-zinc-500/10 dark:border-zinc-600 dark:bg-zinc-950 dark:ring-zinc-400/5"
        )}
      >
        {/* Search / Loading Icon */}
        <div className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-400 dark:text-zinc-500">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="ml-2 h-full w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-450 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
        />

        {/* Clear Button / Keyboard Shortcut Badge */}
        <div className="ml-2 flex items-center gap-1.5 shrink-0">
          {value ? (
            <button
              onClick={handleClear}
              aria-label="Clear search query"
              className="rounded-full p-0.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            shortcutKey && (
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 font-mono text-[9px] font-medium text-zinc-400 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500 sm:flex">
                {shortcutKey}
              </kbd>
            )
          )}
        </div>
      </div>

      {/* Filter Trigger Button Slot */}
      {showFilter && onFilterClick && (
        <button
          onClick={onFilterClick}
          aria-label="Toggle filters"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-450 dark:hover:bg-zinc-900 transition-colors"
          title="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
