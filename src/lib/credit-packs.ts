export const CREDIT_PACKS = [
  { key: "STARTER",   label: "Starter",   credits: 10,  amount: 1000,  perUnit: 100, popular: false },
  { key: "BASIC",     label: "Basic",     credits: 20,  amount: 1500,  perUnit: 75,  popular: false },
  { key: "STANDARD",  label: "Standard",  credits: 30,  amount: 2500,  perUnit: 83,  popular: false },
  { key: "PRO",       label: "Pro",       credits: 50,  amount: 5500,  perUnit: 110, popular: true  },
  { key: "MAX",       label: "Max",       credits: 100, amount: 10000, perUnit: 100, popular: false },
  { key: "UNLIMITED", label: "Ilimitado", credits: -1,  amount: 18000, perUnit: 0,   popular: false },
] as const;

export type PackKey = typeof CREDIT_PACKS[number]["key"];
