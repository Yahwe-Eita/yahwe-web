import Image from "next/image";

/** The Synergista credit. `onBrand` is for the dark brand surface; otherwise the logo follows the theme. */
export function PoweredBy({ onBrand = false }: { onBrand?: boolean }) {
  return (
    <div className="powered-by">
      {onBrand ? (
        <Image src="/synergista-dark.png" alt="" width={40} height={40} />
      ) : (
        <>
          <Image className="for-light" src="/synergista.png" alt="" width={40} height={40} />
          <Image className="for-dark" src="/synergista-dark.png" alt="" width={40} height={40} />
        </>
      )}
      <span>Powered by Synergista Culture Ltd</span>
    </div>
  );
}
