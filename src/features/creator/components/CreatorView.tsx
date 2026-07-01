"use client";

import React, { useState } from "react";
import { useCreatorStore, DigitalProduct } from "@/store/creatorStore";
import { useFeedStore } from "@/store/feedStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Users,
  Award,
  DollarSign,
  PlusCircle,
  Trash2,
  Send,
  Download,
  Flame,
  FileCode,
  CheckCircle,
  X,
} from "lucide-react";

export default function CreatorView() {
  const { followersCount, engagementRate, revenue, digitalProducts, addDigitalProduct, deleteDigitalProduct, addTip } = useCreatorStore();
  const { addPost } = useFeedStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "assets" | "composer">("dashboard");

  // Post composer state
  const [postContent, setPostContent] = useState("");
  const [selectedProductRef, setSelectedProductRef] = useState<string | null>(null);

  // Digital product form state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      toast("Error", "Please write something before publishing", "error");
      return;
    }

    let productRefObj = undefined;
    if (selectedProductRef) {
      const matched = digitalProducts.find((p) => p.id === selectedProductRef);
      if (matched) {
        productRefObj = {
          id: matched.id,
          title: matched.title,
          price: matched.price,
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60",
        };
      }
    }

    addPost({
      creatorId: "user-1",
      creatorName: "Budi Santoso",
      creatorHandle: "@budi",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
      content: postContent,
      productRef: productRefObj,
    });

    addLog("creator", `Published new creator update: "${postContent.substring(0, 30)}..."`);
    toast("Post Published", "Shared to NusaHub Home Feed successfully!", "success");

    setPostContent("");
    setSelectedProductRef(null);
    setActiveTab("dashboard");
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProdPrice);
    if (!newProdTitle.trim() || isNaN(priceNum) || priceNum <= 0) {
      toast("Error", "Please input valid digital product details", "error");
      return;
    }

    addDigitalProduct({
      title: newProdTitle,
      price: priceNum,
    });

    addLog("creator", `Added new digital asset: "${newProdTitle}"`);
    toast("Asset Added", `"${newProdTitle}" catalogued in Digital Assets Library`, "success");

    setNewProdTitle("");
    setNewProdPrice("");
    setIsProductDialogOpen(false);
  };

  const handleDeleteAsset = (id: string, title: string) => {
    if (confirm(`Remove digital asset "${title}"?`)) {
      deleteDigitalProduct(id);
      addLog("creator", `Deleted digital asset: "${title}"`);
      toast("Deleted", `Asset "${title}" removed`, "success");
    }
  };

  // Custom Dialog
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
            initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-55%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-55%" }}
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

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Creator Studio</h2>
          <p className="text-[11px] text-text-muted">Post portfolio feed updates, sell assets, and view metrics</p>
        </div>
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface border border-text-muted/10 p-1 rounded-lg">
        {[
          { id: "dashboard", label: "Studio" },
          { id: "assets", label: "Assets" },
          { id: "composer", label: "Composer" },
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
        
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-2">
              {[
                { title: "Followers", val: followersCount.toString(), icon: Users },
                { title: "Engagement", val: engagementRate, icon: Flame },
                { title: "Total Tips", val: `Rp ${revenue.toLocaleString("id-ID")}`, icon: DollarSign },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card key={idx} className="border border-text-muted/15 shadow-low">
                    <CardContent className="p-3 text-center flex flex-col items-center gap-1.5">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider block">
                          {stat.title}
                        </span>
                        <span className="font-extrabold text-xs text-text-primary block mt-0.5 truncate">
                          {stat.val}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border border-text-muted/15 shadow-low">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4.5 w-4.5 text-secondary" />
                  <span className="text-xs font-bold text-text-primary">Simulate Fan Tipping Support</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Simulate fans donating money to support Budi&apos;s illustrations portfolio.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[10000, 25000, 50000].map((amt) => (
                    <Button
                      key={amt}
                      onClick={() => {
                        addTip(amt);
                        addLog("creator", `Received fans tip: Rp ${amt.toLocaleString("id-ID")}`);
                        toast("Tip Received", `Simulated fan sent a Rp ${amt.toLocaleString("id-ID")} tip!`, "success");
                      }}
                      variant="outline"
                      className="h-8.5 text-[10px] font-bold"
                    >
                      + Rp {amt.toLocaleString("id-ID")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-text-muted/15 bg-surface p-4 flex gap-3 shadow-low">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-text-primary">Ecosystem Vector Bundles</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Compose posts and attach digital templates so consumers can purchase directly inside their feeds!
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === "assets" && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Digital Assets Library
              </span>
              <Button onClick={() => setIsProductDialogOpen(true)} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-low">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Digital Product</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {digitalProducts.map((prod) => (
                <Card key={prod.id} className="border border-text-muted/15 shadow-low p-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <FileCode className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-text-primary">{prod.title}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">Price: Rp {prod.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[8px] text-text-muted uppercase font-bold tracking-wider block">Downloads</span>
                      <span className="font-bold text-xs text-text-primary block mt-0.5 flex items-center gap-1 justify-end">
                        <Download className="h-3 w-3" />
                        {prod.downloadsCount}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteAsset(prod.id, prod.title)}
                      className="p-1.5 rounded hover:bg-secondary/10 text-secondary transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "composer" && (
          <motion.div
            key="composer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block px-0.5">
              Compose Creator Feed Update
            </span>

            <form onSubmit={handlePostSubmit} className="space-y-4 bg-surface p-4 border border-text-muted/15 rounded-lg shadow-low">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-text-muted uppercase">What is on your mind?</label>
                <textarea
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share details about new vector set, design files, tips, or news..."
                  rows={4}
                  className="w-full text-xs p-2.5 rounded-md border border-text-muted/15 bg-background focus:outline-none focus:ring-1 focus:ring-primary text-text-primary leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-text-muted uppercase">Attach Digital Product (Optional)</label>
                <select
                  value={selectedProductRef || ""}
                  onChange={(e) => setSelectedProductRef(e.target.value || null)}
                  className="w-full h-10 rounded-md border border-text-muted/15 bg-background text-xs px-3 focus-visible:ring-primary text-text-primary font-bold"
                >
                  <option value="">-- No attachment --</option>
                  {digitalProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Rp {p.price.toLocaleString("id-ID")})
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full h-10 text-xs font-bold flex items-center justify-center gap-1.5 shadow-low">
                <Send className="h-3.5 w-3.5" />
                <span>Publish to Home Feed</span>
              </Button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>

      <CustomDialog onClose={() => setIsProductDialogOpen(false)} title="Register Premium Digital Asset" isOpen={isProductDialogOpen}>
        <form onSubmit={handleProductSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Asset Name</label>
            <Input
              required
              value={newProdTitle}
              onChange={(e) => setNewProdTitle(e.target.value)}
              placeholder="e.g. Modern UI Wireframes Package"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Download Price (Rp)</label>
            <Input
              required
              type="number"
              value={newProdPrice}
              onChange={(e) => setNewProdPrice(e.target.value)}
              placeholder="e.g. 15000"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-low">
            Register to Library
          </Button>
        </form>
      </CustomDialog>

    </div>
  );
}
