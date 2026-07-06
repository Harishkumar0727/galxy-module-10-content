import { NextRequest, NextResponse } from 'next/server';
import type { SectionName, SectionContent } from '@/lib/types/site-content';

const MOCK_DATA: Record<string, SectionContent> = {
  hero: {
    title: 'GALXY Custom Lighting & Craft Studio',
    subtitle: 'Handcrafted illumination for modern spaces — where light meets artistry.',
    cta_text: 'Explore Collection',
    cta_link: '/collection',
    background_image: '/images/hero-bg.jpg',
  },
  about: {
    headline: 'Bringing Light to Life, One Piece at a Time',
    body: 'Founded in 2015, GALXY Studio blends traditional craftsmanship with modern design. Every piece is handcrafted by our team of skilled artisans using sustainably sourced materials.',
    images: ['/images/about-1.jpg', '/images/about-2.jpg'],
    founder_photo: '/images/founder.jpg',
    founder_name: 'Priya Mehta',
    founder_title: 'Founder & Creative Director',
  },
  footer: {
    tagline: 'Handcrafted lighting for the discerning.',
    quick_links: [
      { label: 'Collection', href: '/collection' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    copyright_text: '© 2026 GALXY Custom Lighting & Craft Studio. All rights reserved.',
  },
  contact: {
    email: 'hello@galxy.studio',
    phone: '+91 98765 43210',
    address: '42 Light Alley, Kammanahalli, Bengaluru, Karnataka 560084, India',
    map_embed_url: 'https://maps.google.com/?q=Kammanahalli+Bengaluru',
    business_hours: 'Mon–Sat: 10am – 7pm | Sun: By appointment',
  },
  seo_home: {
    title: 'GALXY — Custom Lighting & Craft Studio | Bengaluru',
    description: 'Discover handcrafted lighting fixtures made in Bengaluru. GALXY Studio creates bespoke lamps, pendants, and installations for modern interiors.',
    og_image: '/images/og-default.jpg',
    og_title: "GALXY — Light Meets Artistry",
    og_description: 'Handcrafted lighting fixtures made in Bengaluru by skilled artisans.',
    canonical_url: 'https://galxy.studio',
  },
  social_links: {
    instagram: 'https://instagram.com/galxy.studio',
    facebook: 'https://facebook.com/galxystudio',
    youtube: 'https://youtube.com/@galxystudio',
    pinterest: 'https://pinterest.com/galxystudio',
    twitter: 'https://twitter.com/galxystudio',
  },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const content = MOCK_DATA[section];

  if (!content) {
    return NextResponse.json(
      { success: false, message: `Unknown section: ${section}`, errors: {} },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { section, content },
  });
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!MOCK_DATA[section]) {
    return NextResponse.json(
      { success: false, message: `Unknown section: ${section}`, errors: {} },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
