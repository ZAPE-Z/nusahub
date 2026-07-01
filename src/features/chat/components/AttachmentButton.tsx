"use client";

import React from "react";
import { Paperclip } from "lucide-react";
import { useToast } from "@/store/useToastStore";

export default function AttachmentButton() {
  const { toast } = useToast();

  const handleClick = () => {
    toast(
      "Attachment Options",
      "Camera, Gallery, and Catalog attachments are locked for this prototype (UI Only).",
      "default"
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-2 rounded-md hover:bg-background text-text-muted hover:text-text-primary active:scale-95 transition-all"
      title="Attach file"
    >
      <Paperclip className="h-5 w-5" />
    </button>
  );
}
