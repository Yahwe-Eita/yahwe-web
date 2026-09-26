export const queryKeys = {
  home: ["account", "home"] as const,
  profile: ["account", "profile"] as const,
  genealogy: ["account", "genealogy"] as const,
  notifications: ["account", "notifications"] as const,
  transactionsPage: (page: number) => ["account", "transactions", page] as const,
  paymentStatus: ["registration", "payment-status"] as const,
};
