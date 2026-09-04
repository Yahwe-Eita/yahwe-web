import "server-only";

import { redirect } from "next/navigation";
import type {
  ApiEnvelope,
  GenealogyPerson,
  HomeData,
  ProfileData,
  Transaction,
} from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { getSession } from "@/lib/server/session";

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function getHomeData() {
  const session = await requireSession();
  const response = await apiRequest<ApiEnvelope<HomeData>>("/home", {
    token: session.accessToken,
  });
  return response.data ?? {};
}

export async function getProfileData() {
  const session = await requireSession();
  const response = await apiRequest<ApiEnvelope<ProfileData>>("/profile", {
    token: session.accessToken,
  });
  return response.data ?? {};
}

export async function getGenealogyData() {
  const session = await requireSession();
  const response = await apiRequest<ApiEnvelope<GenealogyPerson>>(
    "/geneology",
    { token: session.accessToken },
  );
  return response.data ?? null;
}

export async function getTransactions() {
  const session = await requireSession();
  const response = await apiRequest<ApiEnvelope<Transaction[]>>(
    "/transactions/mobile",
    { token: session.accessToken },
  );
  return {
    transactions: response.data ?? [],
    total: response.total ?? response.data?.length ?? 0,
  };
}
