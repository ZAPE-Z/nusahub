import React from "react";
import { Grid, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MiniAppsPlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-4">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
        <Grid className="h-8 w-8" />
      </div>
      <h2 className="font-heading text-lg font-bold text-text-primary">Mini Apps Explorer</h2>
      <p className="text-xs text-text-muted max-w-xs leading-relaxed">
        Sandboxed iframe widget loading registries are scheduled for Sprint 3.
      </p>
      <Card className="mt-4 max-w-xs border-dashed">
        <CardContent className="p-4 flex items-center gap-3 text-left">
          <Layers className="h-5 w-5 text-secondary shrink-0" />
          <span className="text-[11px] text-text-muted leading-relaxed">
            Sprint 3 will enable launching lightweight custom calculators and tools inside mock runtimes.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
