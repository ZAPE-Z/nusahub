"use client";

import React, { useState } from "react";
import { useMerchantStore, MerchantProduct, MerchantOrder } from "@/store/merchantStore";
import { useFeedStore } from "@/store/feedStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Card, CardContent } from "@/components/ui/card";
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

// Custom inline Dialog component
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
          initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
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

export default function MerchantView() {
  const { products, orders, revenue, visitors, addProduct, editProduct, deleteProduct, shipOrder } = useMerchantStore();
  const { addPost } = useFeedStore();
  const { addLog } = useActivityStore();
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

  const handleDeleteProduct = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(id);
      addLog("merchant", `Deleted product listing: "${title}"`);
      toast("Deleted", `Listing "${title}" removed`, "success");
    }
  };

  const handleShipOrder = (id: string, customerName: string) => {
    shipOrder(id);
    addLog("merchant", `Shipped package for order ${id} to ${customerName}`);
    toast("Order Shipped", `Courier dispatched for ${customerName}`, "success");
  };

  const bestSeller = products[0]?.title || "Spicy Tempeh Crisps";
  const lowStockProducts = products.filter((p) => p.stock < 15);



  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Merchant Console</h2>
          <p className="text-[11px] text-text-muted">Manage product inventories, ship client orders, and view sales</p>
        </div>
        <ShoppingBag className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface border border-text-muted/10 p-1 rounded-lg">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "products", label: "Inventory" },
          { id: "orders", label: "Orders" },
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
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Today's Sales", val: `Rp ${revenue.toLocaleString("id-ID")}`, icon: TrendingUp, color: "text-success bg-success/15" },
                { title: "Active Orders", val: `${orders.filter(o => o.status === "pending").length} Pending`, icon: Package, color: "text-secondary bg-secondary/15" },
                { title: "Console Visitors", val: visitors.toString(), icon: Users, color: "text-primary bg-primary/15" },
                { title: "Conversion Rate", val: "3.2%", icon: Percent, color: "text-primary bg-primary/15" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Card key={i} className="border border-text-muted/15 shadow-low">
                    <CardContent className="p-3.5 flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg shrink-0", stat.color)}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">
                          {stat.title}
                        </span>
                        <span className="font-bold text-xs text-text-primary block mt-0.5 truncate">
                          {stat.val}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sales Chart */}
            <Card className="border border-text-muted/15 shadow-low">
              <CardContent className="p-4 space-y-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Weekly Sales Performance (Simulated)
                </span>
                
                <div className="h-28 w-full flex items-end justify-between pt-4 px-2 border-b border-text-muted/10 relative">
                  <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between pointer-events-none opacity-5">
                    <div className="border-t border-text-primary w-full" />
                    <div className="border-t border-text-primary w-full" />
                    <div className="border-t border-text-primary w-full" />
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
                      <div className="text-[8px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {(bar.val * 1000).toLocaleString("id-ID")}
                      </div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.val * 0.7}px` }}
                        transition={{ delay: idx * 0.05, duration: 0.5 }}
                        className={cn(
                          "w-full rounded-t-sm",
                          idx === 5 ? "bg-secondary" : "bg-primary"
                        )}
                      />
                      <span className="text-[8px] font-bold text-text-muted uppercase mt-1">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <Card className="border border-text-muted/15 bg-surface p-3.5 flex items-start gap-3 shadow-low">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary shrink-0">
                  <Award className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Best Selling Catalog</span>
                  <h4 className="font-bold text-xs text-text-primary mt-1">{bestSeller}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Generates 64% of total customer orders.</p>
                </div>
              </Card>

              {lowStockProducts.length > 0 && (
                <Card className="border border-secondary/20 bg-secondary/5 p-3.5 flex items-start gap-3 shadow-low">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary shrink-0 animate-bounce">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-wider block">Inventory Low Stock Alert</span>
                    <h4 className="font-bold text-xs text-text-primary mt-1">{lowStockProducts.length} Items Running Low</h4>
                    <p className="text-[10px] text-text-muted mt-0.5">Please refill stocks to avoid catalog shortages.</p>
                  </div>
                </Card>
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
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Store Listings ({products.length})
              </span>
              <Button onClick={handleOpenAddProduct} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-low">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Product</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <Card key={prod.id} className="overflow-hidden border border-text-muted/15 shadow-low flex">
                  {prod.imageUrl && (
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-20 object-cover border-r border-text-muted/10 shrink-0"
                    />
                  )}
                  <div className="p-3 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-bold text-xs text-text-primary truncate">{prod.title}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">Rp {prod.price.toLocaleString("id-ID")}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-text-muted/5">
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.25 rounded uppercase tracking-wider border",
                        prod.stock < 15
                          ? "bg-secondary/10 border-secondary/15 text-secondary"
                          : "bg-success/10 border-success/15 text-success"
                      )}>
                        Stock: {prod.stock}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1 rounded hover:bg-primary/10 text-primary transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          className="p-1 rounded hover:bg-secondary/10 text-secondary transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block px-0.5">
              Client Shipment Orders
            </span>

            <div className="space-y-3">
              {orders.map((ord) => (
                <Card key={ord.id} className="border border-text-muted/15 shadow-low p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-text-muted/5 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Order ID</span>
                      <p className="text-xs font-mono font-bold text-text-primary mt-0.5">{ord.id}</p>
                    </div>
                    <div>
                      {ord.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-secondary/15">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-success/15">
                          <CheckCircle className="w-3 h-3" />
                          <span>Shipped</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Item / Qty</span>
                      <span className="font-semibold text-text-primary">{ord.productTitle} x{ord.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Customer Name</span>
                      <span className="font-semibold text-text-primary">{ord.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Ship Address</span>
                      <span className="font-semibold text-text-primary text-right truncate max-w-[200px]">{ord.customerAddress}</span>
                    </div>
                    <div className="flex justify-between border-t border-text-muted/5 pt-1.5">
                      <span className="text-text-muted">Grand Total</span>
                      <span className="font-bold text-primary">Rp {ord.totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {ord.status === "pending" && (
                    <Button
                      onClick={() => handleShipOrder(ord.id, ord.customerName)}
                      className="w-full h-8.5 text-[10px] font-bold mt-2 flex items-center justify-center gap-1 shadow-low"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>Dispatch Shipment Courier</span>
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* CRUD Custom Dialog */}
      <CustomDialog onClose={() => setIsProductDialogOpen(false)} title={editingProduct ? "Edit Product Listing" : "Add New Product Listing"} isOpen={isProductDialogOpen}>
        <form onSubmit={handleProductSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Product Title</label>
            <Input
              required
              value={prodTitle}
              onChange={(e) => setProdTitle(e.target.value)}
              placeholder="e.g. Bandung Cheese Roll"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Price (Rp)</label>
            <Input
              required
              type="number"
              value={prodPrice}
              onChange={(e) => setProdPrice(e.target.value)}
              placeholder="e.g. 25000"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Stock Quantity</label>
            <Input
              required
              type="number"
              value={prodStock}
              onChange={(e) => setProdStock(e.target.value)}
              placeholder="e.g. 50"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Image URL</label>
            <Input
              value={prodImageUrl}
              onChange={(e) => setProdImageUrl(e.target.value)}
              placeholder="Image path link..."
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold mt-2 shadow-low">
            {editingProduct ? "Apply Listing Changes" : "Create & Post to Feed"}
          </Button>
        </form>
      </CustomDialog>

    </div>
  );
}
