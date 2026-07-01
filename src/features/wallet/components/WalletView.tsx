"use client";

import React, { useState } from "react";
import { useWalletStore, Transaction } from "@/store/walletStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Coins,
  Search,
  CheckCircle,
  HelpCircle,
  FileText,
  User,
  ArrowRight,
  PlusCircle,
  X,
} from "lucide-react";

// Custom Bottom Sheet component
const CustomSheet = ({
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
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl border-t border-text-muted/10 shadow-high z-50 p-5 pb-8 max-h-[85vh] overflow-y-auto"
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

export default function WalletView() {
  const { balance, availableBalance, spendingThisMonth, incomeThisMonth, transactions, updateBalance, addTransaction } = useWalletStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  // State controls
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Dialog / Sheet forms state
  const [activeSheet, setActiveSheet] = useState<"transfer" | "topup" | "qr" | "request" | null>(null);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  
  const [topupAmount, setTopupAmount] = useState("");
  
  // Handlers
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);
    if (!transferTarget.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast("Error", "Please input valid transfer details", "error");
      return;
    }
    if (amountNum > balance) {
      toast("Insufficient Funds", "Wallet balance is too low for this transaction", "error");
      return;
    }

    const currentBal = balance;
    updateBalance(currentBal - amountNum);
    const tx = addTransaction({
      type: "transfer",
      amount: amountNum,
      recipient: transferTarget,
      status: "success",
      note: transferNote || "Fund transfer",
    });

    addLog("wallet", `Transferred Rp ${amountNum.toLocaleString("id-ID")} to ${transferTarget}`);
    toast("Success", `Rp ${amountNum.toLocaleString("id-ID")} sent to ${transferTarget}`, "success");
    
    // Reset state
    setTransferTarget("");
    setTransferAmount("");
    setTransferNote("");
    setActiveSheet(null);
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(topupAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast("Error", "Please input a valid amount", "error");
      return;
    }

    const currentBal = balance;
    updateBalance(currentBal + amountNum);
    addTransaction({
      type: "deposit",
      amount: amountNum,
      sender: "Budi Santoso (Bank Transfer)",
      status: "success",
      note: "Top up via Bank Transfer",
    });

    addLog("wallet", `Deposited/Top-up Rp ${amountNum.toLocaleString("id-ID")} into wallet`);
    toast("Success", `Rp ${amountNum.toLocaleString("id-ID")} deposited successfully`, "success");
    
    setTopupAmount("");
    setActiveSheet(null);
  };

  const handleQRScanPay = () => {
    const payAmt = 15000;
    if (payAmt > balance) {
      toast("Insufficient Funds", "Your balance is too low to pay this Merchant", "error");
      return;
    }

    const currentBal = balance;
    updateBalance(currentBal - payAmt);
    addTransaction({
      type: "payment",
      amount: payAmt,
      recipient: "Bandung Culinary Merchant",
      status: "success",
      note: "QR Scan Payment",
    });

    addLog("wallet", `QR Scan Payment of Rp ${payAmt.toLocaleString("id-ID")} to Bandung Culinary Merchant`);
    toast("Success", `QR Payment of Rp ${payAmt.toLocaleString("id-ID")} successful`, "success");
    setActiveSheet(null);
  };

  // Filters logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      (tx.recipient?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (tx.sender?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (tx.note?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    
    const todayStr = new Date().toLocaleDateString("id-ID").split("/")[0];
    const txDay = tx.timestamp.split("/")[0];
    
    if (activeFilter === "today") {
      return txDay === todayStr;
    } else if (activeFilter === "week") {
      const diff = Math.abs(parseInt(todayStr) - parseInt(txDay));
      return diff <= 7;
    }
    
    return true;
  });



  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Wallet Center</h2>
          <p className="text-[11px] text-text-muted">Simulate digital ledger credit accounts, QRIS, and deposits</p>
        </div>
        <Coins className="h-5 w-5 text-secondary animate-pulse" />
      </div>

      {/* 1. Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-primary to-primary-hover text-white border-none shadow-high overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
            <Wallet className="h-64 w-64" />
          </div>
          <CardContent className="p-5 flex flex-col justify-between min-h-[160px] relative z-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
                NusaHub Digital Ledger
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight mt-1">
                Rp {balance.toLocaleString("id-ID")}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3.5 mt-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-white/60 tracking-wider">
                  Available Balance
                </span>
                <p className="text-xs font-bold mt-0.5">
                  Rp {availableBalance.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-white/60 tracking-wider">
                  Verified Status
                </span>
                <p className="text-xs font-bold mt-0.5 flex items-center justify-end gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-secondary" />
                  <span>Secure</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. Stats Summary */}
      <div className="grid grid-cols-2 gap-3.5">
        <Card className="border border-text-muted/15 shadow-low">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success shrink-0">
              <ArrowDownLeft className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-text-muted/70 font-semibold uppercase tracking-wider block">
                Income This Month
              </span>
              <span className="font-bold text-xs text-text-primary block mt-0.5 truncate">
                Rp {incomeThisMonth.toLocaleString("id-ID")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-text-muted/15 shadow-low">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <ArrowUpRight className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-text-muted/70 font-semibold uppercase tracking-wider block">
                Spending This Month
              </span>
              <span className="font-bold text-xs text-text-primary block mt-0.5 truncate">
                Rp {spendingThisMonth.toLocaleString("id-ID")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Action Chips */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: "transfer", label: "Transfer", icon: ArrowUpRight, action: () => setActiveSheet("transfer") },
          { id: "topup", label: "Top Up", icon: PlusCircle, action: () => setActiveSheet("topup") },
          { id: "qr", label: "Scan QR", icon: QrCode, action: () => setActiveSheet("qr") },
          { id: "request", label: "Request", icon: ArrowDownLeft, action: () => setActiveSheet("request") },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.action}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface border border-text-muted/10 shadow-low hover:border-primary/20 transition-all select-none active:scale-95 text-center group"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-bold text-text-primary mt-1.5 truncate w-full">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Ledger history */}
      <div className="space-y-3.5 mt-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-0.5">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Transaction Ledger History
          </span>
          <div className="flex items-center gap-1">
            {(["all", "today", "week"] as const).map((filt) => (
              <button
                key={filt}
                onClick={() => setActiveFilter(filt)}
                className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border transition-all ${
                  activeFilter === filt
                    ? "bg-primary border-primary text-white"
                    : "bg-surface border-text-muted/10 text-text-muted"
                }`}
              >
                {filt}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by note, sender, or receiver..."
            className="pl-9 h-9.5 text-xs border-text-muted/15"
          />
        </div>

        {/* Entries list */}
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filteredTransactions.length === 0 ? (
              <div className="p-6 text-center border border-dashed rounded-lg text-text-muted text-xs">
                No matching transactions logged
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const isExpense = tx.type === "transfer" || tx.type === "payment";
                return (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-surface border border-text-muted/10 rounded-lg hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer shadow-low"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-full shrink-0 ${
                        isExpense ? "bg-secondary/15 text-secondary" : "bg-success/15 text-success"
                      }`}>
                        {isExpense ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowDownLeft className="h-4.5 w-4.5" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-text-primary block truncate">
                          {tx.type === "transfer" ? `Transfer to ${tx.recipient}` : tx.type === "payment" ? `Paid ${tx.recipient}` : `Received from ${tx.sender}`}
                        </span>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          {tx.timestamp} • {tx.note || "No note"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold block ${
                        isExpense ? "text-secondary" : "text-success"
                      }`}>
                        {isExpense ? "-" : "+"} Rp {tx.amount.toLocaleString("id-ID")}
                      </span>
                      <span className="inline-flex items-center text-[9px] font-bold text-success mt-0.5 bg-success/5 px-1.5 py-0.25 rounded border border-success/10 uppercase">
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================
          CUSTOM SHEETS RENDERERS
          ======================================================== */}
      
      {/* A. Transfer */}
      <CustomSheet isOpen={activeSheet === "transfer"} onClose={() => setActiveSheet(null)} title="Send Peer-to-Peer Transfer">
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase">Recipient (Handle or Name)</label>
            <Input
              required
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
              placeholder="e.g. Andi Wijaya or @andi"
              className="h-10 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase">Amount (Rp)</label>
            <Input
              required
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="h-10 text-xs border-text-muted/15"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase">Note (Optional)</label>
            <Input
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="e.g. Payment for illustrations"
              className="h-10 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-10 text-xs font-bold mt-2 shadow-low">
            Send Rp {transferAmount ? parseInt(transferAmount).toLocaleString("id-ID") : "0"}
          </Button>
        </form>
      </CustomSheet>

      {/* B. Top Up */}
      <CustomSheet isOpen={activeSheet === "topup"} onClose={() => setActiveSheet(null)} title="Simulate Account Top Up">
        <form onSubmit={handleTopupSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase">Top Up Amount (Rp)</label>
            <Input
              required
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder="e.g. 100000"
              className="h-10 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-10 text-xs font-bold mt-2 shadow-low">
            Add Balance
          </Button>
        </form>
      </CustomSheet>

      {/* C. QR Scanner */}
      <CustomSheet isOpen={activeSheet === "qr"} onClose={() => setActiveSheet(null)} title="QRIS Scan Merchant MOCK">
        <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
          <div className="h-44 w-44 bg-neutral-900 border-2 border-primary rounded-lg flex items-center justify-center text-primary relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-primary animate-scan" style={{
              animation: "scan 2s linear infinite"
            }} />
            <QrCode className="h-16 w-16 opacity-30" />
          </div>
          <p className="text-[11px] text-text-muted max-w-xs leading-relaxed">
            This simulates scanning a QRIS code of *Bandung Culinary Merchant* for **Rp 15.000**.
          </p>
          <Button onClick={handleQRScanPay} className="w-full h-10 text-xs font-bold shadow-low mt-2">
            Simulate Scan & Pay Rp 15.000
          </Button>
        </div>
      </CustomSheet>

      {/* D. Request */}
      <CustomSheet isOpen={activeSheet === "request"} onClose={() => setActiveSheet(null)} title="Receive Request Money QR">
        <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
          <div className="h-40 w-40 bg-white border border-text-muted/10 p-2 rounded-lg shadow-low flex items-center justify-center">
            <QrCode className="h-full w-full text-neutral-900" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-text-primary">@budi</span>
            <p className="text-[10px] text-text-muted/70 mt-1.5 leading-relaxed">
              Others can scan this code to pay Budi Santoso instantly inside NusaHub.
            </p>
          </div>
        </div>
      </CustomSheet>

      {/* E. Transaction Receipt Detail Sheet */}
      <CustomSheet isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Receipt">
        {selectedTx && (
          <div className="space-y-4">
            <div className="text-center py-4 bg-background rounded-lg border border-text-muted/5">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Total Amount</span>
              <h3 className="text-2xl font-extrabold text-text-primary mt-1">
                Rp {selectedTx.amount.toLocaleString("id-ID")}
              </h3>
              <span className="inline-flex items-center text-[10px] font-bold text-success mt-2 bg-success/5 px-2 py-0.5 rounded border border-success/15 uppercase">
                {selectedTx.status}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs border-b border-text-muted/5 pb-2">
                <span className="text-text-muted">Transaction ID</span>
                <span className="font-semibold text-text-primary select-all">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-text-muted/5 pb-2">
                <span className="text-text-muted">Type</span>
                <span className="font-semibold text-text-primary capitalize">{selectedTx.type}</span>
              </div>
              {selectedTx.recipient && (
                <div className="flex justify-between text-xs border-b border-text-muted/5 pb-2">
                  <span className="text-text-muted">Recipient</span>
                  <span className="font-semibold text-text-primary">{selectedTx.recipient}</span>
                </div>
              )}
              {selectedTx.sender && (
                <div className="flex justify-between text-xs border-b border-text-muted/5 pb-2">
                  <span className="text-text-muted">Sender</span>
                  <span className="font-semibold text-text-primary">{selectedTx.sender}</span>
                </div>
              )}
              <div className="flex justify-between text-xs border-b border-text-muted/5 pb-2">
                <span className="text-text-muted">Timestamp</span>
                <span className="font-semibold text-text-primary">{selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-text-muted/5 pb-2">
                <span className="text-text-muted">Notes</span>
                <span className="font-semibold text-text-primary text-right max-w-[200px] truncate">{selectedTx.note || "No note"}</span>
              </div>
            </div>
          </div>
        )}
      </CustomSheet>

    </div>
  );
}
