/**
 * Formats an ISO date string into a friendly message header (e.g. Today, Yesterday, or DD/MM/YYYY).
 */
export function formatFriendlyDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  
  const isToday = date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
    
  if (isToday) return "Today";
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
    
  if (isYesterday) return "Yesterday";
  
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/**
 * Formats an ISO date string into short time (e.g. hh:mm)
 */
export function formatShortTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch {
    return "";
  }
}
