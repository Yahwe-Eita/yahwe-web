import { createElement as h, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/app/empty-state";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, initialOf } from "@/components/ui/avatar";
import { Band } from "@/components/ui/band";
import { Button } from "@/components/ui/button";
import { ButtonAnchor } from "@/components/ui/button-anchor";
import { ButtonGroup, buttonGroupClassName } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";
import { buttonClassName, buttonClassNames, type ButtonVariant } from "@/components/ui/button-variants";
import { Checkbox } from "@/components/ui/checkbox";
import { cx } from "@/components/ui/class-names";
import { ContentSection } from "@/components/ui/content-section";
import { CountdownCard } from "@/components/ui/countdown-card";
import { DialogIcon } from "@/components/ui/dialog";
import { ExternalLink } from "@/components/ui/external-link";
import { FeatureCard } from "@/components/ui/feature-card";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Grid, gridClassName } from "@/components/ui/grid";
import { IconLink } from "@/components/ui/icon-link";
import { IconListItem } from "@/components/ui/icon-list-item";
import { MemberRow } from "@/components/ui/member-row";
import { NetworkBadge } from "@/components/ui/network-badge";
import { messageClassName, Notice } from "@/components/ui/notice";
import { Paragraphs } from "@/components/ui/paragraphs";
import { PasswordField } from "@/components/ui/password-field";
import { PersonCard } from "@/components/ui/person-card";
import { PHONE_HINT, PhoneField } from "@/components/ui/phone-field";
import { Prose } from "@/components/ui/prose";
import { ScrollTable } from "@/components/ui/scroll-table";
import { Section, sectionClassName } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SettingsGroup } from "@/components/ui/settings-group";
import { Stack } from "@/components/ui/stack";
import { StatCard } from "@/components/ui/stat-card";
import { StatusPill, statusPillClassName } from "@/components/ui/status-pill";
import { TextField } from "@/components/ui/text-field";
import { TextLink } from "@/components/ui/text-link";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

const render = (element: ReactElement) => renderToStaticMarkup(element);

describe("class helpers", () => {
  it("joins truthy parts only", () => {
    expect(cx("a", false, undefined, null, "", "b")).toBe("a b");
    expect(cx(false)).toBe("");
  });

  it("maps every button variant to the existing stylesheet classes", () => {
    const expected: Record<ButtonVariant, string> = {
      primary: "button button-primary",
      secondary: "button button-secondary",
      submit: "submit-button",
      network: "submit-button network-badge",
      action: "primary-action",
      small: "small-button",
      muted: "small-button small-button-muted",
      whatsapp: "small-button whatsapp-button",
      danger: "danger-button",
      icon: "icon-button",
      menu: "landing-menu-button",
      logout: "logout-button",
    };
    expect(buttonClassNames).toEqual(expected);
    expect(buttonClassName("small", "extra")).toBe("small-button extra");
  });

  it("maps group, grid, section, pill and message variants", () => {
    expect(buttonGroupClassName("row")).toBe("button-row");
    expect(buttonGroupClassName("hero")).toBe("landing-actions");
    expect(gridClassName("feature-4")).toBe("feature-grid feature-grid-4");
    expect(sectionClassName("default")).toBe("site-section");
    expect(sectionClassName("split")).toBe("site-section site-split");
    expect(sectionClassName("join")).toBe("site-section join-section");
    expect(statusPillClassName("failed")).toBe("status-pill status-failed");
    expect(messageClassName("info")).toBe("form-message form-message-info");
  });

  it("takes the upper-case first letter as the initial", () => {
    expect(initialOf("ama")).toBe("A");
    expect(initialOf("")).toBe("");
  });
});

