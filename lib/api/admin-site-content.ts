/**
 * lib/api/admin-site-content.ts
 *
 * Fetch wrapper for Member 1 (Harishkumar)'s admin routes:
 *   GET  /api/admin/site-content/:section
 *   PUT  /api/admin/site-content/:section  → body: { content: {...} }
 *
 * Fix 4 / Fix 7: Accepts an optional JWT token and attaches
 *   Authorization: Bearer <token>
 * to align with Module 1's authentication requirements.
 *
 * Fix 7: Response envelope matches Member 1's shape:
 *   GET  → { success: true, data: { section, content } }
 *   PUT  → 200 OK or 400 { success: false, message, errors }
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import type {
  SectionName,
  SectionContent,
  SiteContentResponse,
  SiteContentErrorResponse,
} from '@/lib/types/site-content';

// ─── Auth header builder ──────────────────────────────────────────────────────
function authHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function fetchSectionContent<T extends SectionContent>(
  section: SectionName,
  token?: string | null
): Promise<T> {
  const res = await fetch(`/api/admin/site-content/${section}`, {
    method: 'GET',
    headers: authHeaders(token),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err: SiteContentErrorResponse = await res.json();
    throw new Error(err.message ?? `Failed to fetch section: ${section}`);
  }

  const json: SiteContentResponse<T> = await res.json();
  return json.data.content;
}

// ─── PUT ─────────────────────────────────────────────────────────────────────

export type SaveResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

/**
 * Always sends the FULL content object (never a partial patch).
 * Maps 400 field errors back to the caller so the form can display them inline.
 */
export async function saveSectionContent<T extends SectionContent>(
  section: SectionName,
  content: T,
  token?: string | null
): Promise<SaveResult> {
  const res = await fetch(`/api/admin/site-content/${section}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  });

  if (res.ok) {
    return { ok: true };
  }

  if (res.status === 400) {
    const err: SiteContentErrorResponse = await res.json();
    return { ok: false, errors: err.errors ?? {} };
  }

  // Unexpected error
  const text = await res.text();
  throw new Error(`Unexpected error saving section ${section}: ${res.status} — ${text}`);
}
