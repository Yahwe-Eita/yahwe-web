export interface ApiEnvelope<T> {
  data?: T;
  accountExists?: boolean;
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
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
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
  id?: string | number;
  userId?: string;
  name: string;
  phone?: string;
  verified?: boolean;
  recruitWindowClosed?: boolean | string;
  active?: boolean;
  recruits?: Recruit[];
}

export interface HomeData {
  balance?: number;
  airtimeBalance?: number;
  cashEarned?: number;
  weeklyCashEarnings?: number;
  earnedThisWeek?: number;
  level?: number;
  totalRecruits?: number;
  user?: {
    createdAt?: string;
    recruitWindowEndsAt?: string;
    cycleEndsAt?: string;
    recruitWindowClosed?: boolean;
    recruits?: Recruit[];
  };
  userInfo?: {
    createdAt?: string;
    cycleEndsAt?: string;
    recruits?: Recruit[];
  };
}

export interface ProfileData {
  balance?: number;
  level?: number;
  totalRecruits?: number;
  userInfo?: {
    createdAt?: string;
    cycleEndsAt?: string;
    recruits?: Recruit[];
  };
}

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
  id?: string | number;
  recruits?: GenealogyPerson[];
}

export interface GenealogyData {
  user: GenealogyPerson;
  totalRecruits: number;
  maxDepth: number;
  isTruncated: boolean;
}

export interface TransactionsData {
  transactions: Transaction[];
  total: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SponsorPayload {
  phone: string;
}

export interface SponsorResult {
  sponsor: { name: string; phone: string };
}

export interface PhoneVerificationResult {
  name?: string;
  phone?: string;
  accountExists?: boolean;
}

export interface GhanaCardResult {
  card: { name?: string; dateOfBirth?: string };
}

export interface RegistrationInput {
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface ResetPasswordResult {
  status: boolean;
  message: string;
  pinId: string | null;
}

export interface ChangePasswordInput {
  pinId: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordResult {
  status: boolean;
  message: string;
}

export interface RegistrationResult {
  status: "validated" | "complete";
  user?: SessionUser;
}

export interface PaymentStatusResult {
  status?: string;
}

export interface FeeResult {
  data?: { reference?: string };
  message?: string;
  status?: boolean | string;
}

export interface InvitePayload {
  name: string;
  phone: string;
}

export interface InvitedUser {
  id?: string;
  name: string;
  phone?: string;
  status?: string;
}

export interface SuccessResult {
  success: true;
}
