/**
 * Utility to format chat message text, replacing URLs with links.
 */
export function formatMessageText(text: string): string {
  if (!text) return "";
  
  // Basic URL to HTML link formatter
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-secondary underline hover:text-opacity-80">${url}</a>`;
  });
}
