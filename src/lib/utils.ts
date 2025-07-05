import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getEnv(key: string): string {
  // Try Vite env (import.meta.env), fallback to process.env for Node
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    key in import.meta.env
  ) {
    return import.meta.env[key] as string;
  }
  if (typeof process !== "undefined" && process.env && key in process.env) {
    return process.env[key] as string;
  }
  throw new Error(`Environment variable ${key} is not defined`);
}
