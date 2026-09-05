import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="brand app-brand" href={href} aria-label="Yahwe-Eita home">
      <span className="brand-mark" aria-hidden="true">
        Y
      </span>
      <span>YAHWE-EITA</span>
    </Link>
  );
}
