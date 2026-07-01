import { Conversation } from "@/features/chat/types";

/**
 * Filters conversations matching query text in participant names, handles, or message bodies.
 */
export function searchConversations(
  conversations: Conversation[],
  query: string
): Conversation[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return conversations;

  return conversations.filter((conv) => {
    const matchName = conv.participant.name.toLowerCase().includes(normalizedQuery);
    const matchHandle = conv.participant.handle.toLowerCase().includes(normalizedQuery);
    const matchMessages = conv.messages.some((msg) =>
      msg.text.toLowerCase().includes(normalizedQuery)
    );

    return matchName || matchHandle || matchMessages;
  });
}
