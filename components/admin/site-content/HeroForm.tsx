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
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const initialRef = useRef(initialData);
  const onDirtyChangeRef = useRef(onDirtyChange);
  useEffect(() => { onDirtyChangeRef.current = onDirtyChange; }, [onDirtyChange]);

  // Fix 5: notify parent whenever dirty state changes
  useEffect(() => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
    onDirtyChangeRef.current?.(isDirty);
  }, [form]);

  const set = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (localErrors[key]) setLocalErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (form.cta_link && !/^(https?:\/\/|\/)/.test(form.cta_link)) errs.cta_link = 'Enter a valid URL (e.g. https://... or /path).';
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
    initialRef.current = form;
    onDirtyChange?.(false);
  };

  const err = (key: string) => localErrors[key] || fieldErrors[key];

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
            className={`field-input${err('title') ? ' field-input--error' : ''}`}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Custom Lighting & Craft Studio"
          />
          {err('title') && <p className="field-error">{err('title')}</p>}
        </div>

        {/* Subtitle */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-subtitle">
            Subtitle
          </label>
          <textarea
            id="hero-subtitle"
            className={`field-textarea${err('subtitle') ? ' field-input--error' : ''}`}
            rows={3}
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="Short tagline shown below the hero title"
          />
          {err('subtitle') && <p className="field-error">{err('subtitle')}</p>}
        </div>

        {/* CTA Text */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-cta-text">
            CTA Button Text
          </label>
          <input
            id="hero-cta-text"
            type="text"
            className={`field-input${err('cta_text') ? ' field-input--error' : ''}`}
            value={form.cta_text}
            onChange={(e) => set('cta_text', e.target.value)}
            placeholder="e.g. Explore Our Work"
          />
          {err('cta_text') && <p className="field-error">{err('cta_text')}</p>}
        </div>

        {/* CTA Link */}
        <div className="field-group">
          <label className="field-label" htmlFor="hero-cta-link">
            CTA Button Link
          </label>
          <input
            id="hero-cta-link"
            type="url"
            className={`field-input${err('cta_link') ? ' field-input--error' : ''}`}
            value={form.cta_link}
            onChange={(e) => set('cta_link', e.target.value)}
            placeholder="e.g. /portfolio"
          />
          {err('cta_link') && <p className="field-error">{err('cta_link')}</p>}
        </div>

        {/* Background Image */}
        <div className="field-group field-group--full">
          <MediaUploadField
            label="Hero Background Image"
            value={form.background_image}
            folder="galxy/site-content"
            onChange={(url) => set('background_image', url || null)}
            error={err('background_image')}
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
