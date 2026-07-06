'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/site-content';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Dev login: set a minimal session cookie and redirect
    document.cookie = 'admin_session=dev-jwt-token; path=/; max-age=3600';
    router.push(redirect);
  }

  return (
    <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>
          <span style={{ color: 'var(--color-accent)' }}>✦</span> GALXY Admin
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Sign in to the admin panel</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@galxy.studio" required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="field-label" htmlFor="password">Password</label>
          <input id="password" type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Sign in</button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--color-text-muted)' }}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
