import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { PageShell, PageIntro } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { submitEnquiry } from '@/lib/catalog.functions';

const title = 'Contact — Najeeb Digital Hub';
const description = 'Share a brief with Najeeb Digital Hub by form, WhatsApp or social. We reply within one business day.';

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      await submitEnquiry({ data: { full_name: fullName, email, phone, message, source: 'contact' } });
      setState('sent');
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setState('idle');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try WhatsApp instead.');
    }
  }

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
            <form className="contact-form card-panel" onSubmit={onSubmit}>
              <label>
                Name
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>
              <label>
                Email
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                Phone or WhatsApp (optional)
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                How can we help?
                <textarea rows={6} required value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>
              <button className="button" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
              {state === 'sent' && (
                <p className="form-success">
                  Thank you — your enquiry has been received. We reply within one business day.
                </p>
              )}
              {error && <p className="form-error">{error}</p>}
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
