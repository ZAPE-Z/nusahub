"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useToast } from "@/store/useToastStore";
import { X, CheckCircle, Wallet, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const balance = walletStore.balance;

  const [shippingId, setShippingId] = useState("nusa-exp");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId)!;
  const totalAmount = product.price + selectedShipping.price;

  const handlePayment = async () => {
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

    walletStore.updateBalance(balance - totalAmount);
    walletStore.addTransaction({
      type: "payment",
      amount: totalAmount,
      recipient: product.title,
      status: "success",
      note: `Checkout: ${product.title} via Chat Commerce`,
    });

    setIsProcessing(false);
    setIsSuccess(true);

    toast("Purchase Successful", `You successfully bought ${product.title}`, "success");

    // Success screen will auto-close after 2s
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isProcessing && !isSuccess && onClose()}
            className="fixed inset-0 bg-black/40 z-50 max-w-[768px] mx-auto"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 max-w-[768px] mx-auto bg-surface border-t border-text-muted/10 rounded-t-lg shadow-high z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Grab handle line */}
            <div className="mx-auto my-3 w-12 h-1 bg-text-muted/20 rounded-full shrink-0" />

            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5">
              {isSuccess ? (
                /* Success animation state */
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-success"
                  >
                    <CheckCircle className="h-16 w-16" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">Payment Confirmed!</h3>
                  <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                    Your wallet balance has been updated. The merchant is preparing your order:
                  </p>
                  <div className="p-3 bg-background border border-text-muted/10 rounded-lg text-left w-full max-w-xs space-y-1">
                    <span className="text-[11px] text-text-muted block">ITEM ORDERED</span>
                    <span className="font-semibold text-xs text-text-primary block truncate">{product.title}</span>
                    <span className="text-[11px] text-text-muted block mt-1">TOTAL CHARGED</span>
                    <span className="font-bold text-sm text-primary block">Rp {totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <span className="text-[10px] text-text-muted animate-pulse mt-4">
                    Closing order screen...
                  </span>
                </div>
              ) : (
                /* Standard payment verify state */
                <>
                  <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-text-primary">Confirm Order</h3>
                    </div>
                    <button
                      onClick={onClose}
                      disabled={isProcessing}
                      className="p-1 rounded-full hover:bg-background text-text-muted hover:text-text-primary active:scale-95"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Product Details Item card */}
                  <div className="flex items-center gap-3 p-3 bg-background border border-text-muted/10 rounded-lg">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-16 h-16 rounded-md object-cover border border-text-muted/10"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-text-primary truncate">{product.title}</h4>
                      <p className="text-xs text-secondary font-semibold mt-1">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Shipping option list selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                      <Truck className="h-4 w-4" />
                      <span>Shipping Method</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {SHIPPING_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setShippingId(option.id)}
                          disabled={isProcessing}
                          className={`p-3 rounded-lg border text-left flex flex-col justify-between h-20 transition-all active:scale-98 ${
                            shippingId === option.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-text-muted/20 hover:border-text-muted/40 text-text-muted"
                          }`}
                        >
                          <span className="font-bold text-[11px] truncate block text-text-primary">
                            {option.name}
                          </span>
                          <div className="flex justify-between items-end w-full">
                            <span className="text-[10px] truncate leading-tight max-w-[70%]">
                              {option.desc}
                            </span>
                            <span className="font-bold text-xs">
                              +{option.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wallet balances check status card */}
                  <div className="p-3 bg-background border border-text-muted/10 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span>Mock Wallet Balance</span>
                      </div>
                      <span className="font-bold text-text-primary">
                        Rp {balance.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-text-muted/10 pt-2 text-xs">
                      <span className="text-text-muted">Total Price</span>
                      <span className="font-extrabold text-sm text-primary">
                        Rp {totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {balance < totalAmount && (
                      <div className="p-2 bg-error/10 border border-error/20 rounded text-[11px] text-error font-medium text-center">
                        Insufficient wallet balance. Please add funds.
                      </div>
                    )}
                  </div>

                  {/* Confirm CTA */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || balance < totalAmount}
                    className="w-full h-12 flex items-center justify-center font-bold text-xs"
                  >
                    {isProcessing ? "Processing Transfer..." : "Confirm Payment"}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
