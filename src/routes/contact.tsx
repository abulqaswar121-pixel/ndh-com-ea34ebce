import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { FamilyPage, FamilyIntro } from "@/components/ecosystem/FamilyPage";
import { submitEnquiry } from "@/lib/catalog.functions";
import { SITE_CONTACT as contact } from "@/lib/site-contact";

const title = "Contact NDH — Let’s find your next step";
const description = `Contact Najeeb Digital Hub at ${contact.address}. Call ${contact.phone} or email ${contact.support}.`;
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Help me find the right business");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      await submitEnquiry({
        data: { full_name: fullName, email, phone, subject, message, source: "contact" },
      });
      setState("sent");
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setState("idle");
      setError(
        "We couldn’t confirm your enquiry. Your message is still here — please try again, email us or use WhatsApp below.",
      );
    }
  }
  return (
    <FamilyPage>
      <FamilyIntro
        eyebrow="Contact NDH"
        title="A conversation is a good place to start."
        body="A question, an idea, a learning goal or a platform you need help with — tell us what’s on your mind. We’ll help you find the right part of the family."
      />
      <section className="family-band is-white">
        <div className="family-wrap family-contact-methods">
          <a className="family-card" href={`tel:${contact.telephone}`}>
            <Phone className="family-contact-icon" size={23} />
            <h2>Give us a call</h2>
            <p>Speak to us about your next step.</p>
            <strong dir="ltr">{contact.phone}</strong>
            <ArrowUpRight size={18} />
          </a>
          <a className="family-card" href={contact.whatsapp}>
            <MessageCircle className="family-contact-icon" size={23} />
            <h2>Send a WhatsApp</h2>
            <p>Start with a short message about what you need.</p>
            <strong>Chat with NDH</strong>
            <ArrowUpRight size={18} />
          </a>
          <a className="family-card" href={`mailto:${contact.support}`}>
            <Mail className="family-contact-icon" size={23} />
            <h2>Get support</h2>
            <p>Questions about a service or an existing request.</p>
            <strong>{contact.support}</strong>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="family-band">
        <div className="family-wrap family-contact-grid">
          <div className="family-card family-form-card">
            <p className="family-kicker">Tell us a little more</p>
            <h2>What can we help you with?</h2>
            <p>You don’t need a finished brief. A few clear details are enough.</p>
            <form className="family-form" onSubmit={onSubmit} aria-busy={state === "sending"}>
              <fieldset disabled={state === "sending"}>
                <div className="family-form-row">
                  <label htmlFor="contact-name">
                    Your name <span>(required)</span>
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={200}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                  <label htmlFor="contact-email">
                    Email address <span>(required)</span>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={200}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <label htmlFor="contact-phone">
                  Phone or WhatsApp <span>(optional)</span>
                  <input
                    id="contact-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    maxLength={60}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label htmlFor="contact-subject">
                  What brings you here?
                  <select
                    id="contact-subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {[
                      "Help me find the right business",
                      "NDH Agency — digital work",
                      "NDH Academy — learning",
                      "NDH AgriCapital — cooperative farming and investment",
                      "NDH eStore — vendors, storefronts and commerce",
                      "NDH SchoolDesk — Coming Soon enquiries",
                      "NDH Travel — Coming Soon enquiries",
                      "NDH iHospital — Coming Soon enquiries",
                      "Support with an existing request",
                      "Something else",
                    ].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="contact-message">
                  Your message <span>(required)</span>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    required
                    minLength={10}
                    maxLength={5000}
                    placeholder="What would you like to do, and where do you need a hand?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
                <p className="family-small">
                  We’ll use these details to handle your enquiry. Please don’t include passwords,
                  payment details or sensitive records. Read our{" "}
                  <Link to="/privacy">privacy notice</Link>.
                </p>
                <button
                  className="gw-button gw-button-primary"
                  type="submit"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? "Sending…" : "Send your message"}
                  <Send size={16} />
                </button>
              </fieldset>
              {state === "sent" && (
                <p className="family-form-success" role="status">
                  Thank you — your enquiry has been received. We’ll respond using the details you
                  provided.
                </p>
              )}
              {error && (
                <div className="family-form-error" role="alert">
                  <p>{error}</p>
                  <a href={`mailto:${contact.support}`}>Email support</a> ·{" "}
                  <a href={contact.whatsapp}>Open WhatsApp</a>
                </div>
              )}
            </form>
          </div>
          <aside className="family-contact-aside">
            <div className="family-card">
              <span className="family-icon">
                <Mail size={23} />
              </span>
              <h2>Prefer email?</h2>
              <p>For general enquiries, introductions and partnerships:</p>
              <a className="family-text-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <p>For help with a service or an existing enquiry:</p>
              <a className="family-text-link" href={`mailto:${contact.support}`}>
                {contact.support}
              </a>
            </div>
            <div className="family-card">
              <p className="family-kicker">A helpful first message</p>
              <h2>Give us a little context.</h2>
              <ul className="family-checklist">
                <li>What you’re trying to achieve.</li>
                <li>The business or platform involved, if you know it.</li>
                <li>Any timing or practical requirements.</li>
                <li>The best way for us to reach you.</li>
              </ul>
              <p className="family-small">
                Not sure which business fits? Choose “Help me find the right business” and we’ll
                take it from there.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className="family-band is-white" id="location">
        <div className="family-wrap family-location-layout">
          <div>
            <p className="family-kicker">Find us in Sokoto</p>
            <h2>
              Local roots.
              <br />
              An open conversation.
            </h2>
            <p>Have a question before visiting? Call or message us to arrange a convenient time.</p>
          </div>
          <div className="family-card family-address-card">
            <span className="family-icon">
              <MapPin size={25} />
            </span>
            <h3>Najeeb Digital Hub</h3>
            <address>{contact.address}</address>
            <a
              className="gw-button gw-button-ghost"
              href={contact.map}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open location in Google Maps <ArrowUpRight size={17} />
            </a>
            <p className="family-small">
              Map search opens in a new tab. Please contact us to confirm directions before
              travelling.
            </p>
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
