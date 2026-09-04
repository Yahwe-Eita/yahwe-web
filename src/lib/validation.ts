export class ValidationError extends Error {
  public readonly status = 400;
  public readonly expose = true;
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

export function ghanaPhoneField(value: unknown) {
  const digits = textField(value, "Phone number").replace(/\D/g, "");
  const local = digits.startsWith("233")
    ? digits.slice(3)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;

  if (!/^\d{9}$/.test(local)) {
    throw new ValidationError("Enter a valid 9-digit Ghana phone number.");
  }
  return { local, international: `233${local}` };
}

export function passwordField(value: unknown) {
  const password = textField(value, "Password");
  if (password.length < 8) {
    throw new ValidationError("Password must contain at least 8 characters.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ValidationError("Password must contain at least one symbol.");
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

  const today = new Date();
  const minimumBirthDate = new Date(
    Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()),
  );
  if (parsed > minimumBirthDate) {
    throw new ValidationError("You must be at least 18 years old to register.");
  }

  return date;
}
