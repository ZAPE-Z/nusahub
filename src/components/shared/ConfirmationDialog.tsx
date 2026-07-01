import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fadeIn, scaleIn } from "@/lib/animations";

export type DialogTheme = "default" | "danger" | "warning" | "success" | "info";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDestroy?: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  type?: DialogTheme;
  closeOnBackdropClick?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onDestroy,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  type = "default",
  closeOnBackdropClick = true,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track and restore focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Small timeout to allow animation and rendering to complete
      const timer = setTimeout(() => {
        const focusable = containerRef.current?.querySelectorAll(
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

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  // Prevent scrolling behind dialog
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

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirmation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard navigation focus trap
  const handleKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusable = containerRef.current?.querySelectorAll(
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

  const getThemeConfig = (theme: DialogTheme) => {
    switch (theme) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />,
          iconBg: "bg-red-100 dark:bg-red-950/40",
          confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700",
        };
      case "warning":
        return {
          icon: <AlertCircle className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
          iconBg: "bg-amber-100 dark:bg-amber-950/40",
          confirmBtnClass: "bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-500 dark:hover:bg-amber-600",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
          iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
          confirmBtnClass: "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700",
        };
      case "info":
        return {
          icon: <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
          iconBg: "bg-blue-100 dark:bg-blue-950/40",
          confirmBtnClass: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
        };
      default:
        return {
          icon: <Info className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />,
          iconBg: "bg-zinc-100 dark:bg-zinc-800",
          confirmBtnClass: "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200",
        };
    }
  };

  const themeConfig = getThemeConfig(type);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={closeOnBackdropClick && !isLoading ? onClose : undefined}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] transition-all"
      />

      {/* Dialog Frame Wrapper */}
      <div 
        onClick={closeOnBackdropClick && !isLoading ? onClose : undefined}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          ref={containerRef}
          onClick={(e) => e.stopPropagation()} // Stop click propagation to backdrop wrapper
          onKeyDown={handleKeyDownTrap}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-desc"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={() => {
            if (!isOpen && onDestroy) {
              onDestroy();
            }
          }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        >
          {/* Close button in top-right */}
          {!isLoading && (
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-start gap-4">
            {/* Theme visual icon */}
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", themeConfig.iconBg)}>
              {themeConfig.icon}
            </div>

            {/* Typography Content */}
            <div className="flex-1 space-y-2.5">
              <h3 id="dialog-title" className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                {title}
              </h3>
              <div id="dialog-desc" className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {description}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 h-9 font-medium text-xs rounded-lg"
            >
              {cancelLabel}
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn("px-4 py-2 h-9 font-medium text-xs rounded-lg flex items-center gap-1.5 min-w-[72px] justify-center transition-all", themeConfig.confirmBtnClass)}
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{confirmLabel}</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
