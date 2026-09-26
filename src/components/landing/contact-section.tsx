"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { contact } from "@/content/landing";
import { useContact, type ContactInput } from "@/hooks/useContact";
import { getErrorMessage } from "@/lib/error-message";
import { localPhoneDigits } from "@/lib/validation";

const emptyForm: ContactInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const sendMessage = useContact();

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "phone" ? localPhoneDigits(value) : value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage.mutate(form, { onSuccess: () => setForm(emptyForm) });
  }

  return (
    <section className="site-section site-split" id="contact" aria-labelledby="contact-heading">
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
      <form className="contact-card form-stack" onSubmit={submit}>
        <div className="field-pair">
          <label className="field">
            First name
            <input
              name="firstName"
              autoComplete="given-name"
              required
              maxLength={100}
              value={form.firstName}
              onChange={update}
            />
          </label>
          <label className="field">
            Last name
            <input
              name="lastName"
              autoComplete="family-name"
              required
              maxLength={100}
              value={form.lastName}
              onChange={update}
            />
          </label>
        </div>
        <label className="field">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update}
          />
        </label>
        <label className="field">
          Phone number
          <div className="phone-field">
            <span>+233</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              pattern="\d{9}"
              required
              value={form.phone}
              onChange={update}
            />
          </div>
        </label>
        <label className="field">
          Message
          <textarea
            name="message"
            rows={5}
            required
            maxLength={2000}
            value={form.message}
            onChange={update}
          />
        </label>
        <FormMessage
          message={
            sendMessage.isError
              ? getErrorMessage(sendMessage.error, "Your message was not sent. Please try again.")
              : undefined
          }
        />
        <FormMessage
          tone="success"
          message={sendMessage.isSuccess ? "Message sent. A reply will follow by email or phone." : undefined}
        />
        <SubmitButton type="submit" pending={sendMessage.isPending} pendingLabel="Sending…">
          Send message
        </SubmitButton>
      </form>
    </section>
  );
}
