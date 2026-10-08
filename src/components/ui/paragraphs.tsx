export function Paragraphs({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}
