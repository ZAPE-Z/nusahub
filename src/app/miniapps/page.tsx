"use client";

import React from "react";
import { useDeveloperStore } from "@/store/developerStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/store/useToastStore";
import { Grid, Layers, Play, Cpu } from "lucide-react";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

function MiniAppsExplorerView() {
  const { miniApps } = useDeveloperStore();
  const { toast } = useToast();

  const handleLaunchApp = (name: string, url: string) => {
    toast("Launching Widget", `Connecting sandbox iframe to: ${url}`, "success");
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Mini Apps Explorer</h2>
          <p className="text-[11px] text-text-muted">Launch lightweight sandboxed extensions and courier utilities</p>
        </div>
        <Grid className="h-5 w-5 text-primary animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {miniApps.map((app) => (
          <Card key={app.id} className="border border-text-muted/15 shadow-low bg-surface flex flex-col justify-between p-4 min-h-[140px]">
            <div className="space-y-1.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-xs text-text-primary">{app.name}</h4>
                </div>
                <span className="text-[8px] font-bold text-success bg-success/10 border border-success/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {app.status}
                </span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-text-muted/5 flex items-center justify-between">
              <span className="text-[9px] text-text-muted/60 font-mono">Host: {app.url.split("/")[2]}</span>
              
              <Button
                onClick={() => handleLaunchApp(app.name, app.url)}
                className="h-8 text-[10px] px-3 font-bold flex items-center gap-1 shadow-low"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Launch App</span>
              </Button>
            </div>
          </Card>
        ))}

        <Card className="border border-dashed border-text-muted/20 bg-background/50 flex flex-col justify-center items-center text-center p-6 min-h-[140px]">
          <Cpu className="h-6 w-6 text-text-muted/40 animate-pulse mb-2" />
          <h5 className="text-xs font-bold text-text-muted">Register Custom App</h5>
          <p className="text-[9px] text-text-muted/70 max-w-[180px] mt-1 leading-relaxed">
            Go to Profile &gt; Developer Center to deploy your own sandboxed widgets.
          </p>
        </Card>
      </div>

    </div>
  );
}

export default function MiniAppsPage() {
  return (
    <ErrorBoundary>
      <MiniAppsExplorerView />
    </ErrorBoundary>
  );
}
