'use client';

/**
 * components/admin/site-content/FooterForm.tsx
 *
 * Admin form for the footer section.
 * Fields: tagline, quick_links[] (dynamic add/remove/reorder), copyright_text
 *
 * Fix 6: Replaced unreliable HTML5 drag API with @dnd-kit/sortable.
 *         Works correctly on touch devices; no ghost-image jank.
 * Fix 5: Added onDirtyChange prop + dirty tracking via useEffect.
 *
 * Owned by: Member 4 (Leelavathy) — M-10D
 */

import React, { useEffect, useRef, useState } from 'react';
import type { FooterContent, QuickLink } from '@/lib/types/site-content';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Module-level counter for stable dnd-kit IDs across renders
let _linkIdCounter = 0;

// ─── Sortable quick-link row ──────────────────────────────────────────────────
interface SortableRowProps {
  id: string;
  idx: number;
  link: QuickLink;
  fieldErrors: Record<string, string>;
  localErrors: Record<string, string>;
  onUpdate: (idx: number, field: keyof QuickLink, value: string) => void;
  onRemove: (idx: number) => void;
}

function SortableRow({
  id,
  idx,
  link,
  fieldErrors,
  localErrors,
  onUpdate,
  onRemove,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`quick-link-row${isDragging ? ' quick-link-row--dragging' : ''}`}
      role="listitem"
      aria-label={`Quick link ${idx + 1}`}
    >
      {/* Drag handle — only this element activates the drag */}
      <span
        className="drag-handle"
        aria-label="Drag to reorder"
        title="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⠿
      </span>

      <input
        type="text"
        className={`field-input field-input--sm${(fieldErrors[`quick_links.${idx}.label`] || localErrors[`quick_links.${idx}.label`]) ? ' field-input--error' : ''}`}
        value={link.label}
        onChange={(e) => onUpdate(idx, 'label', e.target.value)}
        placeholder="Label (e.g. Portfolio)"
        aria-label={`Quick link ${idx + 1} label`}
      />

      <input
        type="text"
        className={`field-input field-input--sm${(fieldErrors[`quick_links.${idx}.href`] || localErrors[`quick_links.${idx}.href`]) ? ' field-input--error' : ''}`}
        value={link.href}
        onChange={(e) => onUpdate(idx, 'href', e.target.value)}
        placeholder="URL (e.g. /portfolio)"
        aria-label={`Quick link ${idx + 1} URL`}
      />

      <button
        type="button"
        className="btn btn-ghost btn-danger-text btn-icon"
        onClick={() => onRemove(idx)}
        aria-label={`Remove quick link ${idx + 1}`}
      >
        ✕
      </button>
    </div>
  );
}

// ─── FooterForm ───────────────────────────────────────────────────────────────
interface FooterFormProps {
  initialData: FooterContent;
  onSave: (data: FooterContent) => Promise<void>;
  saving: boolean;
  fieldErrors: Record<string, string>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function FooterForm({
  initialData,
  onSave,
  saving,
  fieldErrors,
  onDirtyChange,
}: FooterFormProps) {
  const [form, setForm] = useState<FooterContent>(initialData);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const initialRef = useRef(initialData);
  const onDirtyChangeRef = useRef(onDirtyChange);
  useEffect(() => { onDirtyChangeRef.current = onDirtyChange; }, [onDirtyChange]);

  // Fix 5: dirty tracking
  useEffect(() => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
    onDirtyChangeRef.current?.(isDirty);
  }, [form]);

  const set = <K extends keyof FooterContent>(key: K, value: FooterContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (localErrors[key]) setLocalErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  // ── Stable IDs for dnd-kit sortable rows ──────────────────────────────────
  // Audit §5.3: use persistent unique IDs instead of array index so that
  // React keys / dnd-kit ids remain stable across reorders, preventing
  // input focus from jumping.
  const [linkIds, setLinkIds] = useState<string[]>(() =>
    initialData.quick_links.map(() => `ql-${_linkIdCounter++}`)
  );

  // ── Quick-links helpers ────────────────────────────────────────────────────
  const addLink = () => {
    setForm((prev) => ({
      ...prev,
      quick_links: [...prev.quick_links, { label: '', href: '' }],
    }));
    setLinkIds((prev) => [...prev, `ql-${_linkIdCounter++}`]);
  };

  const removeLink = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      quick_links: prev.quick_links.filter((_, i) => i !== idx),
    }));
    setLinkIds((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLink = (idx: number, field: keyof QuickLink, value: string) =>
    setForm((prev) => ({
      ...prev,
      quick_links: prev.quick_links.map((link, i) =>
        i === idx ? { ...link, [field]: value } : link
      ),
    }));

  // Fix 6: dnd-kit reorder via arrayMove
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setForm((prev) => {
      const oldIdx = linkIds.indexOf(String(active.id));
      const newIdx = linkIds.indexOf(String(over.id));
      if (oldIdx === -1 || newIdx === -1) return prev;
      return { ...prev, quick_links: arrayMove(prev.quick_links, oldIdx, newIdx) };
    });
    setLinkIds((prev) => {
      const oldIdx = prev.indexOf(String(active.id));
      const newIdx = prev.indexOf(String(over.id));
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    form.quick_links.forEach((link, i) => {
      if (link.href && !/^(https?:\/\/|\/)/.test(link.href)) {
        errs[`quick_links.${i}.href`] = 'Enter a valid URL (https://... or /path).';
      }
    });
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

        {/* Tagline */}
        <div className="field-group">
          <label className="field-label" htmlFor="footer-tagline">
            Tagline
          </label>
          <input
            id="footer-tagline"
            type="text"
            className={`field-input${err('tagline') ? ' field-input--error' : ''}`}
            value={form.tagline}
            onChange={(e) => set('tagline', e.target.value)}
            placeholder="e.g. Illuminating spaces, crafting memories."
          />
          {err('tagline') && <p className="field-error">{err('tagline')}</p>}
        </div>

        {/* Copyright */}
        <div className="field-group">
          <label className="field-label" htmlFor="footer-copyright">
            Copyright Text
          </label>
          <input
            id="footer-copyright"
            type="text"
            className={`field-input${err('copyright_text') ? ' field-input--error' : ''}`}
            value={form.copyright_text}
            onChange={(e) => set('copyright_text', e.target.value)}
            placeholder="e.g. © 2026 GALXY. All rights reserved."
          />
          {err('copyright_text') && (
            <p className="field-error">{err('copyright_text')}</p>
          )}
        </div>

        {/* Quick Links — dnd-kit sortable list */}
        <div className="field-group field-group--full">
          <div className="field-label">
            Quick Links
            <span className="field-hint">(drag to reorder)</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={linkIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="quick-links-list" role="list">
                {form.quick_links.map((link, idx) => (
                  <SortableRow
                    key={linkIds[idx]}
                    id={linkIds[idx]}
                    idx={idx}
                    link={link}
                    fieldErrors={fieldErrors}
                    localErrors={localErrors}
                    onUpdate={updateLink}
                    onRemove={removeLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {err('quick_links') && (
            <p className="field-error">{err('quick_links')}</p>
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
