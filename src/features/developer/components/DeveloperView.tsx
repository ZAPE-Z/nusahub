"use client";

import React, { useState, useMemo } from "react";
import { useDeveloperStore } from "@/store/developerStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Code,
  Terminal,
  Layers,
  Plus,
  Lock,
  Play,
  RotateCw,
  History,
} from "lucide-react";
import {
  DashboardCard,
  SearchBar,
  EmptyDeveloper,
  BottomSheet,
  ConfirmationDialog,
} from "@/components/shared";
import { AnimatePresence, motion } from "framer-motion";

export default function DeveloperView() {
  const apiKeys = useDeveloperStore((state) => state.apiKeys);
  const miniApps = useDeveloperStore((state) => state.miniApps);
  const logs = useDeveloperStore((state) => state.logs);
  const generateApiKey = useDeveloperStore((state) => state.generateApiKey);
  const regenerateApiKey = useDeveloperStore((state) => state.regenerateApiKey);
  const revokeApiKey = useDeveloperStore((state) => state.revokeApiKey);
  const publishMiniApp = useDeveloperStore((state) => state.publishMiniApp);
  const addLog = useDeveloperStore((state) => state.addLog);

  const addGlobalLog = useActivityStore((state) => state.addLog);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"keys" | "apps" | "logs">("keys");

  // BottomSheet forms state
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const [isAppSheetOpen, setIsAppSheetOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDesc, setAppDesc] = useState("");
  const [appUrl, setAppUrl] = useState("");

  // Search filter query
  const [searchQuery, setSearchQuery] = useState("");

  // ConfirmationDialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "regenerate" | "revoke";
    keyId: string;
    keyName: string;
  } | null>(null);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    generateApiKey(newKeyName);
    addGlobalLog("developer", `Generated API credential client: "${newKeyName}"`);
    toast("API Key Generated", `"${newKeyName}" credential created successfully`, "success");

    setNewKeyName("");
    setIsKeySheetOpen(false);
  };

  const triggerRegenerateKey = (id: string, name: string) => {
    setConfirmDialog({ type: "regenerate", keyId: id, keyName: name });
  };

  const triggerRevokeKey = (id: string, name: string) => {
    setConfirmDialog({ type: "revoke", keyId: id, keyName: name });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog) return;

    const { type, keyId, keyName } = confirmDialog;
    if (type === "regenerate") {
      regenerateApiKey(keyId);
      addGlobalLog("developer", `Regenerated API credential tokens for: "${keyName}"`);
      toast("API Key Regenerated", `Credentials for "${keyName}" successfully updated!`, "success");
    } else {
      revokeApiKey(keyId);
      addGlobalLog("developer", `Revoked API credential client: "${keyName}"`);
      toast("API Key Revoked", `"${keyName}" deactivated`, "default");
    }

    setConfirmDialog(null);
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
    setIsAppSheetOpen(false);
  };

  // Search logic filters
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredKeys = useMemo(() => {
    return apiKeys.filter((k) =>
      k.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [apiKeys, debouncedSearchQuery]);

  const filteredApps = useMemo(() => {
    return miniApps.filter(
      (app) =>
        app.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [miniApps, debouncedSearchQuery]);

  return (
    <div className="flex flex-col gap-5 p-4 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">Developer Console</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Register custom sandboxed widgets, deploy APIs, and inspect logs</p>
        </div>
        <Code className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-1 rounded-xl">
        {[
          { id: "keys", label: "Credentials" },
          { id: "apps", label: "Mini Apps" },
          { id: "logs", label: "Sandbox Logs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchQuery("");
            }}
            className={cn(
              "text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all",
              activeTab === tab.id
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: API KEYS / CREDENTIALS */}
        {activeTab === "keys" && (
          <motion.div
            key="keys"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                API Client Credentials ({filteredKeys.length})
              </span>
              <Button
                onClick={() => setIsKeySheetOpen(true)}
                className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-sm rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Generate Credentials</span>
              </Button>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search API keys..."
            />

            {filteredKeys.length === 0 ? (
              <EmptyDeveloper
                title="No API Credentials"
                description="Any client application API access keys you register will appear here."
                actionLabel="Generate First Key"
                onAction={() => setIsKeySheetOpen(true)}
              />
            ) : (
              <div className="space-y-3">
                {filteredKeys.map((k) => (
                  <DashboardCard
                    key={k.id}
                    title={k.name}
                    action={
                      k.status === "active" ? (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-255 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900">
                          Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-zinc-450 bg-zinc-50 px-2 py-0.5 rounded-full uppercase border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-550 dark:border-zinc-800">
                          Revoked
                        </span>
                      )
                    }
                    className="p-4"
                  >
                    <p className="text-[10px] text-zinc-400 mt-0.5">Created: {k.created}</p>
                    
                    <div className="flex items-center justify-between text-xs bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl font-mono select-all mt-3 dark:bg-zinc-900/40 dark:border-zinc-800">
                      <span className="truncate pr-4 text-zinc-850 dark:text-zinc-200">{k.key}</span>
                      <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    </div>

                    {k.status === "active" && (
                      <div className="flex gap-2.5 mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                        <Button
                          onClick={() => triggerRegenerateKey(k.id, k.name)}
                          variant="outline"
                          className="flex-1 h-8 text-[9px] border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-350 dark:hover:bg-zinc-900 font-bold rounded-lg"
                        >
                          Regenerate Key
                        </Button>
                        <Button
                          onClick={() => triggerRevokeKey(k.id, k.name)}
                          variant="outline"
                          className="flex-1 h-8 text-[9px] border-rose-500/30 text-rose-550 hover:bg-rose-50/20 font-bold rounded-lg"
                        >
                          Revoke Client
                        </Button>
                      </div>
                    )}
                  </DashboardCard>
                ))}
              </div>
            )}
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
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Custom Mini Apps Registry ({filteredApps.length})
              </span>
              <Button
                onClick={() => setIsAppSheetOpen(true)}
                className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-sm rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Publish Mini App</span>
              </Button>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search Mini Apps..."
            />

            {filteredApps.length === 0 ? (
              <EmptyDeveloper
                title="No mini applications found"
                description="Register a new sandbox extension calculator to deploy custom capabilities."
                actionLabel="Publish App"
                onAction={() => setIsAppSheetOpen(true)}
              />
            ) : (
              <>
                <div className="space-y-3">
                  {filteredApps.map((app) => (
                    <DashboardCard key={app.id} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-50 border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 rounded-xl shrink-0">
                          <Layers className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-150 truncate">{app.name}</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{app.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs border-t border-zinc-100 dark:border-zinc-900 pt-3">
                        <span className="text-[9px] font-bold bg-zinc-50 border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {app.status} Environment
                        </span>
                        <span className="text-[10px] text-zinc-400">Deployed: {app.created}</span>
                      </div>

                      <Button
                        onClick={() => {
                          toast("Loading Frame", `Connecting sandbox iframe to ${app.url}...`, "default");
                        }}
                        className="w-full h-8.5 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm mt-2 rounded-lg"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Launch Sandbox Iframe</span>
                      </Button>
                    </DashboardCard>
                  ))}
                </div>

                {/* Sandbox Deployment History section */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                    <History className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                      Sandbox Deployment Registry & History
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {filteredApps.map((app) => (
                      <DashboardCard key={app.id} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-150 block">{app.name} (v1.0.0-mock)</span>
                          <span className="text-[9px] text-zinc-450 dark:text-zinc-550 block mt-0.5">Created: {app.created} • Status: Deployed</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250 uppercase dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900">
                          sandbox
                        </span>
                      </DashboardCard>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* TAB 3: RUNTIME LOGS */}
        {activeTab === "logs" && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3.5"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Compile & Runtime Logs
              </span>
              <button
                onClick={() => {
                  addLog(`Sandbox debugger manual re-compile triggered.`);
                  toast("Re-compiled", "Sandbox files validated successfully", "success");
                }}
                className="p-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                title="Recompile Sandbox"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            {/* Terminal log panel composed in DashboardCard */}
            <DashboardCard className="bg-zinc-950 text-emerald-400 border-zinc-900 shadow-lg font-mono p-4 min-h-[220px] max-h-[350px] overflow-y-auto rounded-xl">
              <div className="flex items-center gap-1.5 border-b border-zinc-850 pb-2 mb-2 text-emerald-500 font-bold uppercase tracking-wider text-[10px]">
                <Terminal className="h-4 w-4" />
                <span>Nusa CLI Sandbox Debugger</span>
              </div>
              <div className="space-y-1 text-[10px]">
                {logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-zinc-700 mr-2">&gt;&gt;</span>
                    {log}
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate API Key BottomSheet */}
      <BottomSheet
        isOpen={isKeySheetOpen}
        onClose={() => setIsKeySheetOpen(false)}
        title="Generate API Key Credentials"
      >
        <form onSubmit={handleGenerateKey} className="space-y-3.5">
          <p className="text-[10px] text-zinc-500">
            API Keys allow external developers widgets to securely bind with NusaHub mock ledgers.
          </p>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Client Credential Name</label>
            <Input
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Shipping Calculator Extension"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-sm rounded-lg">
            Generate API Client Key
          </Button>
        </form>
      </BottomSheet>

      {/* Publish Sandboxed Mini App BottomSheet */}
      <BottomSheet
        isOpen={isAppSheetOpen}
        onClose={() => setIsAppSheetOpen(false)}
        title="Publish Sandboxed Mini App"
      >
        <form onSubmit={handlePublishApp} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">App Name</label>
            <Input
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. Courier Shipping Calculator"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Short Description</label>
            <Input
              required
              value={appDesc}
              onChange={(e) => setAppDesc(e.target.value)}
              placeholder="Brief summary..."
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Sandbox Frame URL</label>
            <Input
              required
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://example.com/widget"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-sm rounded-lg">
            Register & Deploy App
          </Button>
        </form>
      </BottomSheet>

      {/* API Key credential ConfirmationDialog */}
      {confirmDialog && (
        <ConfirmationDialog
          isOpen={!!confirmDialog}
          onClose={() => setConfirmDialog(null)}
          title={confirmDialog.type === "regenerate" ? "Regenerate API Credentials" : "Revoke API Credentials"}
          description={
            confirmDialog.type === "regenerate"
              ? `Are you sure you want to regenerate API credential token for "${confirmDialog.keyName}"? All previous access token instances will immediately become invalid.`
              : `Are you sure you want to revoke API client key "${confirmDialog.keyName}"? This client application will no longer be allowed to communicate with NusaHub mock ledgers.`
          }
          confirmLabel={confirmDialog.type === "regenerate" ? "Regenerate" : "Revoke Client"}
          type={confirmDialog.type === "regenerate" ? "warning" : "danger"}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
