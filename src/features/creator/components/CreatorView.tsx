"use client";

import React, { useState } from "react";
import { useCreatorStore, DigitalProduct } from "@/store/creatorStore";
import { useFeedStore } from "@/store/feedStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import {
  DashboardCard,
  StatCard,
  SearchBar,
  BottomSheet,
  ConfirmationDialog,
} from "@/components/shared";
import { AnimatePresence, motion } from "framer-motion";

export default function CreatorView() {
  const {
    followersCount,
    engagementRate,
    revenue,
    digitalProducts,
    addDigitalProduct,
    deleteDigitalProduct,
    addTip,
  } = useCreatorStore();
  const { addPost } = useFeedStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "assets" | "composer">("dashboard");

  // Post composer state
  const [postContent, setPostContent] = useState("");
  const [selectedProductRef, setSelectedProductRef] = useState<string | null>(null);

  // Digital product form state
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");

  // Search states for digital assets
  const [searchQuery, setSearchQuery] = useState("");

  // Delete confirmation states
  const [assetToDelete, setAssetToDelete] = useState<{ id: string; title: string } | null>(null);

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
    setIsProductSheetOpen(false);
  };

  const handleDeleteTrigger = (id: string, title: string) => {
    setAssetToDelete({ id, title });
  };

  const handleDeleteConfirm = () => {
    if (!assetToDelete) return;
    deleteDigitalProduct(assetToDelete.id);
    addLog("creator", `Deleted digital asset: "${assetToDelete.title}"`);
    toast("Deleted", `Asset "${assetToDelete.title}" removed`, "success");
    setAssetToDelete(null);
  };

  const filteredAssets = digitalProducts.filter((prod) =>
    prod.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-4 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">Creator Studio</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Post portfolio feed updates, sell assets, and view metrics</p>
        </div>
        <Sparkles className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-1 rounded-xl">
        {[
          { id: "dashboard", label: "Studio" },
          { id: "assets", label: "Assets" },
          { id: "composer", label: "Composer" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-2">
              <StatCard
                title="Followers"
                value={followersCount.toString()}
                icon={<Users className="h-4 w-4 text-zinc-650" />}
              />
              <StatCard
                title="Engagement"
                value={engagementRate}
                icon={<Flame className="h-4 w-4 text-rose-500" />}
              />
              <StatCard
                title="Total Tips"
                value={`Rp ${revenue.toLocaleString("id-ID")}`}
                icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
              />
            </div>

            {/* tipping support card composed in DashboardCard */}
            <DashboardCard title="Simulate Fan Tipping Support" subtitle="Simulate fans donating money to support portfolio work">
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[10000, 25000, 50000].map((amt) => (
                  <Button
                    key={amt}
                    onClick={() => {
                      addTip(amt);
                      addLog("creator", `Received fans tip: Rp ${amt.toLocaleString("id-ID")}`);
                      toast("Tip Received", `Simulated fan sent a Rp ${amt.toLocaleString("id-ID")} tip!`, "success");
                    }}
                    variant="outline"
                    className="h-8.5 text-[10px] font-bold border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-55"
                  >
                    + Rp {amt.toLocaleString("id-ID")}
                  </Button>
                ))}
              </div>
            </DashboardCard>

            {/* vector bundles explanation composed in DashboardCard */}
            <DashboardCard className="bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-zinc-150 text-zinc-800 dark:bg-zinc-850 dark:text-zinc-200 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Ecosystem Vector Bundles</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Compose posts and attach digital templates so consumers can purchase directly inside their feeds!
                  </p>
                </div>
              </div>
            </DashboardCard>
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
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Digital Assets Library ({filteredAssets.length})
              </span>
              <Button
                onClick={() => setIsProductSheetOpen(true)}
                className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-sm rounded-lg"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Digital Product</span>
              </Button>
            </div>

            {/* Search filter for digital assets */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search assets by title..."
            />

            {filteredAssets.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-zinc-200 rounded-xl text-zinc-450 text-xs dark:border-zinc-800">
                No digital assets match your filter query.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredAssets.map((prod) => (
                  <DashboardCard key={prod.id} className="p-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <FileCode className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-150">{prod.title}</h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Price: Rp {prod.price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider block">Downloads</span>
                        <span className="font-bold text-xs text-zinc-850 dark:text-zinc-200 block mt-0.5 flex items-center gap-1 justify-end">
                          <Download className="h-3 w-3" />
                          {prod.downloadsCount}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteTrigger(prod.id, prod.title)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-550 transition-all"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </DashboardCard>
                ))}
              </div>
            )}
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
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block px-0.5">
              Compose Creator Feed Update
            </span>

            <form onSubmit={handlePostSubmit} className="space-y-4 bg-white p-4 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl shadow-sm">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">What is on your mind?</label>
                <textarea
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share details about new vector set, design files, tips, or news..."
                  rows={4}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400/20 text-zinc-800 dark:text-zinc-200 leading-relaxed resize-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Attach Digital Product (Optional)</label>
                <select
                  value={selectedProductRef || ""}
                  onChange={(e) => setSelectedProductRef(e.target.value || null)}
                  className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs px-3 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 text-zinc-800 dark:text-zinc-250 font-bold"
                >
                  <option value="">-- No attachment --</option>
                  {digitalProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Rp {p.price.toLocaleString("id-ID")})
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full h-10 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm rounded-lg">
                <Send className="h-3.5 w-3.5" />
                <span>Publish to Home Feed</span>
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Product Register Sheet */}
      <BottomSheet
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        title="Register Premium Digital Asset"
      >
        <form onSubmit={handleProductSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Asset Name</label>
            <Input
              required
              value={newProdTitle}
              onChange={(e) => setNewProdTitle(e.target.value)}
              placeholder="e.g. Modern UI Wireframes Package"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Download Price (Rp)</label>
            <Input
              required
              type="number"
              value={newProdPrice}
              onChange={(e) => setNewProdPrice(e.target.value)}
              placeholder="e.g. 15000"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-sm rounded-lg">
            Register to Library
          </Button>
        </form>
      </BottomSheet>

      {/* Deletion Dialog */}
      {assetToDelete && (
        <ConfirmationDialog
          isOpen={!!assetToDelete}
          onClose={() => setAssetToDelete(null)}
          title="Delete Digital Asset"
          description={`Are you sure you want to delete "${assetToDelete.title}"? This asset will be permanently removed from your digital library.`}
          confirmLabel="Delete Asset"
          type="danger"
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
