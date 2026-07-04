'use client';

/**
 * components/admin/site-content/SeoHomeForm.tsx
 *
 * Admin form for the seo_home section.
 * Fields: title, description, og_image (via MediaUploadField),
 *         og_title, og_description, canonical_url
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { useEffect, useRef, useState } from 'react';
import type { SeoHomeContent } from '@/lib/types/site-content';
import MediaUploadField from '@/components/admin/MediaUploadField';

interface SeoHomeFormProps {
  initialData: SeoHomeContent;
  onSave: (data: SeoHomeContent) => Promise<void>;
  saving: boolean;
  fieldErrors: Record<string, string>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function SeoHomeForm({
  initialData,
  onSave,
  saving,
  fieldErrors,
  onDirtyChange,
}: SeoHomeFormProps) {
  const [form, setForm] = useState<SeoHomeContent>(initialData);
  const initialRef = useRef(initialData);

  useEffect(() => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
    onDirtyChange?.(isDirty);
  }, [form, onDirtyChange]);

  const set = <K extends keyof SeoHomeContent>(key: K, value: SeoHomeContent[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    initialRef.current = form;
    onDirtyChange?.(false);
  };

  // Character count helpers
  const titleLen = form.title.length;
  const descLen = form.description.length;
  const ogTitleLen = form.og_title.length;
  const ogDescLen = form.og_description.length;

  return (
    <form className="cms-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">

        {/* Meta Title */}
        <div className="field-group field-group--full">
          <label className="field-label" htmlFor="seo-title">
            Page Title (meta title) <span className="required">*</span>
          </label>
          <input
            id="seo-title"
            type="text"
            className={`field-input${fieldErrors.title ? ' field-input--error' : ''}`}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. GALXY | Custom Lighting & Craft Studio"
            maxLength={70}
          />
          <p className={`char-count${titleLen > 60 ? ' char-count--warn' : ''}`}>
            {titleLen}/70 characters {titleLen > 60 ? '⚠ Google typically shows ≤60' : ''}
          </p>
          {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
        </div>

        {/* Meta Description */}
        <div className="field-group field-group--full">
          <label className="field-label" htmlFor="seo-description">
            Meta Description <span className="required">*</span>
          </label>
          <textarea
            id="seo-description"
            className={`field-textarea${fieldErrors.description ? ' field-input--error' : ''}`}
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short description used by search engines (≤160 chars recommended)"
            maxLength={200}
          />
          <p className={`char-count${descLen > 160 ? ' char-count--warn' : ''}`}>
            {descLen}/200 characters {descLen > 160 ? '⚠ Google typically shows ≤160' : ''}
          </p>
          {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
        </div>

        {/* OG Image */}
        <div className="field-group field-group--full">
          <MediaUploadField
            label="Open Graph Image (og:image)"
            value={form.og_image}
            folder="galxy/site-content"
            onChange={(url) => set('og_image', url || null)}
            error={fieldErrors.og_image}
          />
          <p className="field-hint">Recommended: 1200×630px JPG/PNG for social sharing previews.</p>
        </div>

        {/* OG Title */}
        <div className="field-group">
          <label className="field-label" htmlFor="seo-og-title">
            OG Title (og:title)
          </label>
          <input
            id="seo-og-title"
            type="text"
            className={`field-input${fieldErrors.og_title ? ' field-input--error' : ''}`}
            value={form.og_title}
            onChange={(e) => set('og_title', e.target.value)}
            placeholder="Social share title (defaults to page title if blank)"
            maxLength={95}
          />
          <p className={`char-count${ogTitleLen > 60 ? ' char-count--warn' : ''}`}>
            {ogTitleLen}/95
          </p>
          {fieldErrors.og_title && <p className="field-error">{fieldErrors.og_title}</p>}
        </div>

        {/* OG Description */}
        <div className="field-group">
          <label className="field-label" htmlFor="seo-og-description">
            OG Description (og:description)
          </label>
          <textarea
            id="seo-og-description"
            className={`field-textarea${fieldErrors.og_description ? ' field-input--error' : ''}`}
            rows={3}
            value={form.og_description}
            onChange={(e) => set('og_description', e.target.value)}
            placeholder="Description shown in social share previews"
            maxLength={300}
          />
          <p className={`char-count${ogDescLen > 200 ? ' char-count--warn' : ''}`}>
            {ogDescLen}/300
          </p>
          {fieldErrors.og_description && (
            <p className="field-error">{fieldErrors.og_description}</p>
          )}
        </div>

        {/* Canonical URL */}
        <div className="field-group field-group--full">
          <label className="field-label" htmlFor="seo-canonical">
            Canonical URL
          </label>
          <input
            id="seo-canonical"
            type="url"
            className={`field-input${fieldErrors.canonical_url ? ' field-input--error' : ''}`}
            value={form.canonical_url}
            onChange={(e) => set('canonical_url', e.target.value)}
            placeholder="https://galxy.studio/"
          />
          {fieldErrors.canonical_url && (
            <p className="field-error">{fieldErrors.canonical_url}</p>
          )}
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="btn-spinner" aria-label="Saving…" /> : null}
          {saving ? 'Saving…' : 'Save SEO Settings'}
        </button>
      </div>
    </form>
  );
}
