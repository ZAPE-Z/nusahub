import { Variants } from "framer-motion";

// Reusable transition definitions for consistency
export const TRANSITIONS = {
  smooth: { type: "tween", ease: "easeInOut", duration: 0.25 },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 20 },
  slowSpring: { type: "spring", stiffness: 200, damping: 25 },
  overlay: { duration: 0.2, ease: "easeOut" },
  sheet: { type: "spring", damping: 25, stiffness: 220 },
  dialog: { type: "spring", damping: 28, stiffness: 280 },
};

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: TRANSITIONS.smooth
  },
  exit: { 
    opacity: 0,
    transition: TRANSITIONS.smooth
  }
};

// Slide Up / Down (e.g., for bottom sheets, overlays)
export const slideUp: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: TRANSITIONS.sheet
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: TRANSITIONS.sheet
  }
};

export const slideDown: Variants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: TRANSITIONS.sheet
  },
  exit: { 
    y: "-100%", 
    opacity: 0,
    transition: TRANSITIONS.sheet
  }
};

// Slide In Left / Right (e.g., for slide-outs, drawer sidebars)
export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0, 
    transition: TRANSITIONS.spring
  },
  exit: { 
    x: "-100%", 
    transition: TRANSITIONS.spring
  }
};

export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0, 
    transition: TRANSITIONS.spring
  },
  exit: { 
    x: "100%", 
    transition: TRANSITIONS.spring
  }
};

// Dialog scale and fade animations
export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: TRANSITIONS.dialog
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: TRANSITIONS.dialog
  }
};

// Overlay background opacity animations
export const overlayBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: TRANSITIONS.overlay
  },
  exit: { 
    opacity: 0,
    transition: TRANSITIONS.overlay
  }
};

// Stagger parent container
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    }
  }
});

// Stagger child items
export const staggerItem: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: TRANSITIONS.spring
  }
};

// Card hover micro-animations
export const cardHover = {
  hover: {
    y: -4,
    boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.08)",
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },
  tap: { scale: 0.98 }
};

// Button tap/hover feedback
export const buttonPress = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};
