"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import ChatsListView from "@/features/chat/components/ChatsListView";
import ChatRoomView from "@/features/chat/components/ChatRoomView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

function ChatsContent() {
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get("id");
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);

  // Sync search parameter changes with our global chat store
  useEffect(() => {
    setActiveChatId(activeChatId);
  }, [activeChatId, setActiveChatId]);

  if (activeChatId) {
    return <ChatRoomView chatId={activeChatId} />;
  }

  return <ChatsListView />;
}

export default function ChatsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center p-8 min-h-[60vh] text-xs text-text-muted">
          Loading conversation interface...
        </div>
      }>
        <ChatsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
