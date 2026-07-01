/**
 * Unified Date Parser and Filtering Utilities for NusaHub
 */

export function parseTimestamp(timestampStr: string): Date {
  if (!timestampStr) return new Date();
  
  const lower = timestampStr.toLowerCase();

  // Handle "Just now" or relative strings
  if (lower.includes("just now") || lower.includes("now")) {
    return new Date();
  }
  
  if (lower.includes("min")) {
    const mins = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "0", 10);
    return new Date(Date.now() - mins * 60 * 1000);
  }
  if (lower.includes("hour")) {
    const hours = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "0", 10);
    return new Date(Date.now() - hours * 60 * 60 * 1000);
  }
  if (lower.includes("day")) {
    const days = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "0", 10);
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  // Try to parse localized formats e.g. "28/06/2026, 09:00:00"
  const cleanStr = timestampStr.split(",")[0].trim();
  const parts = cleanStr.split(/[\/\-\.]/); // Matches /, -, or .
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed Month
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    return new Date(year, month, day);
  }
  
  const parsed = new Date(timestampStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  // Default fallback (e.g. "09:30" short time defaults to today)
  return new Date();
}

export function isDateInFilter(timestampStr: string, filter: "all" | "today" | "week"): boolean {
  if (filter === "all") return true;
  
  const txDate = parseTimestamp(timestampStr);
  const now = new Date();
  
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTx = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
  
  const diffTime = Math.abs(startOfToday.getTime() - startOfTx.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // exact days count
  
  if (filter === "today") {
    return diffDays === 0;
  }
  if (filter === "week") {
    return diffDays <= 7;
  }
  return true;
}
