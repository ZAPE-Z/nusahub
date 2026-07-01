import React from "react";
import { MessageSquareOff, SearchCode, WifiOff, AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyConversation({
  title = "No active conversations",
  description = "Tap a contact or use the quick action button to start chatting.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] gap-4">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
        <MessageSquareOff className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-base font-bold text-text-primary">{title}</h3>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2 text-xs h-9 px-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function EmptySearch({
  title = "No results found",
  description = "We couldn't find anything matching your search. Try checking for spelling errors or search for another term.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh] gap-4">
      <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-2">
        <SearchCode className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-base font-bold text-text-primary">{title}</h3>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="mt-2 text-xs h-9 px-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function NoInternet({
  title = "Network Disconnected",
  description = "Please check your internet connection or wifi settings and try refreshing.",
  actionLabel = "Retry Connection",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] gap-4">
      <div className="h-16 w-16 bg-error/10 rounded-full flex items-center justify-center text-error mb-2 animate-bounce">
        <WifiOff className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-base font-bold text-text-primary">{title}</h3>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="mt-2 text-xs h-9 px-4 flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}

export function SomethingWentWrong({
  title = "Something went wrong",
  description = "An unexpected error occurred during execution. Don't worry, your data is safe.",
  actionLabel = "Reload View",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] gap-4">
      <div className="h-16 w-16 bg-error/10 rounded-full flex items-center justify-center text-error mb-2">
        <AlertOctagon className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-base font-bold text-text-primary">{title}</h3>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="mt-2 text-xs h-9 px-4 flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
