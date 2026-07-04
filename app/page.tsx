/**
 * app/page.tsx
 *
 * This module (Member 4 — M-10D) is admin-only.
 * Redirect the root URL straight to the admin CMS panel.
 * The admin layout will then redirect unauthenticated users to /login.
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/site-content');
}
