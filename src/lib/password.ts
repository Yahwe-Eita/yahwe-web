export const passwordRequirements = [
  {
    id: "length",
    label: "8 or more characters",
    message: "Password must contain at least 8 characters.",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    message: "Password must contain at least one uppercase letter.",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    message: "Password must contain at least one lowercase letter.",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    message: "Password must contain at least one number.",
    test: (password: string) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "One symbol",
    message: "Password must contain at least one symbol.",
    test: (password: string) => /[^A-Za-z0-9\s]/.test(password),
  },
] as const;

export function getUnmetPasswordRequirement(password: string) {
  return passwordRequirements.find((requirement) => !requirement.test(password));
}
