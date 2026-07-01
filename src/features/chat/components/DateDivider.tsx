import React from "react";
import { formatFriendlyDate } from "@/lib/chat/dateFormatter";

interface DateDividerProps {
  dateString: string;
}

export default function DateDivider({ dateString }: DateDividerProps) {
  const label = formatFriendlyDate(dateString);
  
  return (
    <div className="flex items-center justify-center my-4 w-full">
      <div className="flex-1 h-[1px] bg-text-muted/10" />
      <span className="text-[10px] font-semibold text-text-muted px-3 bg-surface border border-text-muted/10 rounded-full py-0.5 shadow-low uppercase tracking-wider mx-2">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-text-muted/10" />
    </div>
  );
}
