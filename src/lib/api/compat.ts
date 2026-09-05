import type { GenealogyData, GenealogyPerson, HomeData, ProfileData } from "@/lib/api/types";

function addDays(value: string | undefined, days: number) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export function withHomeFallbacks(data: HomeData): HomeData {
  if (!data.user) return data;
  return {
    ...data,
    cashEarned: data.cashEarned ?? data.weeklyCashEarnings,
    user: {
      ...data.user,
      recruitWindowEndsAt: data.user.recruitWindowEndsAt ?? addDays(data.user.createdAt, 8),
      cycleEndsAt: data.user.cycleEndsAt ?? addDays(data.user.createdAt, 56),
    },
  };
}

export function withProfileFallbacks(data: ProfileData): ProfileData {
  if (!data.userInfo) return data;
  return {
    ...data,
    userInfo: {
      ...data.userInfo,
      cycleEndsAt: data.userInfo.cycleEndsAt ?? addDays(data.userInfo.createdAt, 56),
    },
  };
}

export function withGenealogyFallbacks(data: GenealogyData): GenealogyData {
  const fill = (person: GenealogyPerson): GenealogyPerson => ({
    ...person,
    active: person.active ?? true,
    recruits: (person.recruits ?? []).map(fill),
  });
  return { ...data, user: fill(data.user) };
}
