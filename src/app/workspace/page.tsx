import React from "react";
import { Briefcase, CheckSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function WorkspacePlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-4">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
        <Briefcase className="h-8 w-8" />
      </div>
      <h2 className="font-heading text-lg font-bold text-text-primary">Workspace Hub</h2>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">
        Personal notes, calendars, and checklists task tools are scheduled for Sprint 3.
      </p>
      <Card className="mt-4 max-w-xs border-dashed">
        <CardContent className="p-4 flex items-center gap-3 text-left">
          <CheckSquare className="h-5 w-5 text-secondary shrink-0" />
          <span className="text-[11px] text-text-muted leading-relaxed">
            Sprint 3 will deliver markdown document creation and event calendar triggers.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