describe("buttons and links", () => {
  it("renders a non-submitting button by default", () => {
    expect(render(h(Button, { variant: "danger", children: "Delete" }))).toBe(
      '<button class="danger-button" type="button">Delete</button>',
    );
    expect(render(h(Button, { variant: "small", type: "submit", disabled: true, children: "Go" }))).toContain('type="submit"');
  });

  it("keeps the accessible name on icon buttons", () => {
    expect(render(h(Button, { variant: "icon", "aria-label": "Zoom in", children: "+" }))).toContain('aria-label="Zoom in"');
  });

  it("renders a link styled as a button", () => {
    expect(render(h(ButtonLink, { variant: "secondary", href: "/login", children: "Login" }))).toBe(
      '<a class="button button-secondary" href="/login">Login</a>',
    );
  });

  it("opens external button anchors in a new tab only when asked", () => {
    const external = render(h(ButtonAnchor, { variant: "whatsapp", href: "https://wa.me/1", external: true, children: "WA" }));
    expect(external).toContain('class="small-button whatsapp-button"');
    expect(external).toContain('target="_blank"');
    expect(external).toContain('rel="noreferrer"');
    expect(render(h(ButtonAnchor, { variant: "small", href: "sms:+1", children: "SMS" }))).not.toContain("target");
  });

  it("renders external links with an optional hidden arrow", () => {
    expect(render(h(ExternalLink, { href: "/#terms", children: "Terms" }))).toBe(
      '<a target="_blank" rel="noreferrer" href="/#terms">Terms</a>',
    );
    expect(render(h(ExternalLink, { href: "/#how", arrow: true, children: "Learn" }))).toBe(
      '<a class="external-link" target="_blank" rel="noreferrer" href="/#how">Learn<span aria-hidden="true">↗</span></a>',
    );
  });

  it("renders text and icon links", () => {
    expect(render(h(TextLink, { href: "/reset-password", children: "Forgot" }))).toContain('class="text-link"');
    const header = render(h(IconLink, { href: "/settings", label: "Settings", icon: "mingcute:settings-3-line" }));
    expect(header).toContain('class="header-icon"');
    expect(header).toContain('aria-label="Settings"');
    expect(render(h(IconLink, { href: "/", label: "Back", icon: "mingcute:arrow-left-line", variant: "back" }))).toContain(
      'class="back-link"',
    );
  });

  it("shows the pending label and busy state on submit buttons", () => {
    const pending = render(h(SubmitButton, { pending: true, pendingLabel: "Sending…", children: "Send" }));
    expect(pending).toContain('class="submit-button"');
    expect(pending).toContain('aria-busy="true"');
    expect(pending).toContain("Sending…");
    expect(pending).toContain("disabled");
    expect(render(h(SubmitButton, { pendingLabel: "x", variant: "network", children: "Pay" }))).toContain(
      'class="submit-button network-badge"',
    );
  });

  it("groups buttons with the row layout by default", () => {
    expect(render(h(ButtonGroup, null, "a"))).toBe('<div class="button-row">a</div>');
    expect(render(h(ButtonGroup, { variant: "credentials", children: "a" }))).toBe('<div class="credential-actions">a</div>');
  });
});

