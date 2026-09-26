import { Icon } from "@/components/icon";
import { contact } from "@/content/landing";

export function ContactSection() {
  return (
    <section className="site-section" id="contact" aria-labelledby="contact-heading">
      <div className="section-heading">
        <h2 id="contact-heading">Contact</h2>
        <ul className="contact-list">
          <li>
            <Icon name="mingcute:whatsapp-line" size={22} />
            <span>
              WhatsApp only: <a href={contact.whatsappUrl}>{contact.whatsappDisplay}</a>
            </span>
          </li>
          <li>
            <Icon name="mingcute:mail-line" size={22} />
            <span>
              Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
