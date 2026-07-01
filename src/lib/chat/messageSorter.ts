import { Conversation } from "@/features/chat/types";

/**
 * Sorts conversations: pinned conversations first, then sorted by the latest message timestamp descending.
 */
export function sortConversations(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => {
    // Pinned status priority
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Latest message timestamp priority
    const aLastMsg = a.messages[a.messages.length - 1];
    const bLastMsg = b.messages[b.messages.length - 1];

    const aTime = aLastMsg ? new Date(aLastMsg.timestamp).getTime() : 0;
    const bTime = bLastMsg ? new Date(bLastMsg.timestamp).getTime() : 0;

    return bTime - aTime;
  });
}
