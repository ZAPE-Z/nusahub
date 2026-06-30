"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sun, ShieldCheck, ShoppingCart, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 p-6">
        <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-medium text-white font-bold text-2xl animate-bounce">
          NH
        </div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">NusaHub</h1>
        <span className="text-xs text-text-muted">Indonesia's AI-First Super App</span>
        <div className="w-12 h-1 bg-primary/10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-primary w-1/2 animate-[shimmer_1.5s_infinite_linear]" style={{
            backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
          }} />
        </div>
      </div>
    );
  }

  const onboardingSlides = [
    {
      title: "One App. Infinite Possibilities.",
      desc: "NusaHub unifies communication, payments, social networks, and productivity tools under one lightweight sandboxed shell.",
      icon: Sun,
    },
    {
      title: "Conversational Commerce",
      desc: "Order items, request local deliveries, and verify transaction receipts directly inside active chat rooms without app hopping.",
      icon: ShoppingCart,
    },
    {
      title: "AI Native Assistant",
      desc: "Ask the built-in AI Assistant to transfer wallet funds, check ledger balances, and manage tasks using simple natural language.",
      icon: ShieldCheck,
    },
  ];

  const CurrentIcon = onboardingSlides[slide].icon;

  const handleNext = () => {
    if (slide < onboardingSlides.length - 1) {
      setSlide(slide + 1);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[75vh] p-6 text-center gap-6">
      {/* Skip Button */}
      <button
        onClick={() => router.push("/login")}
        className="self-end text-xs text-text-muted hover:underline font-semibold"
      >
        Skip
      </button>

      {/* Slide Illustration/Icon */}
      <div className="flex flex-col items-center gap-4 flex-1 justify-center max-w-sm">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 animate-pulse">
          <CurrentIcon className="h-12 w-12" />
        </div>
        <h2 className="font-heading text-xl font-bold text-text-primary leading-snug">
          {onboardingSlides[slide].title}
        </h2>
        <p className="text-xs text-text-muted leading-relaxed">
          {onboardingSlides[slide].desc}
        </p>
      </div>

      {/* Control Actions & Dot Indicator */}
      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {onboardingSlides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === slide ? "w-6 bg-primary" : "w-2 bg-text-muted/30"
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full flex items-center justify-center gap-2">
          <span>{slide === onboardingSlides.length - 1 ? "Get Started" : "Continue"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
