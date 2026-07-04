'use client';

/**
 * components/admin/site-content/HeroForm.tsx
 *
 * Admin form for the hero section.
 * Fields: title, subtitle, cta_text, cta_link, background_image (via MediaUploadField)
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { useEffect, useRef, useState } from 'react';
import type { HeroContent } from '@/lib/types/site-content';
import MediaUploadField from '@/components/admin/MediaUploadField';

interface HeroFormProps {
  initialData: HeroContent;
  onSave: (data: HeroContent) => Promise<void>;
  saving: boolean;
  fieldErrors: Record<string, string>;
  /** Fix 5: called whenever form diverges from / matches initialData */
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function HeroForm({
  initialData,
  onSave,
  saving,
  fieldErrors,
  onDirtyChange,
}: HeroFormProps) {
  const [form, setForm] = useState<HeroContent>(initialData);
  const initialRef = useRef(initialData);

  // Fix 5: notify parent whenever dirty state changes
  useEffect(() => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
    onDirtyChange?.(isDirty);
  }, [form, onDirtyChange]);

  const set = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    // After save, update the ref so the form is no longer dirty
    initialRef.current = form;
    onDirtyChange?.(false);
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">

        {/* Title */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-title">
            Hero Title <span className="required">*</span>
          </label>
          <input
            id="hero-title"
            type="text"
            className={`field-input${fieldErrors.title ? ' field-input--error' : ''}`}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Custom Lighting & Craft Studio"
          />
          {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
        </div>

        {/* Subtitle */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-subtitle">
            Subtitle
          </label>
          <textarea
            id="hero-subtitle"
            className={`field-textarea${fieldErrors.subtitle ? ' field-input--error' : ''}`}
            rows={3}
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="Short tagline shown below the hero title"
          />
          {fieldErrors.subtitle && <p className="field-error">{fieldErrors.subtitle}</p>}
        </div>

        {/* CTA Text */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-cta-text">
            CTA Button Text
          </label>
          <input
            id="hero-cta-text"
            type="text"
            className={`field-input${fieldErrors.cta_text ? ' field-input--error' : ''}`}
            value={form.cta_text}
            onChange={(e) => set('cta_text', e.target.value)}
            placeholder="e.g. Explore Our Work"
          />
          {fieldErrors.cta_text && <p className="field-error">{fieldErrors.cta_text}</p>}
        </div>

        {/* CTA Link */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-cta-link">
            CTA Button Link
          </label>
          <input
            id="hero-cta-link"
            type="url"
            className={`field-input${fieldErrors.cta_link ? ' field-input--error' : ''}`}
            value={form.cta_link}
            onChange={(e) => set('cta_link', e.target.value)}
            placeholder="e.g. /portfolio"
          />
          {fieldErrors.cta_link && <p className="field-error">{fieldErrors.cta_link}</p>}
        </div>

        {/* Background Image */}
        <div className="field-group field-group--full">
          <MediaUploadField
            label="Hero Background Image"
            value={form.background_image}
            folder="galxy/site-content"
            onChange={(url) => set('background_image', url || null)}
            error={fieldErrors.background_image}
          />
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="btn-spinner" aria-label="Saving…" /> : null}
          {saving ? 'Saving…' : 'Save Hero Section'}
        </button>
      </div>
    </form>
  );
}
