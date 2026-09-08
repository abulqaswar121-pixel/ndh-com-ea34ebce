import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Receipt,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, roleHome, type AppRole } from '@/lib/auth';

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; hash?: string };

const PORTAL_NAV: Record<AppRole, { name: string; items: NavItem[] }> = {
  student: {
    name: 'Student portal',
    items: [
      { to: '/portal/student', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/student', label: 'My courses', icon: BookOpen, hash: 'courses' },
      { to: '/portal/student', label: 'Certificates', icon: Award, hash: 'certificates' },
      { to: '/academy', label: 'Browse Academy', icon: FileText },
    ],
  },
  client: {
    name: 'Client portal',
    items: [
      { to: '/portal/client', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/client', label: 'Projects', icon: FolderKanban, hash: 'projects' },
      { to: '/portal/client', label: 'New brief', icon: FileText, hash: 'new-brief' },
      { to: '/portal/client', label: 'Invoices', icon: Receipt, hash: 'invoices' },
      { to: '/portal/client', label: 'Escrow', icon: ShieldCheck, hash: 'escrow' },
    ],
  },
  pm: {
    name: 'Project manager',
    items: [
      { to: '/portal/pm', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/pm', label: 'My projects', icon: FolderKanban, hash: 'projects' },
      { to: '/portal/pm', label: 'Open briefs', icon: Inbox, hash: 'briefs' },
      { to: '/portal/pm', label: 'Create project', icon: FileText, hash: 'new-project' },
      { to: '/portal/pm', label: 'My tasks', icon: ClipboardCheck, hash: 'tasks' },
    ],
  },
  talent: {
    name: 'Talent portal',
    items: [
      { to: '/portal/talent', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/talent', label: 'Earnings', icon: WalletCards, hash: 'earnings' },
      { to: '/portal/talent', label: 'My tasks', icon: ClipboardCheck, hash: 'tasks' },
      { to: '/portal/talent', label: 'My profile', icon: UserRound, hash: 'profile' },
    ],
  },
  admin: {
    name: 'Admin portal',
    items: [
      { to: '/portal/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/admin', label: 'Review queue', icon: ClipboardCheck, hash: 'reviews' },
      { to: '/portal/admin', label: 'Invitations & access', icon: UsersRound, hash: 'access' },
      { to: '/portal/admin', label: 'Courses & lessons', icon: BookOpen, hash: 'courses' },
      { to: '/portal/admin', label: 'Content', icon: FileText, hash: 'content' },
      { to: '/portal/admin', label: 'Enquiries', icon: Mail, hash: 'enquiries' },
      { to: '/portal/admin', label: 'Payouts', icon: WalletCards, hash: 'payouts' },
    ],
  },
};

const ROLE_LABEL: Record<AppRole, string> = {
  student: 'Student',
  client: 'Client',
  pm: 'Project manager',
  talent: 'Talent',
  admin: 'Admin',
};

export function PortalShell({
  role,
  title,
  eyebrow,
  intro,
  icon: Icon,
  children,
}: {
  role: AppRole;
  title: string;
  eyebrow: string;
  intro?: string;
  icon?: typeof LayoutDashboard;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const nav = PORTAL_NAV[role];
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="portal-shell">
      <header className="portal-topbar">
        <button className="portal-menu-button" aria-label="Open portal menu" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <Link to={roleHome(role)} className="portal-brand">
          <img src="/ndh-logo.png" alt="Najeeb Digital Hub" width={34} height={34} />
          <span>{nav.name}</span>
        </Link>
        <AccountMenu role={role} />
      </header>

      <div className="portal-body">
        <aside className="portal-sidebar">
          <PortalNav items={nav.items} />
        </aside>

        {open && (
          <div className="portal-drawer-backdrop" onClick={() => setOpen(false)}>
            <aside className="portal-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="portal-drawer-head">
                <span>{nav.name}</span>
                <button aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <PortalNav items={nav.items} />
            </aside>
          </div>
        )}

        <main className="portal portal-main">
          <div className="portal-head">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              {intro ? <p>{intro}</p> : null}
            </div>
            {Icon ? <Icon size={42} /> : null}
          </div>
          {children}
        </main>
      </div>

      <footer className="portal-footer">
        <span>© {new Date().getFullYear()} Najeeb Digital Hub</span>
        <a href="mailto:hello@ndh.com.ng">hello@ndh.com.ng</a>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
      </footer>
    </div>
  );
}

function PortalNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="portal-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={`${item.to}-${item.label}`}
            to={item.to}
            hash={item.hash}
            className="portal-nav-link"
            activeOptions={{ exact: true, includeHash: false }}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountMenu({ role }: { role: AppRole }) {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const name = (user?.user_metadata?.['full_name'] as string) || user?.email || 'Your account';
  const initial = name.charAt(0).toUpperCase();
  const otherRoles = roles.filter((r) => r !== role);

  async function signOut() {
    setBusy(true);
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
    } finally {
      setBusy(false);
      void navigate({ to: '/login', replace: true });
    }
  }

  return (
    <div className="portal-account" ref={ref}>
      <button className="portal-account-button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="portal-avatar">{initial}</span>
        <span className="portal-account-name">{name}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="portal-account-menu">
          <div className="portal-account-head">
            <strong>{name}</strong>
            <small>{ROLE_LABEL[role]}</small>
          </div>
          {otherRoles.length > 0 && (
            <div className="portal-account-group">
              <small>Switch portal</small>
              {otherRoles.map((r) => (
                <Link key={r} to={roleHome(r)} onClick={() => setOpen(false)}>
                  <Briefcase size={15} /> {ROLE_LABEL[r]}
                </Link>
              ))}
            </div>
          )}
          <div className="portal-account-group">
            <Link to="/" onClick={() => setOpen(false)}>
              <FileText size={15} /> Back to main site
            </Link>
            <button onClick={signOut} disabled={busy}>
              <LogOut size={15} /> {busy ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
