import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents);
}

export const RARITY_LABEL: Record<string, string> = {
  COMUN: "Común",
  POCO_COMUN: "Poco común",
  RARA: "Rara",
  EPICA: "Épica",
  LEGENDARIA: "Legendaria",
};

export const RARITY_COLOR: Record<string, string> = {
  COMUN: "rgba(161,161,170,0.15)",
  POCO_COMUN: "rgba(34,197,94,0.15)",
  RARA: "rgba(59,130,246,0.15)",
  EPICA: "rgba(168,85,247,0.15)",
  LEGENDARIA: "rgba(245,158,11,0.2)",
};

export const RARITY_TEXT: Record<string, string> = {
  COMUN: "#a1a1aa",
  POCO_COMUN: "#4ade80",
  RARA: "#60a5fa",
  EPICA: "#c084fc",
  LEGENDARIA: "#f59e0b",
};
