"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useMerchantStore, MerchantProduct } from "@/store/merchantStore";
import { useFeedStore } from "@/store/feedStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Percent,
  Plus,
  Edit2,
  Trash2,
  Truck,
  AlertTriangle,
  Award,
  Package,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import {
  DashboardCard,
  StatCard,
  SearchBar,
  ConfirmationDialog,
} from "@/components/shared";

// Inline Dialog for Adding/Editing products (specific to Merchant)
const CustomDialog = ({
  isOpen,
  onClose,
  title,
  children,
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
          className="fixed top-1/2 left-1/2 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 p-5 w-[90%] max-w-sm"
        >
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-950 pb-3 mb-4">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">{title}</span>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-405">
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function MerchantView() {
  const products = useMerchantStore((state) => state.products);
  const orders = useMerchantStore((state) => state.orders);
  const revenue = useMerchantStore((state) => state.revenue);
  const visitors = useMerchantStore((state) => state.visitors);
  const addProduct = useMerchantStore((state) => state.addProduct);
  const editProduct = useMerchantStore((state) => state.editProduct);
  const deleteProduct = useMerchantStore((state) => state.deleteProduct);
  const shipOrder = useMerchantStore((state) => state.shipOrder);

  const addPost = useFeedStore((state) => state.addPost);
  const addLog = useActivityStore((state) => state.addLog);
  const { toast } = useToast();

  // Tab control
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");

  // CRUD Dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MerchantProduct | null>(null);
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");

  // Search states for products
  const [searchQuery, setSearchQuery] = useState("");

  // Delete confirmation dialog states
  const [productToDelete, setProductToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdTitle("");
    setProdPrice("");
    setProdStock("");
    setProdImageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60");
    setIsProductDialogOpen(true);
  };

  const handleOpenEditProduct = (prod: MerchantProduct) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdPrice(prod.price.toString());
    setProdStock(prod.stock.toString());
    setProdImageUrl(prod.imageUrl || "");
    setIsProductDialogOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(prodPrice);
    const stockNum = parseInt(prodStock);

    if (!prodTitle.trim() || isNaN(priceNum) || isNaN(stockNum)) {
      toast("Error", "Please fill in valid details", "error");
      return;
    }

    if (editingProduct) {
      editProduct(editingProduct.id, {
        title: prodTitle,
        price: priceNum,
        stock: stockNum,
        imageUrl: prodImageUrl,
      });
      addLog("merchant", `Updated product listing: "${prodTitle}"`);
      toast("Success", "Product updated successfully", "success");
    } else {
      addProduct({
        title: prodTitle,
        price: priceNum,
        stock: stockNum,
        imageUrl: prodImageUrl,
      });
      
      // Dynamic Cross-Module Feed Posting Interaction:
      addPost({
        creatorId: "user-1",
        creatorName: "Budi Santoso",
        creatorHandle: "@budi",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
        content: `I just added a new item to my store: "${prodTitle}" for Rp ${priceNum.toLocaleString("id-ID")}. Fresh and premium quality guaranteed! Buy now directly below:`,
        productRef: {
          id: `new-${Date.now()}`,
          title: prodTitle,
          price: priceNum,
          imageUrl: prodImageUrl
        }
      });

      addLog("merchant", `Created new product listing: "${prodTitle}" & advertised to Feed`);
      toast("Listing Created", `"${prodTitle}" listed and shared to Feed!`, "success");
    }

    setIsProductDialogOpen(false);
  };

  const handleDeleteTrigger = (id: string, title: string) => {
    setProductToDelete({ id, title });
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    addLog("merchant", `Deleted product listing: "${productToDelete.title}"`);
    toast("Deleted", `Listing "${productToDelete.title}" removed`, "success");
    setProductToDelete(null);
  };

  const handleShipOrder = (id: string, customerName: string) => {
    shipOrder(id);
    addLog("merchant", `Shipped package for order ${id} to ${customerName}`);
    toast("Order Shipped", `Courier dispatched for ${customerName}`, "success");
  };

  const bestSeller = products[0]?.title || "Spicy Tempeh Crisps";

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock < 15);
  }, [products]);

  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) =>
      prod.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [products, debouncedSearchQuery]);

  return (
    <div className="flex flex-col gap-5 p-4 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">Merchant Console</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Manage product inventories, ship client orders, and view sales</p>
        </div>
        <ShoppingBag className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-1 rounded-xl">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "products", label: "Inventory" },
          { id: "orders", label: "Orders" },
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

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* StatCards grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Today's Sales"
                value={`Rp ${revenue.toLocaleString("id-ID")}`}
                icon={<TrendingUp className="h-4.5 w-4.5 text-emerald-600" />}
                trend={{ value: "Live revenue", direction: "up" }}
              />
              <StatCard
                title="Active Orders"
                value={`${orders.filter(o => o.status === "pending").length} Pending`}
                icon={<Package className="h-4.5 w-4.5 text-amber-500" />}
                trend={{ value: "Requires shipment", direction: "neutral" }}
              />
              <StatCard
                title="Console Visitors"
                value={visitors.toString()}
                icon={<Users className="h-4.5 w-4.5 text-zinc-500" />}
              />
              <StatCard
                title="Conversion Rate"
                value="3.2%"
                icon={<Percent className="h-4.5 w-4.5 text-zinc-500" />}
              />
            </div>

            {/* Sales Chart composed in DashboardCard */}
            <DashboardCard title="Weekly Sales Performance" subtitle="Weekly revenue metrics report">
              <div className="h-28 w-full flex items-end justify-between pt-4 px-2 border-b border-zinc-100 dark:border-zinc-900 relative">
                <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between pointer-events-none opacity-5">
                  <div className="border-t border-zinc-700 w-full" />
                  <div className="border-t border-zinc-700 w-full" />
                  <div className="border-t border-zinc-700 w-full" />
                </div>
                {[
                  { day: "Mon", val: 30 },
                  { day: "Tue", val: 50 },
                  { day: "Wed", val: 40 },
                  { day: "Thu", val: 85 },
                  { day: "Fri", val: 65 },
                  { day: "Sat", val: 95 },
                  { day: "Sun", val: 75 },
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[28px] group">
                    <div className="text-[8px] font-extrabold text-zinc-900 dark:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(bar.val * 1000).toLocaleString("id-ID")}
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.val * 0.7}px` }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      className={cn(
                        "w-full rounded-t-sm",
                        idx === 5 ? "bg-amber-500" : "bg-zinc-800 dark:bg-zinc-200"
                      )}
                    />
                    <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-550 uppercase mt-1">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Lower Summary Cards composed in DashboardCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <DashboardCard className="bg-zinc-50/50 dark:bg-zinc-900/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/20 shrink-0">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Best Selling Catalog</span>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-1">{bestSeller}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Generates 64% of total customer orders.</p>
                  </div>
                </div>
              </DashboardCard>

              {lowStockProducts.length > 0 && (
                <DashboardCard className="border-amber-200/50 bg-amber-50/20 dark:border-amber-900/30 dark:bg-amber-950/10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/20 shrink-0 animate-bounce">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-450 uppercase tracking-wider block">Inventory Low Stock Alert</span>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-1">{lowStockProducts.length} Items Running Low</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Please refill stocks to avoid catalog shortages.</p>
                    </div>
                  </div>
                </DashboardCard>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: INVENTORY PRODUCTS LIST */}
        {activeTab === "products" && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Store Listings ({filteredProducts.length})
              </span>
              <Button onClick={handleOpenAddProduct} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-sm rounded-lg">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Product</span>
              </Button>
            </div>

            {/* SearchBar inside inventory */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search product listings by title..."
            />

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-zinc-200 rounded-xl text-zinc-450 text-xs dark:border-zinc-800">
                No matching product listings found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((prod) => (
                  <DashboardCard key={prod.id} className="overflow-hidden p-0 flex">
                    {prod.imageUrl && (
                      <Image
                        src={prod.imageUrl}
                        alt={prod.title}
                        width={80}
                        height={80}
                        className="w-20 object-cover border-r border-zinc-200 dark:border-zinc-850 shrink-0"
                      />
                    )}
                    <div className="p-3 flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-150 truncate">{prod.title}</h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Rp {prod.price.toLocaleString("id-ID")}</p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.25 rounded uppercase tracking-wider border",
                          prod.stock < 15
                            ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400"
                            : "bg-emerald-50 border-emerald-250 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450"
                        )}>
                          Stock: {prod.stock}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrigger(prod.id, prod.title)}
                            className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-550 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: CUSTOMER ORDERS LIST */}
        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block px-0.5">
              Client Shipment Orders
            </span>

            <div className="space-y-3">
              {orders.map((ord) => (
                <DashboardCard key={ord.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-2">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</span>
                      <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{ord.id}</p>
                    </div>
                    <div>
                      {ord.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-250 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900">
                          <CheckCircle className="w-3 h-3" />
                          <span>Shipped</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Item / Qty</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100">{ord.productTitle} x{ord.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Customer Name</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100">{ord.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Ship Address</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100 text-right truncate max-w-[200px]">{ord.customerAddress}</span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-900 pt-1.5">
                      <span className="text-zinc-500 font-semibold">Grand Total</span>
                      <span className="font-extrabold text-primary">Rp {ord.totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {ord.status === "pending" && (
                    <Button
                      onClick={() => handleShipOrder(ord.id, ord.customerName)}
                      className="w-full h-9 text-[10px] font-bold mt-2 flex items-center justify-center gap-1 shadow-sm rounded-lg"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>Dispatch Shipment Courier</span>
                    </Button>
                  )}
                </DashboardCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRUD Product Custom Dialog */}
      <CustomDialog
        onClose={() => setIsProductDialogOpen(false)}
        title={editingProduct ? "Edit Product Listing" : "Add New Product Listing"}
        isOpen={isProductDialogOpen}
      >
        <form onSubmit={handleProductSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Product Title</label>
            <Input
              required
              value={prodTitle}
              onChange={(e) => setProdTitle(e.target.value)}
              placeholder="e.g. Bandung Cheese Roll"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Price (Rp)</label>
            <Input
              required
              type="number"
              value={prodPrice}
              onChange={(e) => setProdPrice(e.target.value)}
              placeholder="e.g. 25000"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Stock Quantity</label>
            <Input
              required
              type="number"
              value={prodStock}
              onChange={(e) => setProdStock(e.target.value)}
              placeholder="e.g. 50"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Image URL</label>
            <Input
              value={prodImageUrl}
              onChange={(e) => setProdImageUrl(e.target.value)}
              placeholder="Image path link..."
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-sm rounded-lg">
            {editingProduct ? "Apply Listing Changes" : "Create & Post to Feed"}
          </Button>
        </form>
      </CustomDialog>

      {/* Reusable Delete ConfirmationDialog */}
      {productToDelete && (
        <ConfirmationDialog
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          title="Delete Product Listing"
          description={`Are you sure you want to delete "${productToDelete.title}"? This action will permanently remove this listing from your store catalog and feed records.`}
          confirmLabel="Delete Listing"
          type="danger"
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
