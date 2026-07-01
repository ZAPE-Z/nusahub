"use client";

import React, { useEffect, useRef } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeIn, slideUp } from "@/lib/animations";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDestroy?: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxHeight?: string;
  showCloseButton?: boolean;
  className?: string;
  closeOnBackdropClick?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  onDestroy,
  title,
  children,
  maxHeight = "max-h-[85vh]",
  showCloseButton = true,
  className,
  closeOnBackdropClick = true,
}: BottomSheetProps) {
  const controls = useAnimation();
  const backdropRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Track and restore focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        const focusable = sheetRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          (focusable[0] as HTMLElement).focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
    return () => {
      if (isOpen && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // If dragged down past threshold (e.g. velocity is high or distance is > 100px)
    if (info.offset.y > 150 || info.velocity.y > 400) {
      onClose();
    } else {
      // Snap back to open state
      controls.start("visible");
    }
  };

  // Keyboard navigation focus trap
  const handleKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusable = sheetRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        ref={backdropRef}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-all"
      />

      {/* Bottom Sheet Drawer */}
      <motion.div
        ref={sheetRef}
        onKeyDown={handleKeyDownTrap}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        custom={maxHeight}
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0.1, bottom: 0.8 }}
        onDragEnd={handleDragEnd}
        onAnimationComplete={() => {
          if (!isOpen && onDestroy) {
            onDestroy();
          }
        }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 mx-auto flex flex-col rounded-t-[24px] border-t border-text-muted/10 bg-white p-4 shadow-2xl dark:bg-zinc-950 sm:max-w-lg md:max-w-xl",
          maxHeight,
          className
        )}
      >
        {/* Drag Handle Indicator */}
        <div className="w-full flex justify-center pb-2 cursor-grab active:cursor-grabbing">
          <div className="h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-800" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between pb-3 border-b border-text-muted/5">
            {title ? (
              typeof title === "string" ? (
                <h3 id="sheet-title" className="font-heading text-base font-bold text-text-primary dark:text-zinc-100">
                  {title}
                </h3>
              ) : (
                title
              )
            ) : (
              <div />
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                aria-label="Close sheet"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pt-4 scrollbar-thin">
          {children}
        </div>
      </motion.div>
    </>
  );
}
