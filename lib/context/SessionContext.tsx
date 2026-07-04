'use client';

/**
 * lib/context/SessionContext.tsx
 *
 * Provides the admin JWT token to all client components inside (admin)/.
 * The token is passed down from the server layout via a thin provider.
 *
 * Fix 4: Enables MediaUploadField (and any other client component) to attach
 *        Authorization: Bearer <token> to API calls, satisfying Module 1's
 *        admin auth requirements.
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { createContext, useContext } from 'react';

interface SessionContextValue {
  /** Raw JWT value from the admin_session cookie, or null if not present. */
  token: string | null;
}

const SessionContext = createContext<SessionContextValue>({ token: null });

export function SessionProvider({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ token }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * useSessionToken
 * Returns the admin JWT token string, or null when unauthenticated.
 * Call this from any client component that needs to attach auth headers.
 */
export function useSessionToken(): string | null {
  return useContext(SessionContext).token;
}
