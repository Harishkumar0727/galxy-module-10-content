'use client';

/**
 * components/admin/site-content/FooterForm.tsx
 *
 * Admin form for the footer section.
 * Fields: tagline, quick_links[] (dynamic add/remove/reorder), copyright_text
 *
 * quick_links is a dynamic array of { label, href } — fully editable with
 * add, remove, and drag-to-reorder controls.
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { useState } from 'react';
import type { FooterContent, QuickLink } from '@/lib/types/site-content';

interface FooterFormProps {
  initialData: FooterContent;
  onSave: (data: FooterContent) => Promise<void>;
  saving: boolean;
  fieldErrors: Record<string, string>;
}

export default function FooterForm({
  initialData,
  onSave,
  saving,
  fieldErrors,
}: FooterFormProps) {
  const [form, setForm] = useState<FooterContent>(initialData);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const set = <K extends keyof FooterContent>(key: K, value: FooterContent[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Quick-links array helpers ──────────────────────────────────────────────
  const addLink = () =>
    setForm((prev) => ({
      ...prev,
      quick_links: [...prev.quick_links, { label: '', href: '' }],
    }));

  const removeLink = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      quick_links: prev.quick_links.filter((_, i) => i !== idx),
    }));

  const updateLink = (idx: number, field: keyof QuickLink, value: string) =>
    setForm((prev) => ({
      ...prev,
      quick_links: prev.quick_links.map((link, i) =>
        i === idx ? { ...link, [field]: value } : link
      ),
    }));

  // Drag-to-reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setForm((prev) => {
      const links = [...prev.quick_links];
      const [moved] = links.splice(dragIdx, 1);
      links.splice(idx, 0, moved);
      setDragIdx(idx);
      return { ...prev, quick_links: links };
    });
  };
  const handleDragEnd = () => setDragIdx(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">

        {/* Tagline */}
        <div className="field-group">
          <label className="field-label" htmlFor="footer-tagline">
            Tagline
          </label>
          <input
            id="footer-tagline"
            type="text"
            className={`field-input${fieldErrors.tagline ? ' field-input--error' : ''}`}
            value={form.tagline}
            onChange={(e) => set('tagline', e.target.value)}
            placeholder="e.g. Illuminating spaces, crafting memories."
          />
          {fieldErrors.tagline && <p className="field-error">{fieldErrors.tagline}</p>}
        </div>

        {/* Copyright */}
        <div className="field-group">
          <label className="field-label" htmlFor="footer-copyright">
            Copyright Text
          </label>
          <input
            id="footer-copyright"
            type="text"
            className={`field-input${fieldErrors.copyright_text ? ' field-input--error' : ''}`}
            value={form.copyright_text}
            onChange={(e) => set('copyright_text', e.target.value)}
            placeholder="e.g. © 2026 GALXY. All rights reserved."
          />
          {fieldErrors.copyright_text && (
            <p className="field-error">{fieldErrors.copyright_text}</p>
          )}
        </div>

        {/* Quick Links dynamic editor */}
        <div className="field-group field-group--full">
          <div className="field-label">
            Quick Links
            <span className="field-hint">(drag to reorder)</span>
          </div>

          <div className="quick-links-list" role="list">
            {form.quick_links.map((link, idx) => (
              <div
                key={idx}
                className={`quick-link-row${dragIdx === idx ? ' quick-link-row--dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                role="listitem"
                aria-label={`Quick link ${idx + 1}`}
              >
                <span className="drag-handle" aria-hidden="true">⠿</span>

                <input
                  type="text"
                  className={`field-input field-input--sm${fieldErrors[`quick_links.${idx}.label`] ? ' field-input--error' : ''}`}
                  value={link.label}
                  onChange={(e) => updateLink(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. Portfolio)"
                  aria-label={`Quick link ${idx + 1} label`}
                />

                <input
                  type="text"
                  className={`field-input field-input--sm${fieldErrors[`quick_links.${idx}.href`] ? ' field-input--error' : ''}`}
                  value={link.href}
                  onChange={(e) => updateLink(idx, 'href', e.target.value)}
                  placeholder="URL (e.g. /portfolio)"
                  aria-label={`Quick link ${idx + 1} URL`}
                />

                <button
                  type="button"
                  className="btn btn-ghost btn-danger-text btn-icon"
                  onClick={() => removeLink(idx)}
                  aria-label={`Remove quick link ${idx + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {fieldErrors.quick_links && (
            <p className="field-error">{fieldErrors.quick_links}</p>
          )}

          <button type="button" className="btn btn-secondary btn-sm" onClick={addLink}>
            + Add Quick Link
          </button>
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="btn-spinner" aria-label="Saving…" /> : null}
          {saving ? 'Saving…' : 'Save Footer Section'}
        </button>
      </div>
    </form>
  );
}
