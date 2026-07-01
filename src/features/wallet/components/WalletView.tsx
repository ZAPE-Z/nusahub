"use client";

import React, { useState, useMemo } from "react";
import { useWalletStore, Transaction } from "@/store/walletStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isDateInFilter } from "@/lib/dateUtils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Coins,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  DashboardCard,
  StatCard,
  SearchBar,
  BottomSheet,
  EmptyWallet,
} from "@/components/shared";

export default function WalletView() {
  const balance = useWalletStore((state) => state.balance);
  const availableBalance = useWalletStore((state) => state.availableBalance);
  const spendingThisMonth = useWalletStore((state) => state.spendingThisMonth);
  const incomeThisMonth = useWalletStore((state) => state.incomeThisMonth);
  const transactions = useWalletStore((state) => state.transactions);
  const updateBalance = useWalletStore((state) => state.updateBalance);
  const addTransaction = useWalletStore((state) => state.addTransaction);

  const addLog = useActivityStore((state) => state.addLog);
  const { toast } = useToast();

  // State controls
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Sheet forms state
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
    addTransaction({
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
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        (tx.recipient?.toLowerCase() || "").includes(debouncedSearchQuery.toLowerCase()) ||
        (tx.sender?.toLowerCase() || "").includes(debouncedSearchQuery.toLowerCase()) ||
        (tx.note?.toLowerCase() || "").includes(debouncedSearchQuery.toLowerCase());

      if (!matchesSearch) return false;
      return isDateInFilter(tx.timestamp, activeFilter === "month" ? "all" : activeFilter);
    });
  }, [transactions, debouncedSearchQuery, activeFilter]);

  return (
    <div className="flex flex-col gap-5 p-4 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Wallet Center
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Simulate digital ledger credit accounts, QRIS, and deposits
          </p>
        </div>
        <Coins className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
      </div>

      {/* 1. Main Balance Card (composed using DashboardCard) */}
      <DashboardCard className="bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-950 text-white border-none shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 translate-x-4 -translate-y-4">
          <Wallet className="h-64 w-64 text-white" />
        </div>
        <div className="flex flex-col justify-between min-h-[140px] relative z-10">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">
              NusaHub Digital Ledger
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-white">
              Rp {balance.toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3.5 mt-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                Available Balance
              </span>
              <p className="text-xs font-bold mt-0.5">
                Rp {availableBalance.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                Verified Status
              </span>
              <p className="text-xs font-bold mt-0.5 flex items-center justify-end gap-1 text-emerald-450">
                <CheckCircle className="h-3.5 w-3.5 fill-emerald-500/10" />
                <span>Secure</span>
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* 2. Stats Summary using StatCard */}
      <div className="grid grid-cols-2 gap-3.5">
        <StatCard
          title="Income This Month"
          value={`Rp ${incomeThisMonth.toLocaleString("id-ID")}`}
          trend={{ value: "P2P & Deposits", direction: "up" }}
          icon={<TrendingUp className="h-4.5 w-4.5 text-emerald-600" />}
        />
        <StatCard
          title="Spending This Month"
          value={`Rp ${spendingThisMonth.toLocaleString("id-ID")}`}
          trend={{ value: "Payments & Transfers", direction: "down" }}
          icon={<TrendingDown className="h-4.5 w-4.5 text-rose-500" />}
        />
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
              className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white border border-zinc-200 shadow-sm hover:border-zinc-350 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 transition-all select-none active:scale-95 text-center group"
            >
              <div className="p-2.5 rounded-full bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 transition-all shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 mt-2 truncate w-full">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Ledger history */}
      <div className="space-y-3.5 mt-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-0.5">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Transaction Ledger History
          </span>
          <div className="flex items-center gap-1">
            {(["all", "today", "week"] as const).map((filt) => (
              <button
                key={filt}
                onClick={() => setActiveFilter(filt)}
                className={cn(
                  "text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border transition-all",
                  activeFilter === filt
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                    : "bg-white border-zinc-200 text-zinc-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                )}
              >
                {filt}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by note, recipient, or sender..."
        />

        {/* Entries list */}
        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <EmptyWallet
              title="No transactions found"
              description="No ledger transfers or deposits match your search parameters."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
            />
          ) : (
            filteredTransactions.map((tx) => {
              const isExpense = tx.type === "transfer" || tx.type === "payment";
              return (
                <div
                  key={tx.id}
                  className="p-3 bg-white border border-zinc-200/60 rounded-xl hover:border-zinc-350 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer shadow-sm"
                  onClick={() => setSelectedTx(tx)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "p-2 rounded-full shrink-0",
                        isExpense
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                      )}
                    >
                      {isExpense ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block truncate">
                        {tx.type === "transfer"
                          ? `Transfer to ${tx.recipient}`
                          : tx.type === "payment"
                          ? `Paid ${tx.recipient}`
                          : `Received from ${tx.sender}`}
                      </span>
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-550 block mt-0.5">
                        {tx.timestamp} • {tx.note || "No note"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={cn(
                        "text-xs font-bold block",
                        isExpense ? "text-rose-600 dark:text-rose-450" : "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {isExpense ? "-" : "+"} Rp {tx.amount.toLocaleString("id-ID")}
                    </span>
                    <span className="inline-flex items-center text-[9px] font-extrabold text-emerald-600 mt-0.5 bg-emerald-50 px-1.5 py-0.25 rounded border border-emerald-200/50 uppercase dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================
          BOTTOM SHEETS RENDERERS
          ======================================================== */}

      {/* A. Transfer BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === "transfer"}
        onClose={() => setActiveSheet(null)}
        title="Send Peer-to-Peer Transfer"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Recipient (Handle or Name)</label>
            <Input
              required
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
              placeholder="e.g. Andi Wijaya or @andi"
              className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Amount (Rp)</label>
            <Input
              required
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Note (Optional)</label>
            <Input
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="e.g. Payment for illustrations"
              className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-10 text-xs font-bold mt-2 shadow-sm">
            Send Rp {transferAmount ? parseInt(transferAmount).toLocaleString("id-ID") : "0"}
          </Button>
        </form>
      </BottomSheet>

      {/* B. Top Up BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === "topup"}
        onClose={() => setActiveSheet(null)}
        title="Simulate Account Top Up"
      >
        <form onSubmit={handleTopupSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Top Up Amount (Rp)</label>
            <Input
              required
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder="e.g. 100000"
              className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-10 text-xs font-bold mt-2 shadow-sm">
            Add Balance
          </Button>
        </form>
      </BottomSheet>

      {/* C. QR Scanner BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === "qr"}
        onClose={() => setActiveSheet(null)}
        title="QRIS Scan Merchant Mock"
      >
        <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
          <div className="h-44 w-44 bg-zinc-950 border-2 border-primary rounded-xl flex items-center justify-center text-primary relative overflow-hidden shadow-inner">
            <div
              className="absolute inset-x-0 top-0 h-0.5 bg-primary animate-scan"
              style={{
                animation: "scan 2s linear infinite",
              }}
            />
            <QrCode className="h-16 w-16 opacity-30 text-white" />
          </div>
          <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
            This simulates scanning a QRIS code of *Bandung Culinary Merchant* for **Rp 15.000**.
          </p>
          <Button onClick={handleQRScanPay} className="w-full h-10 text-xs font-bold shadow-sm mt-2">
            Simulate Scan & Pay Rp 15.000
          </Button>
        </div>
      </BottomSheet>

      {/* D. Request BottomSheet */}
      <BottomSheet
        isOpen={activeSheet === "request"}
        onClose={() => setActiveSheet(null)}
        title="Receive Request Money QR"
      >
        <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
          <div className="h-40 w-40 bg-white border border-zinc-200 p-2 rounded-xl shadow-sm flex items-center justify-center">
            <QrCode className="h-full w-full text-zinc-950" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">@budi</span>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mt-1.5 leading-relaxed">
              Others can scan this code to pay Budi Santoso instantly inside NusaHub.
            </p>
          </div>
        </div>
      </BottomSheet>

      {/* E. Transaction Receipt Detail BottomSheet */}
      <BottomSheet
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Receipt"
      >
        {selectedTx && (
          <div className="space-y-4">
            <div className="text-center py-4 bg-zinc-50 border border-zinc-150 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800">
              <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Total Amount</span>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                Rp {selectedTx.amount.toLocaleString("id-ID")}
              </h3>
              <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150 uppercase dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900">
                {selectedTx.status}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <span className="text-zinc-500">Transaction ID</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 select-all font-mono">
                  {selectedTx.id}
                </span>
              </div>
              <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <span className="text-zinc-500">Type</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                  {selectedTx.type}
                </span>
              </div>
              {selectedTx.recipient && (
                <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  <span className="text-zinc-500">Recipient</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedTx.recipient}
                  </span>
                </div>
              )}
              {selectedTx.sender && (
                <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  <span className="text-zinc-500">Sender</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedTx.sender}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <span className="text-zinc-500">Timestamp</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedTx.timestamp}
                </span>
              </div>
              <div className="flex justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <span className="text-zinc-500">Notes</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right max-w-[200px] truncate">
                  {selectedTx.note || "No note"}
                </span>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
