"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useMerchantStore } from "@/store/merchantStore";
import { useFeedStore } from "@/store/feedStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { X, CheckCircle, Wallet, Truck, ShoppingCart, ArrowRight, ArrowLeft, CreditCard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCheckout {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductCheckout | null;
  onSuccess?: () => void;
}

const SHIPPING_OPTIONS = [
  { id: "nusa-exp", name: "NusaExpress (Local)", price: 5000, desc: "Same day local delivery" },
  { id: "reg", name: "Regular Courier", price: 10000, desc: "2-3 days shipping" },
];

export default function CheckoutSheet({
  isOpen,
  onClose,
  product,
  onSuccess,
}: CheckoutSheetProps) {
  const { toast } = useToast();
  const walletStore = useWalletStore();
  const merchantStore = useMerchantStore();
  const feedStore = useFeedStore();
  const activityStore = useActivityStore();

  const balance = walletStore.balance;

  // Checkout Wizard Steps: "address" | "payment" | "confirm" | "success"
  const [checkoutStep, setCheckoutStep] = useState<"address" | "payment" | "confirm" | "success">("address");
  
  const [shippingId, setShippingId] = useState("nusa-exp");
  const [deliveryAddress, setDeliveryAddress] = useState("Jl. Dago No. 12, Bandung");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) return null;

  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId)!;
  const totalAmount = product.price + selectedShipping.price;

  const handleCheckoutProcess = async () => {
    if (balance < totalAmount) {
      toast(
        "Insufficient Funds",
        `You need Rp ${totalAmount.toLocaleString("id-ID")} but only have Rp ${balance.toLocaleString("id-ID")}`,
        "error"
      );
      return;
    }

    setIsProcessing(true);

    // Simulate payment transaction network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 1. Update Wallet Balance
    walletStore.updateBalance(balance - totalAmount);
    
    // 2. Log Wallet Transaction
    const tx = walletStore.addTransaction({
      type: "payment",
      amount: totalAmount,
      recipient: product.title,
      status: "success",
      note: `Checkout order: ${product.title}`,
    });

    // 3. Create Merchant order
    merchantStore.addOrder({
      customerName: "Budi Santoso",
      customerAddress: deliveryAddress,
      productTitle: product.title,
      quantity: 1,
      totalAmount: totalAmount,
    });

    // 4. Create Notification
    feedStore.addNotification({
      type: "order",
      message: `Successfully purchased "${product.title}" for Rp ${totalAmount.toLocaleString("id-ID")}`,
      linkUrl: "/wallet",
    });

    // 5. Create Activity log
    activityStore.addLog(
      "wallet",
      `Purchased item: ${product.title} (Spent Rp ${totalAmount.toLocaleString("id-ID")})`
    );

    setIsProcessing(false);
    setCheckoutStep("success");

    toast("Purchase Successful", `You successfully bought ${product.title}`, "success");

    // Success screen auto-closes
    setTimeout(() => {
      setCheckoutStep("address");
      onClose();
      if (onSuccess) onSuccess();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isProcessing && checkoutStep !== "success" && onClose()}
            className="fixed inset-0 bg-black/40 z-50 max-w-[768px] mx-auto"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 max-w-[768px] mx-auto bg-surface border-t border-text-muted/10 rounded-t-2xl shadow-high z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="mx-auto my-3 w-12 h-1 bg-text-muted/20 rounded-full shrink-0" />

            <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-5">
              
              {/* Header */}
              {checkoutStep !== "success" && (
                <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider">
                      {checkoutStep === "address" && "1. Delivery Address"}
                      {checkoutStep === "payment" && "2. Payment Method"}
                      {checkoutStep === "confirm" && "3. Confirm Checkout"}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="p-1 rounded-full hover:bg-background text-text-muted active:scale-95"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}

              {/* WIZARD CONTENT PAGES */}
              <AnimatePresence mode="wait">
                
                {/* STEP 1: ADDRESS & SHIPPING */}
                {checkoutStep === "address" && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                        <Home className="h-4 w-4 text-primary" />
                        <span>Confirm Shipping Address</span>
                      </div>
                      <Input
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Type shipping address..."
                        className="text-xs border-text-muted/15 h-10"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                        <Truck className="h-4 w-4 text-primary" />
                        <span>Select Courier Method</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SHIPPING_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setShippingId(option.id)}
                            className={`p-3 rounded-lg border text-left flex flex-col justify-between min-h-[64px] transition-all active:scale-98 ${
                              shippingId === option.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-text-muted/20 hover:border-text-muted/40 text-text-muted"
                            }`}
                          >
                            <span className="font-bold text-[11px] text-text-primary truncate block">
                              {option.name}
                            </span>
                            <div className="flex justify-between items-end w-full mt-1.5">
                              <span className="text-[10px] text-text-muted truncate max-w-[70%]">
                                {option.desc}
                              </span>
                              <span className="font-bold text-[11px] text-primary">
                                +Rp {option.price.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setCheckoutStep("payment")}
                      className="w-full h-11 flex items-center justify-center font-bold text-xs gap-1 shadow-low mt-4"
                    >
                      <span>Proceed to Payment Method</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: PAYMENT METHOD */}
                {checkoutStep === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                      Select Payment Account
                    </span>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("wallet")}
                        className={`w-full p-4.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                          paymentMethod === "wallet"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-text-muted/20 text-text-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Wallet className="h-5 w-5 text-primary shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-text-primary block">NusaHub Wallet Balance</span>
                            <span className="text-[10px] text-text-muted block mt-0.5">Available: Rp {balance.toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                        <CheckCircle className={`h-4.5 w-4.5 ${paymentMethod === "wallet" ? "text-primary" : "text-text-muted/20"}`} />
                      </button>

                      <div className="w-full p-4.5 rounded-lg border border-text-muted/10 opacity-40 text-left flex items-center justify-between select-none cursor-not-allowed">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-text-muted shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-text-muted block">Credit Card (Mock)</span>
                            <span className="text-[9px] text-secondary font-bold uppercase tracking-wider block mt-0.5">Coming Soon</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCheckoutStep("address")}
                        className="h-11 px-4 text-xs font-bold flex items-center gap-1 border-text-muted/15"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        onClick={() => setCheckoutStep("confirm")}
                        disabled={paymentMethod !== "wallet"}
                        className="flex-1 h-11 flex items-center justify-center font-bold text-xs gap-1 shadow-low"
                      >
                        <span>Review Order Summary</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SUMMARY CONFIRMATION */}
                {checkoutStep === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Item Card */}
                    <div className="flex items-center gap-3.5 p-3.5 bg-background border border-text-muted/10 rounded-lg">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-14 h-14 rounded-md object-cover border border-text-muted/10 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-text-primary truncate">{product.title}</h4>
                        <p className="text-[11px] text-secondary font-bold mt-0.5">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="p-4 bg-background border border-text-muted/10 rounded-lg space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Item Subtotal</span>
                        <span className="font-semibold text-text-primary">Rp {product.price.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Shipping Courier ({selectedShipping.name})</span>
                        <span className="font-semibold text-text-primary">Rp {selectedShipping.price.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between border-t border-text-muted/5 pt-2 font-bold">
                        <span className="text-text-muted">Grand Total Charge</span>
                        <span className="text-primary text-sm">Rp {totalAmount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    {/* Balance Check */}
                    {balance < totalAmount ? (
                      <div className="p-3 bg-secondary/10 border border-secondary/15 text-[11px] text-secondary font-bold rounded text-center leading-relaxed">
                        ⚠️ Insufficient wallet balance. You need Rp {totalAmount.toLocaleString("id-ID")} but only have Rp {balance.toLocaleString("id-ID")}.
                      </div>
                    ) : (
                      <div className="p-3 bg-success/5 border border-success/15 text-[11px] text-success font-semibold rounded text-center leading-relaxed">
                        ✓ Funds verified. Rp {totalAmount.toLocaleString("id-ID")} will be charged from your NusaHub Wallet.
                      </div>
                    )}

                    <div className="flex gap-2.5 mt-4">
                      <Button
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => setCheckoutStep("payment")}
                        className="h-11 px-4 text-xs font-bold flex items-center gap-1 border-text-muted/15"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        onClick={handleCheckoutProcess}
                        disabled={isProcessing || balance < totalAmount}
                        className="flex-1 h-11 flex items-center justify-center font-bold text-xs shadow-low"
                      >
                        {isProcessing ? "Processing Payment..." : "Confirm & Pay"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS RECEIPT */}
                {checkoutStep === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="text-success"
                    >
                      <CheckCircle className="h-16 w-16" />
                    </motion.div>
                    <h3 className="font-heading text-lg font-bold text-text-primary">Checkout Complete!</h3>
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                      Your payment has been settled. Your Wallet and Merchant order registries have been synchronized.
                    </p>
                    
                    <div className="p-3.5 bg-background border border-text-muted/10 rounded-lg text-left w-full max-w-xs space-y-1">
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">ITEM PURCHASED</span>
                      <span className="font-bold text-xs text-text-primary block truncate">{product.title}</span>
                      
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mt-2">TOTAL PAID</span>
                      <span className="font-extrabold text-sm text-primary block">Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </div>

                    <span className="text-[10px] text-text-muted animate-pulse mt-4">
                      Returning to chat console...
                    </span>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
