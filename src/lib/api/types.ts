export interface ApiEnvelope<T> {
  data?: T;
  message?: string;
  status?: boolean | string;
  total?: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthPayload {
  access_token: string;
  refresh_token?: string;
  user: {
    id?: string;
    userId?: string;
    name?: string;
    email?: string;
    picture?: string;
  };
}

export interface Recruit {
  id?: string;
  userId?: string;
  name: string;
  phone?: string;
  verified?: boolean;
  recruitWindowClosed?: boolean | string;
  recruits?: Recruit[];
}

export interface HomeData {
  balance?: number;
  earnedThisWeek?: number;
  level?: number;
  totalRecruits?: number;
  userInfo?: {
    createdAt?: string;
    recruits?: Recruit[];
  };
}

export type ProfileData = HomeData;

export interface Transaction {
  id: string;
  amount: number;
  createdAt: string;
  description?: string;
  reference?: string;
  status?: string;
  type?: string;
  user?: { name?: string };
}

export interface GenealogyPerson extends Recruit {
  recruits?: GenealogyPerson[];
}
