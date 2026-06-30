import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-target",
          // Variant tokens
          variant === "default" && "bg-primary text-primary-foreground hover:opacity-90 shadow-low",
          variant === "outline" && "border border-primary bg-transparent text-primary hover:bg-primary/10",
          variant === "ghost" && "hover:bg-primary/10 text-text-primary",
          variant === "link" && "text-secondary underline-offset-4 hover:underline bg-transparent",
          // Size tokens
          size === "default" && "h-12 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3 text-xs",
          size === "lg" && "h-14 rounded-md px-8 text-base",
          size === "icon" && "h-12 w-12",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
