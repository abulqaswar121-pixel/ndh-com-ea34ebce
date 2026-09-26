import { Link, Navigate } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, ChevronDown, Menu, X, MessageCircle, Facebook, Instagram, ArrowUpRight, Send } from 'lucide-react';
import { roleHome, useAuth } from '@/lib/auth';
import { BrandMark } from '@/components/BrandMark';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SiteSearch, SiteSearchTrigger } from '@/components/SiteSearch';
import { agencyMenu, academyMenu } from '@/lib/nav-data';

const links: [string, string][] = [
  ['/agency', 'Agency'],
  ['/academy', 'Academy'],
  ['/work', 'Work'],
  ['/blog', 'Blog'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const megaMenuFor: Record<string, boolean> = { '/agency': true, '/academy': true };

export function PageShell({
  children,
  title,
  allowSignedIn = false,
}: {
  children?: ReactNode;
  title?: string;
  allowSignedIn?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { user, role, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setShowTop(window.scrollY > 640);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('nav-is-open', open);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('nav-is-open');
    };
  }, [open]);

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMegaOpen(null);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMegaOpen(null);
    }
    document.addEventListener('mousedown', onClickAway);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickAway);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  if (!allowSignedIn && !loading && user && role) {
    return <Navigate to={roleHome(role) as never} replace />;
  }

  return (
    <>
      <AnnouncementBar />
      <OfflineBanner />
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <BrandMark title="Najeeb Digital Hub" />
        </Link>
        <nav className="desktop-nav" ref={navRef}>
          {links.map(([to, label]) =>
            megaMenuFor[to] ? (
              <div className="nav-mega-wrap" key={to}>
                <button
                  type="button"
                  className={megaOpen === to ? 'nav-mega-trigger is-open' : 'nav-mega-trigger'}
                  aria-expanded={megaOpen === to}
                  onClick={() => setMegaOpen((cur) => (cur === to ? null : to))}
                  onMouseEnter={() => setMegaOpen(to)}
                >
                  {label} <ChevronDown size={13} />
                </button>
                {megaOpen === to && (
                  <div className="nav-mega-panel" onMouseLeave={() => setMegaOpen(null)}>
                    {to === '/agency' && (
                      <div className="nav-mega-grid">
                        {agencyMenu.map((item) => (
                          <Link key={item.to} to={item.to} className="nav-mega-item" onClick={() => setMegaOpen(null)}>
                            <item.icon size={17} />
                            <span>
                              <strong>{item.label}</strong>
                              <small>{item.blurb}</small>
                            </span>
                          </Link>
                        ))}
                        <Link to="/agency" className="nav-mega-viewall" onClick={() => setMegaOpen(null)}>
                          View all services <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    )}
                    {to === '/academy' && (
                      <div className="nav-mega-grid">
                        {academyMenu.map((item) => (
                          <Link
                            key={item.school}
                            to="/academy"
                            search={{ school: item.school }}
                            className="nav-mega-item"
                            onClick={() => setMegaOpen(null)}
                          >
                            <span className="nav-mega-dot" aria-hidden="true" />
                            <span>
                              <strong>{item.school}</strong>
                              <small>{item.blurb}</small>
                            </span>
                          </Link>
                        ))}
                        <Link to="/academy" className="nav-mega-viewall" onClick={() => setMegaOpen(null)}>
                          Browse all courses <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link key={to} to={to}>
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="header-actions">
          <SiteSearchTrigger onOpen={() => setSearchOpen(true)} />
          <Link to="/signup" className="nav-action desktop-action">
            Start a project
          </Link>
        </div>
        <button
          className="menu-button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={24} />
        </button>
      </header>

      <SiteSearch open={searchOpen} onOpen={() => setSearchOpen(true)} onClose={() => setSearchOpen(false)} />

      {open && (
        <div className="nav-backdrop" onClick={() => setOpen(false)}>
          <aside className="mobile-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <Link to="/" className="mobile-brand" onClick={() => setOpen(false)} aria-label="Najeeb Digital Hub home">
                <BrandMark title="Najeeb Digital Hub" />
              </Link>
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
              Start a project
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
          <BrandMark title="Najeeb Digital Hub" staticMark />
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
          <Link to="/work">Work</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/talent-application">Work with us</Link>
        </div>

        <div className="footer-links">
          <strong style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Company</strong>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/verify">Verify a certificate</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>

        <NewsletterForm />

        <div className="footer-base">
          <span>© {new Date().getFullYear()} Najeeb Digital Hub. Nigeria · Worldwide.</span>
        </div>
      </footer>

      <button
        type="button"
        className={showTop ? 'back-to-top is-visible' : 'back-to-top'}
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setState('sending');
    try {
      const { submitEnquiry } = await import('@/lib/catalog.functions');
      await submitEnquiry({
        data: {
          full_name: 'Newsletter subscriber',
          email,
          message: 'Requested to join the NDH newsletter from the site footer.',
          source: 'newsletter',
        },
      });
      setState('sent');
      setEmail('');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="footer-newsletter">
      <strong style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Stay in the loop</strong>
      <p>Occasional notes on new courses, agency work and offers. No spam.</p>
      {state === 'sent' ? (
        <p className="footer-newsletter-success">You're on the list — thank you.</p>
      ) : (
        <form onSubmit={onSubmit} className="footer-newsletter-form">
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" aria-label="Subscribe" disabled={state === 'sending'}>
            {state === 'sending' ? '…' : <Send size={15} />}
          </button>
        </form>
      )}
      {state === 'error' && <p className="footer-newsletter-error">Could not sign up right now — please try again shortly.</p>}
    </div>
  );
}

export function PageIntro({ eyebrow, title, body, image, imageAlt }: { eyebrow: string; title: string; body: string; image?: string; imageAlt?: string }) {
  return (
    <section className={image ? 'page-intro page-intro-image' : 'page-intro'}>
      <div className="page-intro-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{body}</p>
        {eyebrow === 'Agency' && <Link className="intro-link" to="/contact">Start a project <ArrowUpRight size={17} /></Link>}
        {eyebrow === 'Academy' && <a className="intro-link" href="#courses">Explore courses <ArrowUpRight size={17} /></a>}
      </div>
      {image && <img className="page-intro-media" src={image} alt={imageAlt ?? ''} loading="eager" decoding="async" />}
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
