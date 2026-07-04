/**
 * lib/types/site-content.ts
 *
 * Placeholder type definitions for all 6 site-content sections.
 * TODO: Replace this file with Barkavi's (M-10C) merged lib/types/site-content.ts
 *       once her branch is merged into dev. Do NOT redefine these — import from here.
 *
 * Owned by: Member 3 (Barkavi) — read-only for Member 4 (Leelavathy)
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
