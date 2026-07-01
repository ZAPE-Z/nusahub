"use client";

import React, { useState } from "react";
import { useCommunityStore, Community } from "@/store/communityStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  Plus,
  Check,
  MessageSquare,
  Pin,
  Send,
  Globe,
  Lock,
} from "lucide-react";

export default function CommunityView() {
  const { communities, joinedIds, posts, joinCommunity, leaveCommunity, addPost } = useCommunityStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"directory" | "feed">("directory");
  const [selectedComm, setSelectedComm] = useState<Community | null>(communities[0]);
  const [newPostText, setNewPostText] = useState("");

  const handleJoinToggle = (comm: Community) => {
    const isJoined = joinedIds.includes(comm.id);
    if (isJoined) {
      leaveCommunity(comm.id);
      addLog("community", `Left community group: "${comm.name}"`);
      toast("Left Community", `You left "${comm.name}"`, "default");
    } else {
      joinCommunity(comm.id);
      addLog("community", `Joined community group: "${comm.name}"`);
      toast("Joined Community", `Welcome to "${comm.name}"!`, "success");
    }
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !selectedComm) return;

    addPost(selectedComm.id, "Budi Santoso", newPostText);
    addLog("community", `Posted discussion in "${selectedComm.name}"`);
    toast("Discussion Posted", "Added comment to thread", "success");
    setNewPostText("");
  };

  // Filter lists
  const joinedCommunities = communities.filter((c) => joinedIds.includes(c.id));
  const trendingCommunities = communities.filter((c) => !joinedIds.includes(c.id));

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Community Center</h2>
          <p className="text-[11px] text-text-muted">Join local MSME business groups and collaborate</p>
        </div>
        <Users className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-surface border border-text-muted/10 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("directory")}
          className={cn(
            "text-[10px] font-bold py-1.5 rounded-md uppercase tracking-wider transition-all",
            activeTab === "directory" ? "bg-primary text-white" : "text-text-muted hover:bg-primary/5"
          )}
        >
          Group Directory
        </button>
        <button
          onClick={() => setActiveTab("feed")}
          className={cn(
            "text-[10px] font-bold py-1.5 rounded-md uppercase tracking-wider transition-all",
            activeTab === "feed" ? "bg-primary text-white" : "text-text-muted hover:bg-primary/5"
          )}
        >
          Group Chat & Feed
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: GROUP DIRECTORY */}
        {activeTab === "directory" && (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Joined list */}
            {joinedCommunities.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block px-0.5">
                  Joined Communities ({joinedCommunities.length})
                </span>
                
                <div className="space-y-2">
                  {joinedCommunities.map((comm) => (
                    <Card
                      key={comm.id}
                      onClick={() => {
                        setSelectedComm(comm);
                        setActiveTab("feed");
                      }}
                      className="border border-text-muted/15 bg-surface hover:border-primary/20 transition-all p-3.5 flex justify-between items-center shadow-low cursor-pointer"
                    >
                      <div className="min-w-0 pr-4">
                        <h4 className="font-bold text-xs text-text-primary truncate">{comm.name}</h4>
                        <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed mt-0.5">{comm.description}</p>
                        <span className="text-[9px] text-primary/80 font-bold block mt-1.5">{comm.memberCount} Members</span>
                      </div>
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinToggle(comm);
                        }}
                        variant="outline"
                        className="h-8 text-[9px] px-2.5 font-bold border-success text-success bg-success/5 hover:bg-success/10 shrink-0"
                      >
                        <Check className="h-3 w-3 mr-0.5" />
                        <span>Joined</span>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Trending & Recommendations */}
            {trendingCommunities.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block px-0.5">
                  Recommended to Join
                </span>
                
                <div className="space-y-2">
                  {trendingCommunities.map((comm) => (
                    <Card
                      key={comm.id}
                      className="border border-text-muted/10 bg-surface/50 p-3.5 flex justify-between items-center shadow-low"
                    >
                      <div className="min-w-0 pr-4">
                        <h4 className="font-bold text-xs text-text-primary truncate">{comm.name}</h4>
                        <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed mt-0.5">{comm.description}</p>
                        <span className="text-[9px] text-text-muted/80 font-bold block mt-1.5">{comm.memberCount} Members</span>
                      </div>
                      
                      <Button
                        onClick={() => handleJoinToggle(comm)}
                        className="h-8 text-[9px] px-2.5 font-bold shrink-0 shadow-low"
                      >
                        <Plus className="h-3 w-3 mr-0.5" />
                        <span>Join</span>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: DISCUSSION DISCUSSION FEED */}
        {activeTab === "feed" && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Group selector */}
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-text-muted font-bold uppercase shrink-0">Active Room:</span>
              <select
                value={selectedComm?.id || ""}
                onChange={(e) => {
                  const matched = communities.find((c) => c.id === e.target.value);
                  setSelectedComm(matched || null);
                }}
                className="flex-1 h-9 rounded-md border border-text-muted/15 bg-surface text-xs px-2.5 focus-visible:ring-primary text-text-primary font-bold"
              >
                {joinedCommunities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {joinedCommunities.length === 0 && (
                  <option value="">-- Join a group first --</option>
                )}
              </select>
            </div>

            {selectedComm && joinedIds.includes(selectedComm.id) ? (
              <div className="space-y-4">
                
                {/* Pinned Post */}
                <Card className="border border-secondary/20 bg-secondary/5 p-3.5 shadow-low flex items-start gap-3">
                  <Pin className="h-4.5 w-4.5 text-secondary shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-wider block">Group Announcement Pinned</span>
                    <p className="text-xs font-semibold text-text-primary">Welcome to the group chat directory!</p>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                      Let us keep conversations focused on local business supplies and order checkout systems.
                    </p>
                  </div>
                </Card>

                {/* Composer Form */}
                <form onSubmit={handleAddPost} className="flex gap-2 bg-surface p-2 border border-text-muted/15 rounded-lg shadow-low">
                  <Input
                    required
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={`Message inside ${selectedComm.name}...`}
                    className="text-xs border-none focus-visible:ring-0 h-9"
                  />
                  <Button type="submit" className="h-9 text-xs font-bold px-3 shadow-low shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                {/* Message items list */}
                <div className="space-y-3">
                  {posts.filter(p => p.communityId === selectedComm.id).map((p) => (
                    <Card key={p.id} className="border border-text-muted/10 bg-surface shadow-low p-3.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-text-primary block">{p.authorName}</span>
                        <span className="text-[9px] text-text-muted">{p.timestamp}</span>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed mt-1.5">{p.text}</p>
                    </Card>
                  ))}
                </div>

              </div>
            ) : (
              <div className="p-12 text-center border border-dashed rounded-lg text-text-muted text-xs flex flex-col items-center justify-center gap-3">
                <Lock className="h-8 w-8 text-text-muted/40 animate-pulse" />
                <p>Join this community to view discussions and chat with members.</p>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
