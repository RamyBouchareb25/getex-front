import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { backendUrl } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageUrl(image:string): string {
  return backendUrl + image;
}