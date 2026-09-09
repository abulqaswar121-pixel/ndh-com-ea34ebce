import { createFileRoute } from '@tanstack/react-router';
import { AccountPage } from '@/components/portal/AccountPage';

export const Route = createFileRoute('/_authenticated/portal/pm/account')({
  component: () => <AccountPage eyebrow="PROJECT MANAGER" />,
});
