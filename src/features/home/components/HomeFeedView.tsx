"use client";

import React from "react";
import { useHomeData } from "../hooks/useHomeData";
import { PostSkeleton } from "@/components/shared/Skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, ShoppingBag } from "lucide-react";
import { useToast } from "@/store/useToastStore";

export default function HomeFeedView() {
  const { posts, isLoadingPosts, likePost, refetchPosts } = useHomeData();
  const { toast } = useToast();

  const handleBuy = (title: string) => {
    toast("Order Initialized", `Added ${title} to checkout basket (Simulated)`, "success");
  };

  if (isLoadingPosts) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh] gap-4">
        <p className="text-sm text-text-muted">Welcome to NusaHub! Creator updates will load shortly.</p>
        <Button onClick={() => refetchPosts()}>Refresh Feed</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0">
            <Avatar className="h-10 w-10">
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
            
            {/* Embedded Product Card Reference Widget */}
            {post.productRef && (
              <div className="flex items-center gap-3 p-3 bg-background border border-text-muted/10 rounded-lg">
                {post.productRef.imageUrl && (
                  <img
                    src={post.productRef.imageUrl}
                    alt={post.productRef.title}
                    className="w-12 h-12 rounded object-cover"
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
                  className="flex items-center gap-1 h-8 text-[11px] px-2.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Buy</span>
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-0 border-t border-text-muted/5 flex items-center justify-start gap-4">
            <button
              onClick={() => likePost(post.id)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-secondary transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>{post.likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
