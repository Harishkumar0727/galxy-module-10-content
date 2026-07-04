/**
 * app/(admin)/layout.tsx
 *
 * Admin section layout — wraps all /admin/* routes.
 * - Dark theme only (no light mode toggle — brand-wide rule)
 * - Auth guard: redirects unauthenticated users to /login
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
import './admin.css';

export const metadata: Metadata = {
  title: { default: 'Admin — GALXY CMS', template: '%s | GALXY Admin' },
  description: 'GALXY Custom Lighting & Craft Studio — Admin Panel',
  robots: { index: false, follow: false }, // never index admin pages
};

/**
 * Minimal auth check — reads the admin session cookie set by Module 1.
 * TODO: Replace with Module 1's actual session validation endpoint once available.
 */
async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session?.value;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) {
    redirect('/login?redirect=/admin/site-content');
  }

  return (
    <div className="admin-shell">
      {/* Admin top bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <span className="admin-logo">
            <span className="admin-logo-mark">✦</span>
            GALXY Admin
          </span>
          <nav className="admin-nav" aria-label="Admin navigation">
            <a href="/admin/site-content" className="admin-nav-link">
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
  );
}
