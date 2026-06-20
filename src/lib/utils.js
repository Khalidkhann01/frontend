// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score) {
  if (score >= 8.5) return "text-green-400";
  if (score >= 6) return "text-amber-400";
  return "text-red-400";
}

export function recommendationColor(rec) {
  if (rec.toLowerCase().includes("proceed") && !rec.toLowerCase().includes("caution"))
    return "green";
  if (rec.toLowerCase().includes("caution")) return "amber";
  return "red";
}