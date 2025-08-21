import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';
// This page handles the root redirect to default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
