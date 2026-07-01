"use client";

import React, { useState } from "react";
import { useDeveloperStore } from "@/store/developerStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Code,
  Terminal,
  Layers,
  Plus,
  Lock,
  Play,
  RotateCw,
  X,
  History,
} from "lucide-react";

// Custom inline Dialog overlay
const CustomDialog = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black z-50 transition-opacity"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 bg-surface rounded-xl border border-text-muted/10 shadow-high z-50 p-5 w-[90%] max-w-sm"
        >
          <div className="flex justify-between items-center border-b border-text-muted/10 pb-3 mb-4">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{title}</span>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-primary/10 text-text-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function DeveloperView() {
  const { apiKeys, miniApps, logs, generateApiKey, regenerateApiKey, revokeApiKey, publishMiniApp, addLog } = useDeveloperStore();
  const { addLog: addGlobalLog } = useActivityStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"keys" | "apps" | "logs">("keys");

  // Dialog forms state
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const [isAppDialogOpen, setIsAppDialogOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDesc, setAppDesc] = useState("");
  const [appUrl, setAppUrl] = useState("");

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    generateApiKey(newKeyName);
    addGlobalLog("developer", `Generated API credential client: "${newKeyName}"`);
    toast("API Key Generated", `"${newKeyName}" credential created successfully`, "success");
    
    setNewKeyName("");
    setIsKeyDialogOpen(false);
  };

  const handleRegenerateKey = (id: string, name: string) => {
    if (confirm(`Regenerate API credential token for "${name}"? Previous keys will become invalid.`)) {
      regenerateApiKey(id);
      addGlobalLog("developer", `Regenerated API credential tokens for: "${name}"`);
      toast("API Key Regenerated", `Credentials for "${name}" successfully updated!`, "success");
    }
  };

  const handleRevokeKey = (id: string, name: string) => {
    if (confirm(`Revoke API credential "${name}"?`)) {
      revokeApiKey(id);
      addGlobalLog("developer", `Revoked API credential client: "${name}"`);
      toast("API Key Revoked", `"${name}" deactivated`, "default");
    }
  };

  const handlePublishApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appDesc.trim() || !appUrl.trim()) {
      toast("Error", "Please fill in all mini app details", "error");
      return;
    }

    publishMiniApp({
      name: appName,
      description: appDesc,
      url: appUrl,
    });

    addGlobalLog("developer", `Registered sandboxed Mini App listing: "${appName}"`);
    toast("Mini App Published", `"${appName}" successfully deployed to Sandbox registry!`, "success");

    setAppName("");
    setAppDesc("");
    setAppUrl("");
    setIsAppDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Developer Console</h2>
          <p className="text-[11px] text-text-muted">Register custom sandboxed widgets, deploy APIs, and inspect logs</p>
        </div>
        <Code className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface border border-text-muted/10 p-1 rounded-lg">
        {[
          { id: "keys", label: "Credentials" },
          { id: "apps", label: "Mini Apps" },
          { id: "logs", label: "Sandbox Logs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "text-[10px] font-bold py-1.5 rounded-md uppercase tracking-wider transition-all",
              activeTab === tab.id
                ? "bg-primary text-white shadow-low"
                : "text-text-muted hover:bg-primary/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {activeTab === "keys" && (
          <motion.div
            key="keys"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                API Client Credentials
              </span>
              <Button onClick={() => setIsKeyDialogOpen(true)} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-low">
                <Plus className="h-3.5 w-3.5" />
                <span>Generate Credentials</span>
              </Button>
            </div>

            <div className="space-y-3">
              {apiKeys.map((k) => (
                <Card key={k.id} className="border border-text-muted/15 shadow-low p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-text-muted/5 pb-2">
                    <div className="min-w-0 pr-4">
                      <h4 className="font-bold text-xs text-text-primary truncate">{k.name}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">Created: {k.created}</p>
                    </div>
                    {k.status === "active" ? (
                      <span className="text-[9px] font-bold text-success bg-success/15 border border-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-text-muted bg-text-muted/15 border border-text-muted/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Revoked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs bg-background/50 border border-text-muted/10 p-2.5 rounded font-mono select-all">
                    <span className="truncate">{k.key}</span>
                    <Lock className="h-3.5 w-3.5 text-text-muted/40 shrink-0" />
                  </div>

                  {k.status === "active" && (
                    <div className="flex gap-2.5 mt-2">
                      <Button
                        onClick={() => handleRegenerateKey(k.id, k.name)}
                        variant="outline"
                        className="flex-1 h-8 text-[9px] border-primary/20 text-primary hover:bg-primary/5 font-bold"
                      >
                        Regenerate Key
                      </Button>
                      <Button
                        onClick={() => handleRevokeKey(k.id, k.name)}
                        variant="outline"
                        className="flex-1 h-8 text-[9px] border-secondary text-secondary hover:bg-secondary/5 font-bold"
                      >
                        Revoke Client
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "apps" && (
          <motion.div
            key="apps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Custom Mini Apps Registry
              </span>
              <Button onClick={() => setIsAppDialogOpen(true)} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-low">
                <Plus className="h-3.5 w-3.5" />
                <span>Publish Mini App</span>
              </Button>
            </div>

            <div className="space-y-3">
              {miniApps.map((app) => (
                <Card key={app.id} className="border border-text-muted/15 shadow-low p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-text-primary truncate">{app.name}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5 truncate">{app.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-text-muted/5 pt-3">
                    <span className="text-[9px] font-bold bg-primary/10 border border-primary/15 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {app.status} Environment
                    </span>
                    <span className="text-[10px] text-text-muted">Deployed: {app.created}</span>
                  </div>

                  <Button
                    onClick={() => {
                      toast("Loading Frame", `Connecting sandbox iframe to ${app.url}...`, "default");
                    }}
                    className="w-full h-8.5 text-[10px] font-bold flex items-center justify-center gap-1 shadow-low mt-2"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Launch Sandbox Iframe</span>
                  </Button>
                </Card>
              ))}
            </div>

            {/* Sandbox Deployment History section */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-1.5 border-b border-text-muted/10 pb-2">
                <History className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Sandbox Deployment Registry & History
                </span>
              </div>
              <div className="space-y-2">
                {miniApps.map((app) => (
                  <div key={app.id} className="p-3 bg-surface border border-text-muted/10 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-text-primary block">{app.name} (v1.0.0-mock)</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">Created: {app.created} • Status: Deployed</span>
                    </div>
                    <span className="text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/15 uppercase tracking-wider">
                      sandbox
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "logs" && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3.5"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Compile & Runtime Logs
              </span>
              <button
                onClick={() => {
                  addLog(`Sandbox debugger manual re-compile triggered.`);
                  toast("Re-compiled", "Sandbox files validated successfully", "success");
                }}
                className="p-1 rounded hover:bg-primary/10 text-primary animate-spin-hover"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            <Card className="bg-zinc-950 text-emerald-400 border-zinc-800 shadow-high font-mono p-4 min-h-[220px] max-h-[350px] overflow-y-auto rounded-lg text-[10px] space-y-1">
              <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 mb-2 text-emerald-500 font-bold uppercase tracking-wider">
                <Terminal className="h-4 w-4" />
                <span>Nusa CLI Sandbox Debugger</span>
              </div>
              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-zinc-600 mr-2">&gt;&gt;</span>
                  {log}
                </div>
              ))}
            </Card>
          </motion.div>
        )}

      </AnimatePresence>

      <CustomDialog onClose={() => setIsKeyDialogOpen(false)} title="Generate API Key Credentials" isOpen={isKeyDialogOpen}>
        <form onSubmit={handleGenerateKey} className="space-y-3.5">
          <p className="text-[10px] text-text-muted">
            API Keys allow external developers widgets to securely bind with NusaHub mock ledgers.
          </p>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Client Credential Name</label>
            <Input
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Shipping Calculator Extension"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-low">
            Generate API Client Key
          </Button>
        </form>
      </CustomDialog>

      <CustomDialog onClose={() => setIsAppDialogOpen(false)} title="Publish Sandboxed Mini App" isOpen={isAppDialogOpen}>
        <form onSubmit={handlePublishApp} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">App Name</label>
            <Input
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. Courier Shipping Calculator"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Short Description</label>
            <Input
              required
              value={appDesc}
              onChange={(e) => setAppDesc(e.target.value)}
              placeholder="Brief summary..."
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Sandbox Frame URL</label>
            <Input
              required
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://example.com/widget"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-low">
            Register & Deploys App
          </Button>
        </form>
      </CustomDialog>

    </div>
  );
}
