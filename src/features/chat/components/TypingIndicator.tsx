"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TypingIndicator() {
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -6, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.2,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className="flex justify-start items-end gap-2 max-w-[70%] my-1">
      <div className="rounded-lg rounded-bl-sm p-3 bg-text-muted/10 text-text-primary shadow-low flex items-center justify-center gap-1 min-h-[36px]">
        <span className="text-xs text-text-muted mr-1">Typing</span>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dotVariants}
            animate="animate"
            className="w-1.5 h-1.5 bg-text-muted rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
