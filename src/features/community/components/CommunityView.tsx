"use client";

import React, { useState, useMemo } from "react";
import { useCommunityStore, Community } from "@/store/communityStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Users,
  Plus,
  Check,
  Pin,
  Send,
  Lock,
} from "lucide-react";
import {
  DashboardCard,
  SearchBar,
  EmptyCommunity,
} from "@/components/shared";
import { AnimatePresence, motion } from "framer-motion";

export default function CommunityView() {
  const communities = useCommunityStore((state) => state.communities);
  const joinedIds = useCommunityStore((state) => state.joinedIds);
  const posts = useCommunityStore((state) => state.posts);
  const joinCommunity = useCommunityStore((state) => state.joinCommunity);
  const leaveCommunity = useCommunityStore((state) => state.leaveCommunity);
  const addPost = useCommunityStore((state) => state.addPost);

  const addLog = useActivityStore((state) => state.addLog);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"directory" | "feed">("directory");
  const [selectedComm, setSelectedComm] = useState<Community | null>(communities[0]);
  const [newPostText, setNewPostText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      // Select it automatically
      setSelectedComm(comm);
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

  // Filter lists based on SearchBar input
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredCommunities = useMemo(() => {
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [communities, debouncedSearchQuery]);

  const joinedCommunities = useMemo(() => {
    return filteredCommunities.filter((c) => joinedIds.includes(c.id));
  }, [filteredCommunities, joinedIds]);

  const trendingCommunities = useMemo(() => {
    return filteredCommunities.filter((c) => !joinedIds.includes(c.id));
  }, [filteredCommunities, joinedIds]);

  // Actual joined list for Chat select dropdown (unfiltered by search query)
  const actualJoinedCommunities = useMemo(() => {
    return communities.filter((c) => joinedIds.includes(c.id));
  }, [communities, joinedIds]);

  return (
    <div className="flex flex-col gap-5 p-4 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">Community Center</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Join local MSME business groups and collaborate</p>
        </div>
        <Users className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-1 rounded-xl">
        <button
          onClick={() => {
            setActiveTab("directory");
            setSearchQuery("");
          }}
          className={cn(
            "text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all",
            activeTab === "directory"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          )}
        >
          Group Directory
        </button>
        <button
          onClick={() => {
            setActiveTab("feed");
            setSearchQuery("");
          }}
          className={cn(
            "text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all",
            activeTab === "feed"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
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
            {/* Search Input */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search groups by name or topic..."
            />

            {filteredCommunities.length === 0 ? (
              <EmptyCommunity
                title="No communities found"
                description="We couldn't find any groups matching your query. Try a different search term or register a new one."
                actionLabel="Clear Filter"
                onAction={() => setSearchQuery("")}
              />
            ) : (
              <>
                {/* Joined list */}
                {joinedCommunities.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider block px-0.5">
                      Joined Communities ({joinedCommunities.length})
                    </span>
                    
                    <div className="space-y-2">
                      {joinedCommunities.map((comm) => (
                        <DashboardCard
                          key={comm.id}
                          onClick={() => {
                            setSelectedComm(comm);
                            setActiveTab("feed");
                          }}
                          interactive
                          title={comm.name}
                          action={
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinToggle(comm);
                              }}
                              variant="outline"
                              className="h-7 text-[9px] px-2.5 font-bold border-emerald-500/30 text-emerald-600 bg-emerald-50/10 hover:bg-emerald-50 dark:border-emerald-800/40 dark:text-emerald-450 dark:hover:bg-emerald-950/20 shrink-0 rounded-lg"
                            >
                              <Check className="h-3 w-3 mr-0.5" />
                              <span>Joined</span>
                            </Button>
                          }
                          className="p-4"
                        >
                          <p className="text-[10px] text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-1">{comm.description}</p>
                          <span className="text-[9px] text-primary/80 font-bold block mt-2">{comm.memberCount} Members</span>
                        </DashboardCard>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending & Recommendations */}
                {trendingCommunities.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider block px-0.5">
                      Recommended to Join
                    </span>
                    
                    <div className="space-y-2">
                      {trendingCommunities.map((comm) => (
                        <DashboardCard
                          key={comm.id}
                          title={comm.name}
                          action={
                            <Button
                              onClick={() => handleJoinToggle(comm)}
                              className="h-7 text-[9px] px-2.5 font-bold shrink-0 shadow-sm rounded-lg"
                            >
                              <Plus className="h-3 w-3 mr-0.5" />
                              <span>Join</span>
                            </Button>
                          }
                          className="p-4"
                        >
                          <p className="text-[10px] text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-1">{comm.description}</p>
                          <span className="text-[9px] text-zinc-400 font-bold block mt-2">{comm.memberCount} Members</span>
                        </DashboardCard>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* TAB 2: DISCUSSION FEED */}
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
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase shrink-0">Active Room:</span>
              <select
                value={selectedComm?.id || ""}
                onChange={(e) => {
                  const matched = communities.find((c) => c.id === e.target.value);
                  setSelectedComm(matched || null);
                }}
                className="flex-1 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs px-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 text-zinc-800 dark:text-zinc-250 font-bold"
              >
                {actualJoinedCommunities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {actualJoinedCommunities.length === 0 && (
                  <option value="">-- Join a group first --</option>
                )}
              </select>
            </div>

            {selectedComm && joinedIds.includes(selectedComm.id) ? (
              <div className="space-y-4">
                {/* Pinned announcement composed in DashboardCard */}
                <DashboardCard
                  title={
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-450 uppercase tracking-wider block">
                      Group Announcement Pinned
                    </span>
                  }
                  icon={<Pin className="h-4 w-4 text-amber-500" />}
                  className="border-amber-250 bg-amber-50/10 dark:border-amber-900/30 dark:bg-amber-950/10 p-3.5"
                >
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">Welcome to the group chat directory!</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                    Let us keep conversations focused on local business supplies and order checkout systems.
                  </p>
                </DashboardCard>

                {/* Composer Form */}
                <form onSubmit={handleAddPost} className="flex gap-2 bg-zinc-50 p-1.5 border border-zinc-200 rounded-xl dark:bg-zinc-900 dark:border-zinc-800 shadow-inner">
                  <input
                    required
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={`Message inside ${selectedComm.name}...`}
                    className="flex-1 bg-transparent px-3 text-xs text-zinc-800 placeholder-zinc-450 focus:outline-none dark:text-zinc-150 dark:placeholder-zinc-550"
                  />
                  <Button type="submit" size="sm" className="h-8 text-[10px] font-bold px-3 shrink-0 rounded-lg">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>

                {/* Message items list composed in DashboardCard */}
                <div className="space-y-3">
                  {posts.filter(p => p.communityId === selectedComm.id).map((p) => (
                    <DashboardCard
                      key={p.id}
                      title={p.authorName}
                      action={<span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">{p.timestamp}</span>}
                      className="p-3.5"
                    >
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mt-1.5 whitespace-pre-wrap">{p.text}</p>
                    </DashboardCard>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6">
                <EmptyCommunity
                  title="Collaborative Room Locked"
                  description="Join this community group directory first to participate in threads, ask questions, or review posts."
                  actionLabel="Back to Directory"
                  onAction={() => setActiveTab("directory")}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
