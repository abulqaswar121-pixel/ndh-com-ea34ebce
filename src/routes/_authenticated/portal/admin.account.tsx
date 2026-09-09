import { createFileRoute } from '@tanstack/react-router';
import { AccountPage } from '@/components/portal/AccountPage';

export const Route = createFileRoute('/_authenticated/portal/admin/account')({
  component: () => <AccountPage eyebrow="ADMIN PORTAL" />,
});
