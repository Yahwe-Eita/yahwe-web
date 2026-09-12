import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// Simple in‑memory fallback for environments where AsyncStorage is unavailable (e.g., web)
const fallbackStorage = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
};

interface User {
  id: string;
  isLoggedIn: boolean;
  name: string;
  email: string;
  picture?: string;
  token: string;
  refreshToken?: string;
  password?: string;
}

type Theme = "light" | "dark";

interface AppState {
  // User state
  user: User | null;
  sponsorId: number;
  accessToken: string;
  globalEmail: string;
  globalPassword: string;

  // Theme state
  theme: Theme;

  // User actions
  setUser: (user: User | null) => void;
  setSponsorId: (id: number) => void;
  setAccessToken: (token: string) => void;
  setGlobalEmail: (email: string) => void;
  setGlobalPassword: (password: string) => void;
  logout: () => void;

  // Theme actions
  setTheme: (theme: Theme) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      sponsorId: 0,
      accessToken: "",
      globalEmail: "",
      globalPassword: "",
      theme: "light",
      setUser: (user) => set({ user }),
      setSponsorId: (sponsorId) => {
        console.log("[Store] Setting sponsorId:", sponsorId);
        set({ sponsorId });
      },
      setAccessToken: (accessToken) => set({ accessToken }),
      setGlobalEmail: (globalEmail) => set({ globalEmail }),
      setGlobalPassword: (globalPassword) => set({ globalPassword }),
      logout: () => set({ user: null, accessToken: "", sponsorId: 0 }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "yahwe-eita-storage",
      storage: createJSONStorage(() => {
        // Prefer localStorage in the browser; fallback to in‑memory storage for other environments
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
          return window.localStorage;
        }
        // In‑memory no‑op fallback
        return fallbackStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        sponsorId: state.sponsorId,
        accessToken: state.accessToken,
        globalEmail: state.globalEmail,
        globalPassword: state.globalPassword,
        theme: state.theme,
      }),
    }
  )
);

export const useUser = () => useStore((state) => state.user);
export const useSponsorId = () => useStore((state) => state.sponsorId);
export const useAccessToken = () => useStore((state) => state.accessToken);
export const useTheme = () => useStore((state) => state.theme);
