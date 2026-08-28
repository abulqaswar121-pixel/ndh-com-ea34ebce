import { createFileRoute } from '@tanstack/react-router';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { PageShell, PageIntro } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';

const title = 'Contact — Najeeb Digital Hub';
const description = 'Share a brief with Najeeb Digital Hub by form, WhatsApp or social. We reply within one business day.';

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Contact"
        title="Start with a clear brief."
        body="Tell us what you are building and what support you need. We reply within one business day."
      />
      <main className="content">
        <div className="contact-layout">
          <Reveal>
            <form className="contact-form card-panel">
              <label>
                Name
                <input required />
              </label>
              <label>
                Email
                <input type="email" required />
              </label>
              <label>
                How can we help?
                <textarea rows={6} required />
              </label>
              <button className="button" type="submit">
                Send enquiry
              </button>
            </form>
          </Reveal>
          <Reveal delay={80}>
            <aside className="contact-aside">
              <h2>Reach us directly</h2>
              <div className="contact-links">
                <a href="https://wa.me/2349029932794">
                  <MessageCircle size={16} /> +234 902 993 2794
                </a>
                <a href="https://www.facebook.com/share/1Be6HN8zjS/">
                  <Facebook size={16} /> Facebook
                </a>
                <a href="https://www.instagram.com/njb_digital_hub">
                  <Instagram size={16} /> Instagram
                </a>
              </div>
              <h3>Helpful to include</h3>
              <ul className="plain-list">
                <li>What you are building, in one or two lines.</li>
                <li>The outcome you need and any deadline.</li>
                <li>Whether you want agency delivery or Academy training.</li>
                <li>Any budget range you already have in mind.</li>
              </ul>
            </aside>
          </Reveal>
        </div>
      </main>

    </PageShell>
  );
}
