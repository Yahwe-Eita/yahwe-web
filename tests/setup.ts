import { afterEach, vi } from "vitest";
import { cookieJar } from "./cookie-jar";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: <T>(fn: T) => fn }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name) } : undefined),
    set: (name: string, value: string, options?: { maxAge?: number }) => {
      if (!value || options?.maxAge === 0) cookieJar.delete(name);
      else cookieJar.set(name, value);
    },
  }),
}));

process.env.SESSION_SECRET = "test-session-secret-with-more-than-32-characters";
process.env.YAHWE_API_URL = "https://api.example.test/api";

afterEach(() => {
  cookieJar.clear();
  vi.unstubAllGlobals();
});
