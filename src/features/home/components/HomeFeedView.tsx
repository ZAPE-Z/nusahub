"use client";

import React, { useState } from "react";
import { useHomeData } from "../hooks/useHomeData";
import { useFeedStore } from "@/store/feedStore";
import { useActivityStore, ActivityLog } from "@/store/activityStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Heart,
  MessageSquare,
  ShoppingBag,
  Trash2,
  Send,
  Wallet,
  Briefcase,
  Sparkles,
  Users,
  Code,
  Activity,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/store/useToastStore";
import {
  SearchBar,
  BottomSheet,
  EmptySearch,
  EmptyConversation,
} from "@/components/shared";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";

export default function HomeFeedView() {
  const { posts, likePost } = useHomeData();
  const { likedPostIds, addComment, deleteComment } = useFeedStore();
  const { logs, addLog, clearLogs } = useActivityStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"feed" | "timeline">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const handleBuy = (title: string) => {
    toast("Redirect to chat", `Opening chat thread with merchant selling ${title}...`, "default");
  };

  const handleLikeToggle = (postId: string) => {
    const isLiked = likedPostIds.includes(postId);
    likePost(postId);
    
    // Log timeline
    addLog(
      "creator",
      isLiked ? `Removed like from post ${postId}` : `Liked post ${postId}`
    );
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeCommentPostId) return;

    addComment(activeCommentPostId, "Budi Santoso", commentInput);
    addLog("creator", `Commented on post ${activeCommentPostId}: "${commentInput.substring(0, 20)}..."`);
    toast("Comment Added", "Your comment has been posted", "success");
    setCommentInput("");
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    deleteComment(postId, commentId);
    addLog("creator", `Deleted comment ${commentId} from post ${postId}`);
    toast("Comment Deleted", "Your comment has been deleted", "default");
  };

  const activePost = posts.find((p) => p.id === activeCommentPostId);
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creatorHandle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "wallet":
        return <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "workspace":
        return <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case "merchant":
        return <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "creator":
        return <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
      case "community":
        return <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />;
      case "developer":
        return <Code className="h-4 w-4 text-zinc-650 dark:text-zinc-450" />;
      default:
        return <Activity className="h-4 w-4 text-zinc-500" />;
    }
  };

  const getActivityBg = (type: ActivityLog["type"]) => {
    switch (type) {
      case "wallet":
        return "bg-emerald-50 dark:bg-emerald-950/20";
      case "workspace":
        return "bg-indigo-50 dark:bg-indigo-950/20";
      case "merchant":
        return "bg-blue-50 dark:bg-blue-950/20";
      case "creator":
        return "bg-amber-50 dark:bg-amber-950/20";
      case "community":
        return "bg-pink-50 dark:bg-pink-950/20";
      case "developer":
        return "bg-zinc-100 dark:bg-zinc-900";
      default:
        return "bg-zinc-100 dark:bg-zinc-900";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <button
          onClick={() => setActiveTab("feed")}
          className={cn(
            "flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all uppercase tracking-wider",
            activeTab === "feed"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-400 hover:text-zinc-700 dark:text-zinc-550 dark:hover:text-zinc-300"
          )}
        >
          Social Feed
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={cn(
            "flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all uppercase tracking-wider",
            activeTab === "timeline"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-400 hover:text-zinc-700 dark:text-zinc-550 dark:hover:text-zinc-300"
          )}
        >
          Activity Timeline
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "feed" ? (
          <motion.div
            key="feed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            {/* Search inputs bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search posts or creators (press '/' to focus)..."
            />

            {filteredPosts.length === 0 ? (
              <EmptySearch
                title="No posts match search"
                description="We couldn't find any post content matching your filters. Try checking spelling or change terms."
                actionLabel="Clear Search Filter"
                onAction={() => setSearchQuery("")}
              />
            ) : (
              <motion.div
                variants={staggerContainer(0.05, 0)}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredPosts.map((post) => {
                  const isLiked = likedPostIds.includes(post.id);
                  return (
                    <motion.div variants={staggerItem} key={post.id}>
                      <Card className="overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0">
                          <Avatar className="h-10 w-10 border border-zinc-100 dark:border-zinc-900">
                            <AvatarImage src={post.avatarUrl} alt={post.creatorName} />
                            <AvatarFallback>{post.creatorName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col truncate">
                            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-50">{post.creatorName}</span>
                            <span className="text-[10px] text-zinc-450 truncate">{post.creatorHandle} • {post.timestamp}</span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-0 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3">
                          <p className="whitespace-pre-wrap">{post.content}</p>
                          
                          {post.productRef && (
                            <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800/80">
                              {post.productRef.imageUrl && (
                                <img
                                  src={post.productRef.imageUrl}
                                  alt={post.productRef.title}
                                  className="w-12 h-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                                />
                              )}
                              <div className="flex-1 flex flex-col min-w-0">
                                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                                  {post.productRef.title}
                                </span>
                                <span className="text-xs text-primary font-extrabold mt-0.5">
                                  Rp {post.productRef.price.toLocaleString("id-ID")}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleBuy(post.productRef!.title)}
                                className="flex items-center gap-1 h-8 text-[10px] px-3 font-semibold rounded-lg shadow-sm"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                <span>Buy</span>
                              </Button>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="p-3 pt-0 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-start gap-4 text-xs">
                          <button
                            onClick={() => handleLikeToggle(post.id)}
                            className={cn(
                              "flex items-center gap-1.5 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900",
                              isLiked ? "text-primary font-bold" : "text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-300"
                            )}
                          >
                            <Heart className={cn("h-4 w-4", isLiked && "fill-primary text-primary")} />
                            <span>{post.likeCount}</span>
                          </button>
                          
                          <button
                            onClick={() => setActiveCommentPostId(post.id)}
                            className="flex items-center gap-1.5 text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.commentCount}</span>
                          </button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            {/* Timeline header actions */}
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-zinc-450 uppercase tracking-wider">System Event Ledger</span>
              {logs.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLogs}
                  className="h-7 text-[10px] px-2.5 flex items-center gap-1 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash className="h-3 w-3" />
                  <span>Clear Ledger</span>
                </Button>
              )}
            </div>

            {logs.length === 0 ? (
              <EmptyConversation
                title="Activity ledger is clean"
                description="Any modifications you perform across capabilities will show up chronologically here."
              />
            ) : (
              <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 pl-5 space-y-5">
                {logs.map((log) => (
                  <div key={log.id} className="relative">
                    {/* Circle marker with icon */}
                    <div
                      className={cn(
                        "absolute -left-[30px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white dark:border-zinc-950 shadow-sm",
                        getActivityBg(log.type)
                      )}
                    >
                      {getActivityIcon(log.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          {log.type} Activity
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-750 dark:text-zinc-300 font-medium">
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified comment BottomSheet */}
      <BottomSheet
        isOpen={!!activeCommentPostId}
        onClose={() => setActiveCommentPostId(null)}
        title={activePost ? `Comments Thread — ${activePost.creatorName}` : "Comments Thread"}
      >
        {activePost && (
          <div className="flex flex-col h-full min-h-[350px]">
            {/* List of comments */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
              {!activePost.comments || activePost.comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-450 dark:text-zinc-650">
                  <MessageSquare className="h-8 w-8 mb-2 stroke-1 animate-pulse" />
                  <p className="text-xs font-semibold">No comments yet</p>
                  <p className="text-[10px] max-w-xs mt-1">Be the first to share your thoughts on this post!</p>
                </div>
              ) : (
                activePost.comments.map((comment) => {
                  const isOwnComment = comment.authorName === "Budi Santoso";
                  return (
                    <div
                      key={comment.id}
                      className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800 flex items-start justify-between gap-3 animate-in fade-in"
                    >
                      <div className="flex gap-2.5">
                        <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-800">
                          {comment.avatarUrl && <AvatarImage src={comment.avatarUrl} />}
                          <AvatarFallback className="text-[10px] font-bold">{comment.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                            {comment.authorName}
                          </span>
                          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed mt-0.5 whitespace-pre-wrap">
                            {comment.text}
                          </p>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-1 font-mono">
                            {comment.timestamp}
                          </span>
                        </div>
                      </div>
                      {isOwnComment && (
                        <button
                          onClick={() => handleDeleteComment(activePost.id, comment.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment write form */}
            <form
              onSubmit={handleAddCommentSubmit}
              className="flex gap-2 bg-zinc-50 p-1.5 border border-zinc-200 rounded-xl shadow-inner dark:bg-zinc-900 dark:border-zinc-800 shrink-0 mt-auto sticky bottom-0"
            >
              <input
                required
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a public comment..."
                className="flex-1 bg-transparent px-3 text-xs text-zinc-900 placeholder-zinc-450 focus:outline-none dark:text-zinc-150 dark:placeholder-zinc-550"
              />
              <Button type="submit" size="sm" className="h-8 text-[10px] font-bold px-3 shrink-0 rounded-lg">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
