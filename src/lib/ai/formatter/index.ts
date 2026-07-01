/**
 * Clean whitespace and format strings for markdown output rendering.
 */
export function formatMarkdown(text: string): string {
  if (!text) return "";
  return text.trim();
}

/**
 * Format raw numbers to standard Indonesian Rupiah currency text
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}
