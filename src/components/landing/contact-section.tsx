import { contact } from "@/content/landing";
import { IconListItem } from "@/components/ui/icon-list-item";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export function ContactSection() {
  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <SectionHeading animate={false}>
        <h2 id="contact-heading">Contact</h2>
        <ul className="contact-list">
          <IconListItem icon="mingcute:whatsapp-line">
            WhatsApp only: <a href={contact.whatsappUrl}>{contact.whatsappDisplay}</a>
          </IconListItem>
          <IconListItem icon="mingcute:mail-line">
            Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </IconListItem>
        </ul>
      </SectionHeading>
    </Section>
  );
}
