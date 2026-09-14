import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="brand app-brand" href={href} aria-label="Yahwe-Eita home">
      <img
        src="/original-logo.png"
        alt="Yahwe-Eita"
        style={{ width: 40, height: 40 }}
      />
      <span>YAHWE-EITA</span>
    </Link>
  );
}
