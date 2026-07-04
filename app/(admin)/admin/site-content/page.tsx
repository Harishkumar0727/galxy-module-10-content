'use client';

/**
 * app/(admin)/admin/site-content/page.tsx
 *
 * Admin CMS Panel — /admin/site-content
 * Tab/nav shell across all 6 site-content sections.
 * Fetches section data on tab switch (GET), saves via PUT.
 * Maps 400 field errors inline. Shows toast for success/error.
 *
 * Owned by: Member 4 (Leelavathy) — M-10D branch
 */

import React, { useCallback, useEffect, useState } from 'react';
import type {
  SectionName,
  HeroContent,
  AboutContent,
  FooterContent,
  ContactContent,
  SeoHomeContent,
  SocialLinksContent,
  SectionContent,
} from '@/lib/types/site-content';
import { fetchSectionContent, saveSectionContent } from '@/lib/api/admin-site-content';

import HeroForm from '@/components/admin/site-content/HeroForm';
import AboutForm from '@/components/admin/site-content/AboutForm';
import FooterForm from '@/components/admin/site-content/FooterForm';
import ContactForm from '@/components/admin/site-content/ContactForm';
import SeoHomeForm from '@/components/admin/site-content/SeoHomeForm';
import SocialLinksForm from '@/components/admin/site-content/SocialLinksForm';

import './admin-cms.css';

// ─── Tab configuration ───────────────────────────────────────────────────────
const TABS: { key: SectionName; label: string; icon: string }[] = [
  { key: 'hero',         label: 'Hero',         icon: '🌟' },
  { key: 'about',        label: 'About',        icon: '👤' },
  { key: 'footer',       label: 'Footer',       icon: '🔗' },
  { key: 'contact',      label: 'Contact',      icon: '📬' },
  { key: 'seo_home',     label: 'SEO',          icon: '🔍' },
  { key: 'social_links', label: 'Social Links', icon: '📱' },
];

// ─── Default empty states (used while loading / for new sections) ─────────────
const DEFAULTS: Record<SectionName, SectionContent> = {
  hero:         { title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null },
  about:        { headline: '', body: '', images: [], founder_photo: null, founder_name: '', founder_title: '' },
  footer:       { tagline: '', quick_links: [], copyright_text: '' },
  contact:      { email: '', phone: '', address: '', map_embed_url: '', business_hours: '' },
  seo_home:     { title: '', description: '', og_image: null, og_title: '', og_description: '', canonical_url: '' },
  social_links: { instagram: '', facebook: '', youtube: '', pinterest: '', twitter: '' },
};

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; type: ToastType; message: string }
let toastCounter = 0;

// ─── Page component ──────────────────────────────────────────────────────────
export default function SiteContentPage() {
  const [activeTab, setActiveTab] = useState<SectionName>('hero');
  const [sectionData, setSectionData] = useState<Partial<Record<SectionName, SectionContent>>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // ── Fetch section data on tab switch ──────────────────────────────────────
  useEffect(() => {
    if (sectionData[activeTab]) return; // already fetched

    setLoading(true);
    setFieldErrors({});

    fetchSectionContent(activeTab)
      .then((data) => {
        setSectionData((prev) => ({ ...prev, [activeTab]: data }));
      })
      .catch((err: Error) => {
        addToast('error', `Failed to load ${activeTab}: ${err.message}`);
        // Fall back to empty defaults so the form still renders
        setSectionData((prev) => ({ ...prev, [activeTab]: DEFAULTS[activeTab] }));
      })
      .finally(() => setLoading(false));
  }, [activeTab, sectionData, addToast]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = useCallback(
    async (data: SectionContent) => {
      setSaving(true);
      setFieldErrors({});

      const result = await saveSectionContent(activeTab, data).catch((err: Error) => {
        addToast('error', `Save failed: ${err.message}`);
        return null;
      });

      if (!result) { setSaving(false); return; }

      if (result.ok) {
        // Update cache so re-switching tab doesn't refetch stale data
        setSectionData((prev) => ({ ...prev, [activeTab]: data }));
        addToast('success', `${TABS.find((t) => t.key === activeTab)?.label} section saved!`);
      } else {
        // 400: map field errors inline — do NOT reset form state, preserve user's input
        setFieldErrors(result.errors);
        addToast('error', 'Some fields have errors — please review and try again.');
      }

      setSaving(false);
    },
    [activeTab, addToast]
  );

  // ── Tab switch ─────────────────────────────────────────────────────────────
  const handleTabChange = (tab: SectionName) => {
    setActiveTab(tab);
    setFieldErrors({});
  };

  // ── Current section data ──────────────────────────────────────────────────
  const currentData = sectionData[activeTab] ?? DEFAULTS[activeTab];

  return (
    <div className="cms-page">

      {/* ── Page header ── */}
      <div className="cms-header">
        <div className="cms-header-inner">
          <h1 className="cms-title">
            <span className="cms-title-icon">✦</span>
            Site Content
          </h1>
          <p className="cms-subtitle">
            Edit homepage, about page, footer, contact, SEO and social links.
          </p>
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <nav className="cms-tabs" aria-label="Content sections">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={`cms-tab${activeTab === key ? ' cms-tab--active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            <span className="cms-tab-icon" aria-hidden="true">{icon}</span>
            <span className="cms-tab-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Section panel ── */}
      <div className="cms-panel" role="tabpanel">
        {loading ? (
          <div className="cms-loading" role="status" aria-live="polite">
            <span className="cms-spinner" />
            <span>Loading {activeTab} content…</span>
          </div>
        ) : (
          <>
            {activeTab === 'hero' && (
              <HeroForm
                initialData={currentData as HeroContent}
                onSave={(d) => handleSave(d)}
                saving={saving}
                fieldErrors={fieldErrors}
              />
            )}
            {activeTab === 'about' && (
              <AboutForm
                initialData={currentData as AboutContent}
                onSave={(d) => handleSave(d)}
                saving={saving}
                fieldErrors={fieldErrors}
              />
            )}
            {activeTab === 'footer' && (
              <FooterForm
                initialData={currentData as FooterContent}
                onSave={(d) => handleSave(d)}
                saving={saving}
                fieldErrors={fieldErrors}
              />
            )}
            {activeTab === 'contact' && (
              <ContactForm
                initialData={currentData as ContactContent}
                onSave={(d) => handleSave(d)}
                saving={saving}
                fieldErrors={fieldErrors}
              />
            )}
            {activeTab === 'seo_home' && (
              <SeoHomeForm
                initialData={currentData as SeoHomeContent}
                onSave={(d) => handleSave(d)}
                saving={saving}
                fieldErrors={fieldErrors}
              />
            )}
            {activeTab === 'social_links' && (
              <SocialLinksForm
                initialData={currentData as SocialLinksContent}
                onSave={(d) => handleSave(d)}
                saving={saving}
                fieldErrors={fieldErrors}
              />
            )}
          </>
        )}
      </div>

      {/* ── Toast container ── */}
      <div className="toast-container" aria-live="assertive" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`} role="alert">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-dismiss"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
