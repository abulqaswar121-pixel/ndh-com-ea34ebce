import { createFileRoute } from '@tanstack/react-router';
import { AccountPage } from '@/components/portal/AccountPage';

export const Route = createFileRoute('/_authenticated/portal/client/account')({
  component: () => <AccountPage eyebrow="CLIENT PORTAL" />,
});
