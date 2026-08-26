import { Link } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Menu, X, MessageCircle, Facebook, Instagram } from 'lucide-react';

const links: [string, string][] = [
  ['/agency', 'Agency'],
  ['/academy', 'Academy'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export function PageShell({ children, title }: { children?: ReactNode; title?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/ndh-logo.png" alt="Najeeb Digital Hub" width={42} height={42} />
        </Link>
        <nav className="desktop-nav">
          {links.map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <Link to="/signup" className="nav-action desktop-action">
          Get started
        </Link>
        <button
          className="menu-button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={24} />
        </button>
      </header>

      {open && (
        <div className="nav-backdrop" onClick={() => setOpen(false)}>
          <aside className="mobile-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <span>Navigate</span>
              <button className="close-button" aria-label="Close navigation" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
            {links.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link to="/signup" className="button" onClick={() => setOpen(false)}>
              Get started
            </Link>
          </aside>
        </div>
      )}

      {title ? (
        <main className="content">
          <h1>{title}</h1>
        </main>
      ) : null}

      {children}

      <footer>
        <div className="footer-brand">
          <img src="/ndh-logo.png" alt="Najeeb Digital Hub" width={44} height={44} />
          <p>Digital delivery and AI skills certification, run through one clear process.</p>
          <div className="social-links">
            <a href="https://wa.me/2349029932794" aria-label="WhatsApp">
              <MessageCircle size={17} />
            </a>
            <a href="https://www.facebook.com/share/1Be6HN8zjS/" aria-label="Facebook">
              <Facebook size={17} />
            </a>
            <a href="https://www.instagram.com/njb_digital_hub" aria-label="Instagram">
              <Instagram size={17} />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <strong style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Explore</strong>
          <Link to="/agency">Agency</Link>
          <Link to="/academy">Academy</Link>
          <Link to="/about">About</Link>
          <Link to="/talent-application">Work with us</Link>
        </div>

        <div className="footer-links">
          <strong style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Company</strong>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>

        <div className="footer-base">© {new Date().getFullYear()} Najeeb Digital Hub. Nigeria · Worldwide.</div>
      </footer>
    </>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{body}</p>
    </section>
  );
}

export function Button({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link to={to} className={secondary ? 'button button-secondary' : 'button'}>
      {children}
    </Link>
  );
}
