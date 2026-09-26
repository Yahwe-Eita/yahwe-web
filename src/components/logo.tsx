import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="brand app-brand" href={href} aria-label="Yahwe-Eita home">
      <Image src="/original-logo.png" alt="" width={33} height={40} loading="eager" />
      <span>YAHWE-EITA</span>
    </Link>
  );
}
