import { passwordRequirements } from "@/lib/password";

export function PasswordRequirements({ id, password }: { id: string; password: string }) {
  return (
    <ul className="password-requirements" id={id}>
      {passwordRequirements.map((requirement) => {
        const met = requirement.test(password);
        return (
          <li className={met ? "requirement-met" : ""} key={requirement.id}>
            <span aria-hidden="true">{met ? "✓" : "○"}</span>
            {requirement.label}
            <span className="sr-only">{met ? " (met)" : " (not met yet)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
