import type { LucideIcon } from 'lucide-react';
import { BarChart3, Bot, Code2, Megaphone, Palette, PenTool, Video } from 'lucide-react';

export type NavItem = { to: string; label: string; blurb: string; icon: LucideIcon };

// Curated shortcuts shown in the header mega-menus. Kept intentionally small and
// static (not fetched) so the header never depends on the catalog/network to render.
export const agencyMenu: NavItem[] = [
  { to: '/agency/brand-identity', label: 'Brand & identity', blurb: 'Visual systems that make a business easier to recognise.', icon: Palette },
  { to: '/agency/design-product', label: 'Design & product', blurb: 'Interfaces and product experiences shaped around use.', icon: PenTool },
  { to: '/agency/development', label: 'Development', blurb: 'Web and product builds prepared for real use.', icon: Code2 },
  { to: '/agency/content-writing', label: 'Content & writing', blurb: 'Clear words for pages, campaigns and communication.', icon: PenTool },
  { to: '/agency/marketing-growth', label: 'Marketing & growth', blurb: 'Structured campaigns and practical growth support.', icon: Megaphone },
  { to: '/agency/video-media', label: 'Video & media', blurb: 'Editing, motion, photography and podcast production.', icon: Video },
  { to: '/agency/data-business', label: 'Data & business', blurb: 'Dashboards and operational support for decisions.', icon: BarChart3 },
  { to: '/agency/ai-automation', label: 'AI & automation', blurb: 'Assistants, integrations and workflow automation.', icon: Bot },
];

export const academyMenu: { school: string; blurb: string }[] = [
  { school: 'AI Engineering', blurb: 'Build, ship and automate with AI tools.' },
  { school: 'Marketing & Growth', blurb: 'Content, ads, SEO and CRO courses.' },
  { school: 'Design & Brand', blurb: 'Graphic design, branding, illustration.' },
  { school: 'Writing & Content', blurb: 'Copywriting, blogging, scriptwriting, e-books.' },
  { school: 'Video & Media', blurb: 'Photography, 3D animation, podcasting.' },
  { school: 'Business & Operations', blurb: 'Data entry, project management, CRM setup.' },
];

// Lightweight static search index for the Cmd+K site search — always available even
// if the live catalog can't be reached. Course/case-study results are layered on
// top of this at runtime when the catalog loads successfully.
export const siteSearchIndex: { to: string; label: string; group: string; keywords?: string }[] = [
  { to: '/', label: 'Home', group: 'Pages' },
  { to: '/agency', label: 'Agency', group: 'Pages', keywords: 'services digital delivery' },
  { to: '/academy', label: 'Academy', group: 'Pages', keywords: 'courses ai skills certification' },
  { to: '/work', label: 'Selected work', group: 'Pages', keywords: 'case studies portfolio' },
  { to: '/blog', label: 'Blog', group: 'Pages', keywords: 'articles notes writing' },
  { to: '/about', label: 'About', group: 'Pages' },
  { to: '/contact', label: 'Contact', group: 'Pages', keywords: 'brief enquiry get in touch' },
  { to: '/faq', label: 'FAQ', group: 'Pages', keywords: 'questions help' },
  { to: '/verify', label: 'Verify a certificate', group: 'Pages', keywords: 'certification credential' },
  { to: '/talent-application', label: 'Work with us', group: 'Pages', keywords: 'careers jobs talent' },
  { to: '/signup', label: 'Start a project / Sign up', group: 'Pages', keywords: 'create account' },
  { to: '/login', label: 'Sign in', group: 'Pages', keywords: 'account login' },
  ...agencyMenu.map((item) => ({ to: item.to, label: item.label, group: 'Agency services', keywords: item.blurb })),
  ...academyMenu.map((item) => ({ to: `/academy?school=${encodeURIComponent(item.school)}`, label: item.school, group: 'Academy schools', keywords: item.blurb })),
];
