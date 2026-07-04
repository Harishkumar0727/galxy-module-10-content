/**
 * lib/types/site-content.ts
 *
 * Canonical type definitions for all 6 site-content sections.
 *
 * TYPE OWNERSHIP: Member 3 (Barkavi — M-10C) owns these interfaces.
 * This file acts as the shared source of truth within this module until
 * Barkavi's branch is merged into dev. Once merged, REPLACE the contents
 * of this file with a barrel re-export from her package:
 *
 *   export type * from '@galxy/shared-types/site-content';
 *
 * DO NOT redefine these types in any other file — always import from here.
 *
 * Consumers:
 *   - Member 4 (Leelavathy — M-10D): Admin CMS forms (read-only)
 *   - Member 1 (Harishkumar): API route validation (read-only)
 */

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image: string | null;
}

// ─── About Section ───────────────────────────────────────────────────────────
export interface AboutContent {
  headline: string;
  body: string;
  images: string[];           // array of image URLs
  founder_photo: string | null;
  founder_name: string;
  founder_title: string;
}

// ─── Footer Section ──────────────────────────────────────────────────────────
export interface QuickLink {
  label: string;
  href: string;
}

export interface FooterContent {
  tagline: string;
  quick_links: QuickLink[];
  copyright_text: string;
}

// ─── Contact Section ─────────────────────────────────────────────────────────
export interface ContactContent {
  email: string;
  phone: string;
  address: string;
  map_embed_url: string;
  business_hours: string;
}

// ─── SEO (Home) Section ──────────────────────────────────────────────────────
export interface SeoHomeContent {
  title: string;
  description: string;
  og_image: string | null;
  og_title: string;
  og_description: string;
  canonical_url: string;
}

// ─── Social Links Section ────────────────────────────────────────────────────
export interface SocialLinksContent {
  instagram: string;
  facebook: string;
  youtube: string;
  pinterest: string;
  twitter: string;
}

// ─── Union type for all 6 sections ───────────────────────────────────────────
export type SectionName =
  | 'hero'
  | 'about'
  | 'footer'
  | 'contact'
  | 'seo_home'
  | 'social_links';

export type SectionContent =
  | HeroContent
  | AboutContent
  | FooterContent
  | ContactContent
  | SeoHomeContent
  | SocialLinksContent;

// ─── API response envelope ────────────────────────────────────────────────────
export interface SiteContentResponse<T extends SectionContent> {
  success: boolean;
  data: {
    section: SectionName;
    content: T;
  };
}

export interface SiteContentErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string>; // { fieldName: "error reason" }
}
