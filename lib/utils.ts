import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { backendUrl } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  return backendUrl + image;
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Format as +213XXXXXXXXX
  return `+213${cleaned}`;
}