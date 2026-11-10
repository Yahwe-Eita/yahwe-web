import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PoweredBy } from "@/components/powered-by";

describe("PoweredBy", () => {
  it("credits Synergista Culture Ltd with a logo for each theme", () => {
    const html = renderToStaticMarkup(h(PoweredBy));
    expect(html).toContain("Powered by Synergista Culture Ltd");
    expect(html).toMatch(/class="for-light"[^>]*synergista\.png/);
    expect(html).toMatch(/class="for-dark"[^>]*synergista-dark\.png/);
  });

  it("uses only the light-on-dark logo on the brand surface", () => {
    const html = renderToStaticMarkup(h(PoweredBy, { onBrand: true }));
    expect(html).toContain("Powered by Synergista Culture Ltd");
    expect(html).toContain("synergista-dark.png");
    expect(html).not.toMatch(/synergista\.png/);
    expect(html).not.toContain("for-light");
  });
});
