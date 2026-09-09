import { createFileRoute } from '@tanstack/react-router';
import { AccountPage } from '@/components/portal/AccountPage';

export const Route = createFileRoute('/_authenticated/portal/talent/account')({
  component: () => <AccountPage eyebrow="TALENT PORTAL" />,
});