describe("form fields", () => {
  it("wraps the control in its label when no id is given", () => {
    expect(render(h(Field, { label: "Name", hint: "Hint", children: h("input") }))).toBe(
      '<label class="field"><span>Name</span><input/><small>Hint</small></label>',
    );
  });

  it("uses a for-attribute label when an id is given", () => {
    expect(render(h(Field, { label: "Password", htmlFor: "pw", children: h("input", { id: "pw" }) }))).toBe(
      '<div class="field"><label for="pw">Password</label><input id="pw"/></div>',
    );
  });

  it("passes input attributes through a text field", () => {
    const html = render(h(TextField, { label: "Email", type: "email", required: true }));
    expect(html).toBe('<label class="field"><span>Email</span><input type="email" required=""/></label>');
  });

  it("renders the Ghana prefix, nine-digit pattern and hint on phone fields", () => {
    const html = render(h(PhoneField, { label: "Phone number", name: "phone" }));
    expect(html).toContain('<div class="phone-field"><span aria-hidden="true">+233</span>');
    expect(html).toContain('type="tel"');
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain('pattern="\\d{9}"');
    expect(html).toContain(`<small>${PHONE_HINT}</small>`);
  });

  it("hides the password and labels the toggle", () => {
    const html = render(h(PasswordField, { id: "current-password", label: "Password", name: "password" }));
    expect(html).toContain('<label for="current-password">Password</label>');
    expect(html).toContain('type="password"');
    expect(html).toContain('class="password-toggle"');
    expect(html).toContain('aria-label="Show password"');
    expect(html).toContain('aria-pressed="false"');
  });

  it("renders a labelled checkbox", () => {
    expect(render(h(Checkbox, { name: "terms", children: "I agree" }))).toBe(
      '<label class="terms-check"><input type="checkbox" name="terms"/><span>I agree</span></label>',
    );
  });

  it("stacks forms and blocks", () => {
    expect(render(h(Form, null))).toBe('<form class="form-stack"></form>');
    expect(render(h(Stack, { "aria-live": "polite" }))).toBe('<div class="form-stack" aria-live="polite"></div>');
  });
});

describe("display primitives", () => {
  it("renders notices and pills", () => {
    expect(render(h(Notice, null, "Heads up"))).toBe('<p class="form-message form-message-info">Heads up</p>');
    expect(render(h(StatusPill, { tone: "active", children: "Recruiting" }))).toBe(
      '<span class="status-pill status-active">Recruiting</span>',
    );
    expect(render(h(NetworkBadge, null, "MTN Mobile Money"))).toBe('<div class="network-badge">MTN Mobile Money</div>');
    expect(render(h(DialogIcon, { variant: "momo", children: "₵" }))).toBe(
      '<span class="dialog-icon dialog-icon-momo" aria-hidden="true">₵</span>',
    );
  });

  it("renders avatars from a name or custom content", () => {
    expect(render(h(Avatar, { name: "kofi" }))).toBe('<span class="person-avatar" aria-hidden="true">K</span>');
    expect(render(h(Avatar, { name: "kofi", size: "profile" }))).toBe(
      '<span class="profile-avatar" aria-hidden="true">K</span>',
    );
    expect(render(h(Avatar, null, "*"))).toBe('<span class="person-avatar" aria-hidden="true">*</span>');
  });

  it("renders cards", () => {
    expect(render(h(StatCard, { label: "Cash earnings", value: "GH₵1", accent: true }))).toBe(
      '<article class="stat-card stat-card-accent"><span>Cash earnings</span><strong>GH₵1</strong></article>',
    );
    expect(render(h(CountdownCard, { dark: true, children: "x" }))).toBe('<article class="countdown-card countdown-card-dark">x</article>');
    expect(render(h(PersonCard, { name: "Esi" }))).toBe(
      '<article class="person-card"><span class="person-avatar" aria-hidden="true">E</span><strong>Esi</strong></article>',
    );
  });

  it("renders member rows as articles or list items", () => {
    expect(render(h(MemberRow, { avatar: "A", trailing: "T", children: "Body" }))).toBe(
      '<article class="member-row">A<div>Body</div>T</article>',
    );
    expect(render(h(MemberRow, { as: "li", avatar: "A", children: "Body" }))).toBe('<li class="member-row">A<div>Body</div></li>');
  });

  it("renders grids plain or staggered", () => {
    expect(render(h(Grid, { variant: "stats", as: "section", ariaLabel: "Summary", children: "x" }))).toBe(
      '<section class="stats-grid" aria-label="Summary">x</section>',
    );
    expect(render(h(Grid, { variant: "people", stagger: true, children: "x" }))).toBe('<div class="stagger people-grid">x</div>');
  });

  it("renders a titled content section", () => {
    expect(render(h(ContentSection, { title: "My downlines", children: "x" }))).toBe(
      '<section class="content-section"><div class="section-row"><h2>My downlines</h2></div>x</section>',
    );
  });

  it("renders an empty state with configurable icon, role and heading level", () => {
    expect(render(h(EmptyState, { title: "None" }))).toBe(
      '<div class="empty-state reveal"><span aria-hidden="true">○</span><h2>None</h2></div>',
    );
    expect(render(h(EmptyState, { title: "Oops", icon: "!", role: "alert", headingLevel: 1, animate: false }))).toBe(
      '<div class="empty-state" role="alert"><span aria-hidden="true">!</span><h1>Oops</h1></div>',
    );
  });

  it("renders the theme radio group", () => {
    const html = render(
      h(SegmentedControl<"a" | "b">, {
        label: "Theme",
        options: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ],
        value: "b",
        onChange: () => undefined,
      }),
    );
    expect(html).toContain('role="radiogroup" aria-label="Theme"');
    expect(html).toContain('class="" type="button" role="radio" aria-checked="false">A</button>');
    expect(html).toContain('class="selected" type="button" role="radio" aria-checked="true">B</button>');
  });

  it("renders settings groups as a fieldset or a labelled nav", () => {
    expect(render(h(SettingsGroup, { as: "fieldset", legend: "Preferences", children: "x" }))).toBe(
      '<fieldset class="settings-group"><legend>Preferences</legend>x</fieldset>',
    );
    expect(render(h(SettingsGroup, { as: "nav", label: "Help", children: "x" }))).toBe(
      '<nav class="settings-group" aria-label="Help">x</nav>',
    );
  });

  it("hides content visually only", () => {
    expect(render(h(VisuallyHidden, { as: "h2", id: "p", children: "Purpose" }))).toBe('<h2 class="sr-only" id="p">Purpose</h2>');
  });
});

