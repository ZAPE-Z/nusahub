import React from "react";
import { Bot, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AIPlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-4">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
        <Bot className="h-8 w-8" />
      </div>
      <h2 className="font-heading text-lg font-bold text-text-primary">Nusa AI Assistant</h2>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">
        System-level natural language prompt parsing is scheduled for Sprint 2.
      </p>
      <Card className="mt-4 max-w-xs border-dashed">
        <CardContent className="p-4 flex items-center gap-3 text-left">
          <Sparkles className="h-5 w-5 text-secondary shrink-0" />
          <span className="text-[11px] text-text-muted leading-relaxed">
            Sprint 2 will allow you to type prompts like "Pay 15,000 to Ibu Sri" to trigger mock actions.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
