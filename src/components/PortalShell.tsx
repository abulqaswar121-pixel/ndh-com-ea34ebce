import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
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
  GraduationCap,
  Inbox,
  KeyRound,
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
import { BrandMark } from '@/components/BrandMark';

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

export const PORTAL_NAV: Record<AppRole, { name: string; items: NavItem[] }> = {
  student: {
    name: 'Student portal',
    items: [
      { to: '/portal/student', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/student/courses', label: 'My courses', icon: BookOpen },
      { to: '/portal/student/catalogue', label: 'Browse courses', icon: GraduationCap },
      { to: '/portal/student/certificates', label: 'Certificates', icon: Award },
      { to: '/portal/student/account', label: 'Account', icon: UserRound },
    ],
  },
  client: {
    name: 'Client portal',
    items: [
      { to: '/portal/client', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/client/projects', label: 'Projects', icon: FolderKanban },
      { to: '/portal/client/new-brief', label: 'New brief', icon: FileText },
      { to: '/portal/client/invoices', label: 'Invoices', icon: Receipt },
      { to: '/portal/client/escrow', label: 'Escrow', icon: ShieldCheck },
      { to: '/portal/client/account', label: 'Account', icon: UserRound },
    ],
  },
  pm: {
    name: 'Project manager',
    items: [
      { to: '/portal/pm', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/pm/projects', label: 'My projects', icon: FolderKanban },
      { to: '/portal/pm/briefs', label: 'Open briefs', icon: Inbox },
      { to: '/portal/pm/new-project', label: 'Create project', icon: FileText },
      { to: '/portal/pm/tasks', label: 'My tasks', icon: ClipboardCheck },
      { to: '/portal/pm/account', label: 'Account', icon: UserRound },
    ],
  },
  talent: {
    name: 'Talent portal',
    items: [
      { to: '/portal/talent', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/talent/tasks', label: 'My tasks', icon: ClipboardCheck },
      { to: '/portal/talent/earnings', label: 'Earnings', icon: WalletCards },
      { to: '/portal/talent/profile', label: 'My profile', icon: Briefcase },
      { to: '/portal/talent/account', label: 'Account', icon: UserRound },
    ],
  },
  admin: {
    name: 'Admin portal',
    items: [
      { to: '/portal/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/portal/admin/reviews', label: 'Review queue', icon: ClipboardCheck },
      { to: '/portal/admin/access', label: 'Invitations & access', icon: KeyRound },
      { to: '/portal/admin/users', label: 'People & roles', icon: UsersRound },
      { to: '/portal/admin/applications', label: 'Talent applications', icon: Inbox },
      { to: '/portal/admin/courses', label: 'Courses', icon: BookOpen },
      { to: '/portal/admin/content', label: 'Content', icon: FileText },
      { to: '/portal/admin/enquiries', label: 'Enquiries', icon: Mail },
      { to: '/portal/admin/payouts', label: 'Payouts', icon: WalletCards },
      { to: '/portal/admin/account', label: 'Account', icon: UserRound },
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

/** Frame for a whole portal. Renders the child page through <Outlet />. */
export function PortalShell({ role, children }: { role: AppRole; children?: ReactNode }) {
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
        <Link to={roleHome(role) as never} className="portal-brand">
          <BrandMark title="Najeeb Digital Hub" />
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
                <span className="portal-drawer-brand"><BrandMark /> {nav.name}</span>
                <button aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <PortalNav items={nav.items} />
            </aside>
          </div>
        )}

        <main className="portal portal-main">{children ?? <Outlet />}</main>
      </div>

      <PortalFooter />
    </div>
  );
}

/** Page header used at the top of every portal page. */
export function PortalPage({
  eyebrow,
  title,
  intro,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  icon?: typeof LayoutDashboard;
  children: ReactNode;
}) {
  return (
    <>
      <div className="portal-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {intro ? <p>{intro}</p> : null}
        </div>
        {Icon ? <Icon size={42} /> : null}
      </div>
      {children}
    </>
  );
}

function PortalFooter() {
  return (
    <footer className="portal-footer">
      <span>© {new Date().getFullYear()} Najeeb Digital Hub</span>
      <a href="mailto:hello@ndh.com.ng">hello@ndh.com.ng</a>
      <Link to="/portal/terms">Terms</Link>
      <Link to="/portal/privacy">Privacy</Link>
    </footer>
  );
}

function PortalNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="portal-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to as never}
            className="portal-nav-link"
            activeProps={{ className: 'portal-nav-link active' }}
            activeOptions={{ exact: true }}
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
                <Link key={r} to={roleHome(r) as never} onClick={() => setOpen(false)}>
                  <Briefcase size={15} /> {ROLE_LABEL[r]}
                </Link>
              ))}
            </div>
          )}
          <div className="portal-account-group">
            <button
              onClick={async () => {
                setBusy(true);
                try {
                  await queryClient.cancelQueries();
                  queryClient.clear();
                  await supabase.auth.signOut();
                } finally {
                  setBusy(false);
                  void navigate({ to: '/login', replace: true });
                }
              }}
              disabled={busy}
            >
              <LogOut size={15} /> {busy ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Lighter signed-in frame for focused pages (lesson player, exam, project,
 * certificate, project workspace). Top bar with the account menu, no sidebar.
 */
export function PortalFrame({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const active: AppRole = role ?? 'student';
  return (
    <div className="portal-shell">
      <header className="portal-topbar">
        <Link to={roleHome(active) as never} className="portal-brand">
          <BrandMark title="Najeeb Digital Hub" />
          <span>{PORTAL_NAV[active].name}</span>
        </Link>
        <AccountMenu role={active} />
      </header>
      <div className="portal-body portal-body-plain">{children}</div>
      <PortalFooter />
    </div>
  );
}
