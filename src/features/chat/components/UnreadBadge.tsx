import React from "react";

interface UnreadBadgeProps {
  count: number;
}

export default function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <div className="h-5 min-w-5 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-low">
      {count > 99 ? "99+" : count}
    </div>
  );
}
