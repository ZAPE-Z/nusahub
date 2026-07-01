"use client";

import React, { useState } from "react";
import { useHomeData } from "../hooks/useHomeData";
import { useFeedStore, Comment } from "@/store/feedStore";
import { useActivityStore } from "@/store/activityStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare, ShoppingBag, X, Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/store/useToastStore";


/**
 * Custom Comment Overlay Sheet defined at file-level to prevent component remounting
 * and losing input focus during typing.
 */
function CommentSheet({
  isOpen,
  onClose,
  postId,
  comments,
  onAddComment,
  onDeleteComment
}: {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
}) {
  const [commentInput, setCommentInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(commentInput);
    setCommentInput("");
  };

  return (
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl border-t border-text-muted/10 shadow-high z-50 p-5 pb-8 max-h-[80vh] overflow-y-auto flex flex-col"
          >
            <div className="flex justify-between items-center border-b border-text-muted/10 pb-3 mb-4 shrink-0">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Comments Thread</span>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-primary/10 text-text-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List of comments */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[150px]">
              {comments.length === 0 ? (
                <p className="text-xs text-text-muted/50 text-center py-8 font-medium">Be the first to comment on this post!</p>
              ) : (
                comments.map((comment) => {
                  const isOwnComment = comment.authorName === "Budi Santoso";
                  return (
                    <div key={comment.id} className="p-3 bg-background rounded-lg border border-text-muted/5 flex items-start justify-between gap-3">
                      <div className="flex gap-2.5">
                        <Avatar className="h-7 w-7 border border-primary/10">
                          {comment.avatarUrl && <AvatarImage src={comment.avatarUrl} />}
                          <AvatarFallback className="text-[10px]">{comment.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-xs font-bold text-text-primary block">{comment.authorName}</span>
                          <p className="text-[11px] text-text-primary leading-relaxed mt-0.5 whitespace-pre-wrap">{comment.text}</p>
                          <span className="text-[9px] text-text-muted/60 block mt-1">{comment.timestamp}</span>
                        </div>
                      </div>
                      {isOwnComment && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 rounded text-secondary hover:bg-secondary/10 shrink-0"
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
            <form onSubmit={handleSubmit} className="flex gap-2 bg-background p-2 border border-text-muted/15 rounded-lg shadow-low shrink-0">
              <Input
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="text-xs border-none focus-visible:ring-0 h-9"
              />
              <Button type="submit" className="h-9 text-xs font-bold px-3 shadow-low shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function HomeFeedView() {
  const { posts, likePost } = useHomeData();
  const { likedPostIds, addComment, deleteComment } = useFeedStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

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

  const handleAddComment = (postId: string, text: string) => {
    addComment(postId, "Budi Santoso", text);
    addLog("creator", `Commented on post ${postId}: "${text.substring(0, 20)}..."`);
    toast("Comment Added", "Your comment has been posted", "success");
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    deleteComment(postId, commentId);
    addLog("creator", `Deleted comment ${commentId} from post ${postId}`);
    toast("Comment Deleted", "Your comment has been deleted", "default");
  };

  const activePost = posts.find((p) => p.id === activeCommentPostId);

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const isLiked = likedPostIds.includes(post.id);
        return (
          <Card key={post.id} className="overflow-hidden border border-text-muted/15 shadow-low">
            <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0">
              <Avatar className="h-10 w-10 border border-primary/10">
                <AvatarImage src={post.avatarUrl} alt={post.creatorName} />
                <AvatarFallback>{post.creatorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm text-text-primary">{post.creatorName}</span>
                <span className="text-xs text-text-muted truncate">{post.creatorHandle} • {post.timestamp}</span>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 text-sm text-text-primary leading-relaxed space-y-3">
              <p>{post.content}</p>
              
              {post.productRef && (
                <div className="flex items-center gap-3 p-3 bg-background border border-text-muted/10 rounded-lg">
                  {post.productRef.imageUrl && (
                    <img
                      src={post.productRef.imageUrl}
                      alt={post.productRef.title}
                      className="w-12 h-12 rounded object-cover border border-text-muted/10"
                    />
                  )}
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-semibold text-xs text-text-primary truncate">
                      {post.productRef.title}
                    </span>
                    <span className="text-xs text-secondary font-medium mt-0.5">
                      Rp {post.productRef.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleBuy(post.productRef!.title)}
                    className="flex items-center gap-1 h-8 text-[11px] px-2.5 shadow-low animate-bounce-hover"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Buy</span>
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-text-muted/5 flex items-center justify-start gap-4">
              <button
                onClick={() => handleLikeToggle(post.id)}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors py-1 px-2 rounded-md hover:bg-primary/5",
                  isLiked ? "text-secondary font-bold" : "text-text-muted"
                )}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-secondary text-secondary")} />
                <span>{post.likeCount}</span>
              </button>
              
              <button
                onClick={() => setActiveCommentPostId(post.id)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-primary/5"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </button>
            </CardFooter>
          </Card>
        );
      })}

      {/* Unified comment sheet overlay */}
      {activePost && (
        <CommentSheet
          isOpen={!!activeCommentPostId}
          onClose={() => setActiveCommentPostId(null)}
          postId={activePost.id}
          comments={activePost.comments || []}
          onAddComment={(text) => handleAddComment(activePost.id, text)}
          onDeleteComment={(commentId) => handleDeleteComment(activePost.id, commentId)}
        />
      )}
    </div>
  );
}
