"use client";

import React, { useState } from "react";
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, Sparkles, Check } from "lucide-react";
import { useToast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

interface AIResponseCardProps {
  text: string;
  onRegenerate?: () => void;
}

export default function AIResponseCard({ text, onRegenerate }: AIResponseCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied", "AI response copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Error", "Failed to copy text.", "error");
    }
  };

  const handleLike = (isLike: boolean) => {
    setLiked(isLike);
    toast(
      "Feedback Received",
      isLike ? "Glad you liked the response!" : "Sorry about that. We will improve.",
      "default"
    );
  };

  // Basic lightweight custom parser for Markdown and code blocks
  const renderFormattedText = (rawText: string) => {
    const parts = rawText.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      // Check if it's a code block
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const header = lines[0].replace("```", "").trim() || "code";
        const code = lines.slice(1, lines.length - 1).join("\n");

        return (
          <div key={idx} className="my-3 rounded-lg overflow-hidden border border-text-muted/10 shadow-medium">
            <div className="bg-background px-3 py-1.5 flex justify-between items-center text-[10px] text-text-muted border-b border-text-muted/10 font-mono">
              <span className="uppercase">{header}</span>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(code);
                  toast("Copied Code", "Snippet copied to clipboard.", "success");
                }}
                className="hover:text-text-primary active:scale-95 transition-all flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-3 bg-[#2E2C26] text-[#F3EFE9] font-mono text-[11px] overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format standard text line-by-line
      const lines = part.split("\n");
      return (
        <div key={idx} className="space-y-1.5 text-xs text-text-primary leading-relaxed">
          {lines.map((line, lIdx) => {
            let processedLine = line;

            // Handle headers
            if (processedLine.startsWith("### ")) {
              return (
                <h4 key={lIdx} className="font-heading text-sm font-bold text-primary pt-2 pb-0.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-secondary animate-pulse" />
                  <span>{processedLine.replace("### ", "")}</span>
                </h4>
              );
            }

            // Handle list items
            const isBullet = processedLine.trim().startsWith("- ") || processedLine.trim().startsWith("* ");
            const isNumber = /^\d+\.\s/.test(processedLine.trim());

            if (isBullet) {
              const cleaned = processedLine.replace(/^[\s-*]+/, "").trim();
              return (
                <ul key={lIdx} className="list-disc pl-5 my-0.5 space-y-1">
                  <li>{parseMarkdownText(cleaned)}</li>
                </ul>
              );
            }

            if (isNumber) {
              const cleaned = processedLine.replace(/^\d+\.\s+/, "").trim();
              return (
                <ol key={lIdx} className="list-decimal pl-5 my-0.5 space-y-1">
                  <li>{parseMarkdownText(cleaned)}</li>
                </ol>
              );
            }

            return (
              <p
                key={lIdx}
                className={cn("min-h-[14px]", processedLine === "" && "h-2")}
              >
                {parseMarkdownText(processedLine)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Safe inline formatting helper (bold, italic, inline code) returning React nodes
  const parseMarkdownText = (str: string): React.ReactNode => {
    if (!str) return "";
    const tokens = str.split(/(\*\*|\*|`)/);
    const result: React.ReactNode[] = [];
    let isBold = false;
    let isItalic = false;
    let isCode = false;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === "**") {
        isBold = !isBold;
      } else if (token === "*") {
        isItalic = !isItalic;
      } else if (token === "`") {
        isCode = !isCode;
      } else if (token) {
        if (isCode) {
          result.push(
            <code key={i} className="bg-text-muted/10 px-1 py-0.5 rounded text-[10px] font-mono">
              {token}
            </code>
          );
        } else if (isBold) {
          result.push(<strong key={i}>{token}</strong>);
        } else if (isItalic) {
          result.push(<em key={i}>{token}</em>);
        } else {
          result.push(token);
        }
      }
    }
    return result;
  };

  return (
    <div className="flex flex-col gap-3 my-2 w-full">
      {/* Response Content Card */}
      <div className="rounded-lg p-4 bg-surface border border-text-muted/10 shadow-low flex flex-col gap-2 rounded-bl-none animate-fade-in">
        <div className="space-y-1">{renderFormattedText(text)}</div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between border-t border-text-muted/10 pt-2 mt-2">
          {/* Feedbacks Like / Dislike */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLike(true)}
              className={cn(
                "p-1.5 rounded-md hover:bg-background text-text-muted active:scale-95 transition-all",
                liked === true && "text-primary"
              )}
              title="Thumbs Up"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleLike(false)}
              className={cn(
                "p-1.5 rounded-md hover:bg-background text-text-muted active:scale-95 transition-all",
                liked === false && "text-error"
              )}
              title="Thumbs Down"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action Tasks Copy / Reg */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-text-primary active:scale-95 transition-all flex items-center gap-1 text-[10px] font-semibold"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-text-primary active:scale-95 transition-all flex items-center gap-1 text-[10px] font-semibold"
                title="Regenerate response"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
