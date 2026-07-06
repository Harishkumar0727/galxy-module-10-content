'use client';

/**
 * components/admin/site-content/ContactForm.tsx
 *
 * Admin form for the contact section.
 * Fields: email, phone, address, map_embed_url, business_hours
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { useEffect, useRef, useState } from 'react';
import type { ContactContent } from '@/lib/types/site-content';

interface ContactFormProps {
  initialData: ContactContent;
  onSave: (data: ContactContent) => Promise<void>;
  saving: boolean;
  fieldErrors: Record<string, string>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function ContactForm({
  initialData,
  onSave,
  saving,
  fieldErrors,
  onDirtyChange,
}: ContactFormProps) {
  const [form, setForm] = useState<ContactContent>(initialData);
  const initialRef = useRef(initialData);
  const onDirtyChangeRef = useRef(onDirtyChange);
  onDirtyChangeRef.current = onDirtyChange;

  useEffect(() => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
    onDirtyChangeRef.current?.(isDirty);
  }, [form]);

  const set = <K extends keyof ContactContent>(key: K, value: ContactContent[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    initialRef.current = form;
    onDirtyChange?.(false);
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">

        {/* Email */}
        <div className="field-group">
          <label className="field-label" htmlFor="contact-email">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className={`field-input${fieldErrors.email ? ' field-input--error' : ''}`}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="e.g. hello@galxy.studio"
          />
          {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
        </div>

        {/* Phone */}
        <div className="field-group">
          <label className="field-label" htmlFor="contact-phone">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            className={`field-input${fieldErrors.phone ? ' field-input--error' : ''}`}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="e.g. +91 98765 43210"
          />
          {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
        </div>

        {/* Address */}
        <div className="field-group field-group--full">
          <label className="field-label" htmlFor="contact-address">
            Physical Address
          </label>
          <textarea
            id="contact-address"
            className={`field-textarea${fieldErrors.address ? ' field-input--error' : ''}`}
            rows={3}
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="e.g. 12 Light District, Chennai, Tamil Nadu 600001"
          />
          {fieldErrors.address && <p className="field-error">{fieldErrors.address}</p>}
        </div>

        {/* Map Embed URL */}
        <div className="field-group field-group--full">
          <label className="field-label" htmlFor="contact-map">
            Google Maps Embed URL
          </label>
          <input
            id="contact-map"
            type="url"
            className={`field-input${fieldErrors.map_embed_url ? ' field-input--error' : ''}`}
            value={form.map_embed_url}
            onChange={(e) => set('map_embed_url', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=…"
          />
          {fieldErrors.map_embed_url && (
            <p className="field-error">{fieldErrors.map_embed_url}</p>
          )}
          {form.map_embed_url && (
            <div className="map-preview">
              <iframe
                src={form.map_embed_url}
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: 8 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map preview"
              />
            </div>
          )}
        </div>

        {/* Business Hours */}
        <div className="field-group field-group--full">
          <label className="field-label" htmlFor="contact-hours">
            Business Hours
          </label>
          <textarea
            id="contact-hours"
            className={`field-textarea${fieldErrors.business_hours ? ' field-input--error' : ''}`}
            rows={4}
            value={form.business_hours}
            onChange={(e) => set('business_hours', e.target.value)}
            placeholder={`Mon – Fri: 9am – 6pm\nSat: 10am – 4pm\nSun: Closed`}
          />
          {fieldErrors.business_hours && (
            <p className="field-error">{fieldErrors.business_hours}</p>
          )}
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="btn-spinner" aria-label="Saving…" /> : null}
          {saving ? 'Saving…' : 'Save Contact Section'}
        </button>
      </div>
    </form>
  );
}
