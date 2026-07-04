/**
 * app/(admin)/layout.tsx
 *
 * Admin section layout — wraps all /admin/* routes.
 * - Dark theme only (no light mode toggle — brand-wide rule)
 * - Auth guard: redirects unauthenticated users to /login
 *
 * Fix 4b: Reads the admin_session cookie value and passes the raw JWT token
 *         down to client components via SessionProvider, so components such
 *         as MediaUploadField can attach Authorization headers to API calls.
 *
 * NOTE: If Module 12 (admin dashboard) has already set up the admin
 * auth-gated layout, REPLACE this with their layout — confirm with that TL
 * rather than maintaining two separate admin layouts.
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SessionProvider } from '@/lib/context/SessionContext';
import './admin.css';

export const metadata: Metadata = {
  title: { default: 'Admin — GALXY CMS', template: '%s | GALXY Admin' },
  description: 'GALXY Custom Lighting & Craft Studio — Admin Panel',
  robots: { index: false, follow: false }, // never index admin pages
};

/**
 * Reads the admin_session cookie set by Module 1's auth middleware.
 * Returns the raw cookie value (JWT string) so it can be forwarded
 * to client components via SessionProvider.
 */
async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value ?? null;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAdminToken();

  if (!token) {
    redirect('/login?redirect=/site-content');
  }

  return (
    /* Fix 4b: Wrap children in SessionProvider so client components can
       call useSessionToken() to get the JWT for Authorization headers. */
    <SessionProvider token={token}>
      <div className="admin-shell">
        {/* Admin top bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-inner">
            <span className="admin-logo">
              <span className="admin-logo-mark">✦</span>
              GALXY Admin
            </span>
            <nav className="admin-nav" aria-label="Admin navigation">
              <a href="/site-content" className="admin-nav-link">
                Site Content
              </a>
              {/* Other admin module links added by Module 12 */}
            </nav>
            <div className="admin-topbar-end">
              <span className="admin-badge">Admin</span>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
