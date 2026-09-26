/** A decimal amount as the API serialises it, e.g. "150.00". Format only with formatCurrency. */
export type Money = string;

export interface ApiEnvelope<T> {
  status?: boolean;
  message?: string;
  data?: T;
  accountExists?: boolean;
  total?: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: number; userId: string; name: string; email: string };
}

export interface HomeRecruit {
  id: number;
  name: string;
  phone: string;
}

export interface HomeData {
  airtimeBalance: Money;
  cashEarned: Money;
  level: number;
  totalRecruits: number;
  user: {
    id: number;
    name: string;
    recruitWindowClosed: boolean;
    recruitWindowEndsAt: string;
    cycleEndsAt: string;
    createdAt: string;
    recruits: HomeRecruit[];
  };
}

export interface ProfileRecruit {
  userId: string;
  name: string;
  blocked: boolean;
}

export interface ProfileData {
  balance: Money;
  cashEarned: Money;
  level: number;
  totalRecruits: number;
  userInfo: {
    name: string;
    createdAt: string;
    recruitWindowEndsAt: string;
    cycleEndsAt: string;
    recruits: ProfileRecruit[];
  };
}

export type TransactionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type TransactionType = "CASH" | "AIRTIME" | "REVENUE";

export interface Transaction {
  id: number;
  amount: Money;
  description?: string | null;
  status: TransactionStatus;
  type: TransactionType;
  reference: string;
  createdAt: string;
}

export interface TransactionsPage {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GenealogyPerson {
  id: number;
  name: string;
  phone: string;
  email: string;
  recruitWindowClosed: boolean;
  active: boolean;
  recruits: GenealogyPerson[];
}

export interface GenealogyData {
  user: GenealogyPerson;
  totalRecruits: number;
  maxDepth: number;
  isTruncated: boolean;
}

export interface ProgrammeLevel {
  level: number;
  members: number;
  rewardPerMember: Money;
  rewardType: "AIRTIME" | "CASH";
  levelTotal: Money;
}

export interface Programme {
  feeAmount: Money;
  selfAirtimeReward: Money;
  airtimeReward: Money;
  cashReward: Money;
  depthLimit: number;
  requiredDownlines: number;
  minimumAge: number;
  recruitWindowDays: number;
  cycleDays: number;
  targetCashEarnings: Money;
  targetAirtimeEarnings: Money;
  levels: ProgrammeLevel[];
}

export interface DownlineSignup {
  userId: string;
  name: string;
  level: number;
  joinedAt: string;
  sponsorName: string;
}

export interface SponsorResult {
  sponsor: { name: string; phone: string };
}

export type PhoneVerificationResult =
  | { accountExists: true }
  | { accountExists: false; name: string; phone: string };

export interface RegistrationInput {
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface RegistrationResult {
  status: "validated" | "complete";
  user?: SessionUser;
}

export type FeeOutcome = { outcome: "awaiting_payment" } | { outcome: "registered"; user: SessionUser };

export interface PaymentStatusResult {
  status: TransactionStatus;
  reason?: string;
}

export interface ResetPasswordResult {
  pinId: string;
  message: string;
}

export interface ChangePasswordInput {
  pinId: string;
  code: string;
  newPassword: string;
}

export interface InvitePayload {
  name: string;
  phone: string;
}

export interface SuccessResult {
  success: true;
}
