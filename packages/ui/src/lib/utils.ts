import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateHash(address: string, startLength = 4, endLength = 4) {
  if (!address) return "";

  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength
  )}`;
}
