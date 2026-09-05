import "server-only";

import { RequestError } from "@/lib/server/request";
import { getSession } from "@/lib/server/session";

export async function requireApiSession() {
  const session = await getSession();
  if (!session) throw new RequestError("Unauthorized.", 401);
  return session;
}
