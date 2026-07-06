/**
 * lib/types/_site-content-types.ts
 *
 * Canonical type definitions for all 6 site-content sections.
 *
 * TYPE OWNERSHIP: Member 3 (Barkavi — M-10C) owns these interfaces.
 * This file is a local placeholder until Barkavi's branch is merged.
 * Once merged, lib/types/site-content.ts should re-export from her package:
 *
 *   export type * from '@galxy/shared-types/site-content';
 *
 * DO NOT redefine these types in any other file — always import from site-content.ts.
 *
 * Consumers:
 *   - Member 4 (Leelavathy — M-10D): Admin CMS forms (read-only)
 *   - Member 1 (Harishkumar): API route validation (read-only)
 */

export interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image: string | null;
}

export interface AboutContent {
  headline: string;
  body: string;
  images: string[];
  founder_photo: string | null;
  founder_name: string;
  founder_title: string;
}

export interface QuickLink {
  label: string;
  href: string;
}

export interface FooterContent {
  tagline: string;
  quick_links: QuickLink[];
  copyright_text: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  address: string;
  map_embed_url: string;
  business_hours: string;
}

export interface SeoHomeContent {
  title: string;
  description: string;
  og_image: string | null;
  og_title: string;
  og_description: string;
  canonical_url: string;
}

export interface SocialLinksContent {
  instagram: string;
  facebook: string;
  youtube: string;
  pinterest: string;
  twitter: string;
}

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
  errors: Record<string, string>;
}
