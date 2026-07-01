"use client";

import React from "react";
import { useAppStore, CapabilityStatus } from "@/store/useAppStore";
import { useWalletStore } from "@/store/walletStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useActivityStore } from "@/store/activityStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/store/useToastStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Wallet,
  Briefcase,
  ShoppingBag,
  Sparkles,
  Users,
  Code,
  CheckCircle,
  GraduationCap,
  Globe,
  History,
} from "lucide-react";

/**
 * Redesigned Profile page implementing the One Account Multi-Capability Dashboard.
 * In NusaHub, one single account holds multiple capabilities (Consumer, Merchant, etc.)
 * simultaneously, rather than switching profiles.
 */

export default function ProfileView() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const user = useAppStore((state) => mounted ? state.user : null);
  const { toast } = useToast();

  const balance = useWalletStore((state) => state.balance);
  const tasksCount = useWorkspaceStore((state) => state.tasks.length);
  const { logs } = useActivityStore();

  if (!mounted || !user) return null;

  const caps = user.capabilities;

  // Format capabilities array for rendering
  const capList = [
    { key: "consumer", label: "Consumer", status: caps.consumer, icon: Globe },
    { key: "merchant", label: "Merchant", status: caps.merchant, icon: ShoppingBag },
    { key: "creator", label: "Creator", status: caps.creator, icon: Sparkles },
    { key: "freelancer", label: "Freelancer", status: caps.freelancer, icon: Briefcase },
    { key: "mentor", label: "Mentor", status: caps.mentor, icon: GraduationCap },
    { key: "organization", label: "Organization", status: caps.organization, icon: Globe },
    { key: "community", label: "Community Owner", status: caps.community, icon: Users },
    { key: "developer", label: "Developer", status: caps.developer, icon: Code },
  ];

  const getStatusBadge = (status: CapabilityStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>Active</span>
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-text-muted bg-text-muted/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <span>Inactive</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary bg-secondary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <span>Soon</span>
          </span>
        );
    }
  };

  const handleOpenModule = (href: string, capLabel: string) => {
    toast("Redirecting", `Opening ${capLabel}...`, "default");
    router.push(href);
  };

  // Standardized Card Item layout list
  const dashboardCards = [
    {
      id: "wallet",
      title: "Wallet Dashboard",
      desc: "Simulate deposits, transfers, and transactions ledger.",
      status: "active" as CapabilityStatus,
      stat: `Rp ${balance.toLocaleString("id-ID")}`,
      btnLabel: "Open Wallet",
      href: "/wallet",
      icon: Wallet,
      color: "text-secondary border-secondary/15 bg-secondary/5",
    },
    {
      id: "workspace",
      title: "Workspace Hub",
      desc: "Check active workflow tasks and personal note document grids.",
      status: "active" as CapabilityStatus,
      stat: `${tasksCount} Active Tasks`,
      btnLabel: "Open Workspace",
      href: "/workspace",
      icon: Briefcase,
      color: "text-primary border-primary/15 bg-primary/5",
    },
    {
      id: "merchant",
      title: "Merchant Center",
      desc: "Manage catalogs inventory levels and ship incoming customer orders.",
      status: caps.merchant,
      stat: caps.merchant === "active" ? "12 Active Listings" : "Activate Capability",
      btnLabel: caps.merchant === "active" ? "Open Console" : "Activate Capability",
      href: "/merchant",
      icon: ShoppingBag,
      color: caps.merchant === "active" ? "text-secondary border-secondary/15 bg-secondary/5" : "text-text-muted/40 border-text-muted/10 bg-text-muted/5",
    },
    {
      id: "creator",
      title: "Creator Studio",
      desc: "Create creator updates posts and share illustration templates files.",
      status: caps.creator,
      stat: caps.creator === "active" ? "124 Followers • 4 Posts" : "Activate Capability",
      btnLabel: caps.creator === "active" ? "Open Studio" : "Activate Capability",
      href: "/creator",
      icon: Sparkles,
      color: caps.creator === "active" ? "text-primary border-primary/15 bg-primary/5" : "text-text-muted/40 border-text-muted/10 bg-text-muted/5",
    },
    {
      id: "community",
      title: "Community Center",
      desc: "Connect Jaringan, manage groups channels, and coordinate members discussions.",
      status: caps.community,
      stat: caps.community === "active" ? "Connected" : "Activate Capability",
      btnLabel: caps.community === "active" ? "Open Center" : "Activate Capability",
      href: "/community",
      icon: Users,
      color: caps.community === "active" ? "text-primary border-primary/15 bg-primary/5" : "text-text-muted/40 border-text-muted/10 bg-text-muted/5",
    },
    {
      id: "developer",
      title: "Developer Center",
      desc: "Publish third-party sandboxed widgets Mini Apps and request API keys.",
      status: caps.developer,
      stat: caps.developer === "active" ? "2 Credentials Deployed" : "Activate Capability",
      btnLabel: caps.developer === "active" ? "Open Console" : "Activate Capability",
      href: "/developer",
      icon: Code,
      color: caps.developer === "active" ? "text-primary border-primary/15 bg-primary/5" : "text-text-muted/40 border-text-muted/10 bg-text-muted/5",
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background overflow-y-auto">
      
      {/* 1. Account Overview Header Block */}
      <Card className="overflow-hidden border border-text-muted/15 shadow-low">
        <CardContent className="p-5 flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-primary/20 shrink-0 shadow-low">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-heading text-base font-bold text-text-primary truncate">
                {user.name}
              </h2>
              {user.verificationStatus === "verified" && (
                <span title="Verified Account">
                  <CheckCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted truncate">@{user.handle}</p>
            <p className="text-[10px] text-text-muted/70 truncate mt-1">Email: {user.email}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block bg-background px-2 py-1 rounded border border-text-muted/5 shadow-low">
              ID: {user.id}
            </span>
            <span className="text-[9px] text-text-muted/60 block mt-1">
              Member since {user.joinedDate || "July 2026"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Account Capabilities Status Badge Grid */}
      <Card className="border border-text-muted/15 shadow-low">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-text-muted/10 pb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Account Capabilities Status
            </span>
            <span className="text-[10px] text-text-muted/60">One Account • Multiple Capabilities</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {capList.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.key}
                  className="flex flex-col justify-between p-3 rounded-lg bg-surface border border-text-muted/10 shadow-low min-h-[70px] select-none hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-[11px] font-semibold text-text-primary truncate">
                      {cap.label}
                    </span>
                  </div>
                  <div className="mt-2.5 self-start">
                    {getStatusBadge(cap.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Standardized Profile Dashboard Card list */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider block px-1">
          Ecosystem Dashboard
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            const isCapActive = card.status === "active";
            
            return (
              <Card
                key={card.id}
                className={cn(
                  "border shadow-low flex flex-col justify-between p-4.5 min-h-[190px] transition-all",
                  isCapActive
                    ? "border-text-muted/15 bg-surface hover:border-primary/20"
                    : "border-text-muted/10 bg-background/60"
                )}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg border ${card.color} shrink-0`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h4 className="font-heading text-xs font-bold text-text-primary">
                        {card.title}
                      </h4>
                    </div>
                    {getStatusBadge(card.status)}
                  </div>

                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-text-muted/5 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-text-muted/60 uppercase tracking-wider block">
                      STATISTIC
                    </span>
                    <span className="font-bold text-xs text-primary block truncate max-w-[140px] mt-0.5">
                      {card.stat}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleOpenModule(card.href, card.title)}
                    disabled={!isCapActive}
                    className="h-8.5 text-[10px] px-3.5 font-bold shadow-low shrink-0"
                    variant={isCapActive ? "default" : "outline"}
                  >
                    {card.btnLabel}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Unified Activity Timeline Feed */}
      <Card className="border border-text-muted/15 shadow-low bg-surface">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-text-muted/10 pb-2.5">
            <div className="flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-primary" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Unified Activity Timeline
              </span>
            </div>
            <span className="text-[10px] text-text-muted/60">{logs.length} events logged</span>
          </div>

          <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-[11px] text-text-muted/50 text-center py-6">No recent account activities recorded.</p>
            ) : (
              logs.map((log) => {
                let LogIcon = History;
                let colorClass = "text-text-muted bg-text-muted/10";
                if (log.type === "wallet") { LogIcon = Wallet; colorClass = "text-secondary bg-secondary/10"; }
                else if (log.type === "workspace") { LogIcon = Briefcase; colorClass = "text-primary bg-primary/10"; }
                else if (log.type === "merchant") { LogIcon = ShoppingBag; colorClass = "text-secondary bg-secondary/10"; }
                else if (log.type === "creator") { LogIcon = Sparkles; colorClass = "text-primary bg-primary/10"; }
                else if (log.type === "community") { LogIcon = Users; colorClass = "text-primary bg-primary/10"; }
                else if (log.type === "developer") { LogIcon = Code; colorClass = "text-primary bg-primary/10"; }

                return (
                  <div key={log.id} className="flex gap-3 text-xs items-start p-2.5 hover:bg-background/40 rounded transition-all">
                    <div className={cn("p-1.5 rounded shrink-0", colorClass)}>
                      <LogIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary leading-relaxed break-words">{log.message}</p>
                      <span className="text-[9px] text-text-muted/60 block mt-0.5">{log.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
