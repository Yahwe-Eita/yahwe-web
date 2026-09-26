import { HttpError } from "@/lib/http-error";
import { getUnmetPasswordRequirement } from "@/lib/password";

export class ValidationError extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function textField(
  value: unknown,
  label: string,
  options: { min?: number; max?: number } = {},
) {
  if (typeof value !== "string") {
    throw new ValidationError(`${label} is required.`);
  }

  const text = value.trim();
  if (!text || (options.min && text.length < options.min)) {
    throw new ValidationError(`${label} is required.`);
  }
  if (options.max && text.length > options.max) {
    throw new ValidationError(`${label} is too long.`);
  }
  return text;
}

export function emailField(value: unknown) {
  const email = textField(value, "Email", { max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("Enter a valid email address.");
  }
  return email;
}

function stripCountryPrefix(digits: string) {
  if (digits.startsWith("233")) return digits.slice(3);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** Reduces typed input to at most the 9 local digits, dropping a leading 0 or 233. */
export function localPhoneDigits(value: string) {
  return stripCountryPrefix(value.replace(/\D/g, "")).slice(0, 9);
}

export function ghanaPhoneField(value: unknown) {
  const local = stripCountryPrefix(textField(value, "Phone number").replace(/\D/g, ""));
  if (!/^\d{9}$/.test(local)) {
    throw new ValidationError("Enter a valid 9-digit Ghana phone number.");
  }
  return { local, international: `233${local}` };
}

export function passwordField(value: unknown) {
  const password = textField(value, "Password");
  const unmetRequirement = getUnmetPasswordRequirement(password);
  if (unmetRequirement) {
    throw new ValidationError(unmetRequirement.message);
  }
  return password;
}

export function dateField(value: unknown) {
  const date = textField(value, "Date of birth");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ValidationError("Enter a valid date of birth.");
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new ValidationError("Enter a valid date of birth.");
  }
  return date;
}