describe("landing primitives", () => {
  it("renders sections and bands", () => {
    expect(render(h(Section, { variant: "split", id: "about", children: "x" }))).toBe(
      '<section class="site-section site-split" id="about">x</section>',
    );
    expect(render(h(Band, { dark: true, children: "x" }))).toBe('<div class="site-band site-band-dark">x</div>');
  });

  it("renders headings and prose with or without the entrance animation", () => {
    expect(render(h(SectionHeading, null, "x"))).toBe('<div class="reveal section-heading">x</div>');
    expect(render(h(SectionHeading, { animate: false, children: "x" }))).toBe('<div class="section-heading">x</div>');
    expect(render(h(Prose, null, "x"))).toBe('<div class="prose-block">x</div>');
    expect(render(h(Prose, { animate: true, children: "x" }))).toBe('<div class="reveal prose-block">x</div>');
  });

  it("renders one paragraph per item", () => {
    expect(render(h(Paragraphs, { items: ["One", "Two"] }))).toBe("<p>One</p><p>Two</p>");
  });

  it("renders only the feature card parts that are given", () => {
    expect(render(h(FeatureCard, { title: "Purpose" }, h("p", null, "Body")))).toBe(
      '<article class="feature-card"><h3>Purpose</h3><p>Body</p></article>',
    );
    const withIcon = render(h(FeatureCard, { icon: "mingcute:tree-line", lead: "Integrity" }));
    expect(withIcon).toMatch(/class="[^"]*\bfeature-icon"/);
    expect(withIcon).toContain('<p class="feature-card-lead">Integrity</p>');
  });

  it("renders icon list items", () => {
    const html = render(h(IconListItem, { icon: "mingcute:mail-line", children: "Email" }));
    expect(html.startsWith("<li>")).toBe(true);
    expect(html).toContain("<span>Email</span>");
  });

  it("wraps tables in a scroll container with a hidden caption", () => {
    expect(render(h(ScrollTable, { className: "reward-table", caption: "Rewards" }, h("tbody")))).toBe(
      '<div class="table-scroll"><table class="reward-table"><caption class="sr-only">Rewards</caption><tbody></tbody></table></div>',
    );
  });
});
