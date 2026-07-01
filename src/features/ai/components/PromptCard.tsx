"use client";

import React from "react";
import { Sparkles, Wallet, ShieldCheck, CheckSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PromptCardProps {
  onSelectPrompt: (promptText: string) => void;
}

export default function PromptCard({ onSelectPrompt }: PromptCardProps) {
  const cards = [
    {
      title: "Wallet Transaction",
      desc: "Simulate digital bank checking and P2P transfers.",
      prompt: "Pay Ibu Sri Rp 50,000 for snacks",
      icon: Wallet,
      color: "text-secondary bg-secondary/5 border-secondary/10",
    },
    {
      title: "Task Management",
      desc: "Orchestrate workspace checklist logs and task schedules.",
      prompt: "Add task buy spicy tempeh",
      icon: CheckSquare,
      color: "text-primary bg-primary/5 border-primary/10",
    },
    {
      title: "Super-App Inquiry",
      desc: "Ask general questions about super-app horizontal services.",
      prompt: "Halo Nusa! Apa yang bisa kamu lakukan?",
      icon: ShieldCheck,
      color: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    },
  ];

  return (
    <div className="space-y-4 max-w-sm mx-auto my-4 animate-fade-in">
      <div className="flex items-center gap-2 text-primary justify-center mb-1">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <h4 className="font-heading text-sm font-bold text-text-primary">Suggested Actions</h4>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card
              key={c.title}
              onClick={() => onSelectPrompt(c.prompt)}
              className="cursor-pointer hover:bg-primary/5 border hover:border-primary/20 transition-all active:scale-[0.99] shadow-low group"
            >
              <CardContent className="p-3 flex gap-3 items-center">
                <div className={`p-2.5 rounded-lg border shrink-0 ${c.color} group-hover:scale-105 transition-all`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h5 className="font-semibold text-xs text-text-primary leading-snug">
                    {c.title}
                  </h5>
                  <p className="text-[10px] text-text-muted mt-0.5 truncate leading-relaxed">
                    {c.desc}
                  </p>
                  <span className="text-[10px] text-primary group-hover:underline font-semibold block mt-1">
                    Try: &quot;{c.prompt}&quot;
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
