'use client';

/**
 * components/admin/site-content/SocialLinksForm.tsx
 *
 * Admin form for the social_links section.
 * Fields: instagram, facebook, youtube, pinterest, twitter (all URL strings)
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { useState } from 'react';
import type { SocialLinksContent } from '@/lib/types/site-content';

interface SocialLinksFormProps {
  initialData: SocialLinksContent;
  onSave: (data: SocialLinksContent) => Promise<void>;
  saving: boolean;
  fieldErrors: Record<string, string>;
}

const SOCIAL_FIELDS: {
  key: keyof SocialLinksContent;
  label: string;
  placeholder: string;
  icon: string;
}[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/galxy.studio',
    icon: '📷',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/galxystudio',
    icon: '📘',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@galxy',
    icon: '▶️',
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    placeholder: 'https://pinterest.com/galxy',
    icon: '📌',
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    placeholder: 'https://twitter.com/galxystudio',
    icon: '🐦',
  },
];

export default function SocialLinksForm({
  initialData,
  onSave,
  saving,
  fieldErrors,
}: SocialLinksFormProps) {
  const [form, setForm] = useState<SocialLinksContent>(initialData);

  const set = (key: keyof SocialLinksContent, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {SOCIAL_FIELDS.map(({ key, label, placeholder, icon }) => (
          <div className="field-group" key={key}>
            <label className="field-label" htmlFor={`social-${key}`}>
              <span className="social-icon" aria-hidden="true">{icon}</span>
              {label}
            </label>
            <input
              id={`social-${key}`}
              type="url"
              className={`field-input${fieldErrors[key] ? ' field-input--error' : ''}`}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
            />
            {fieldErrors[key] && <p className="field-error">{fieldErrors[key]}</p>}
            {form[key] && (
              <a
                href={form[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="field-link-preview"
              >
                ↗ Preview link
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="btn-spinner" aria-label="Saving…" /> : null}
          {saving ? 'Saving…' : 'Save Social Links'}
        </button>
      </div>
    </form>
  );
}
