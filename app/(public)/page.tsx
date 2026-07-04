import React from 'react';
import { Metadata } from 'next';
import { getBulkSections, getSection } from '@/lib/api/site-content';
import { SeoHomeContent, HeroContent, FooterContent, SocialLinksContent } from '@/lib/types/site-content';
import HeroSection from '@/components/site-content/HeroSection';
import SocialLinks from '@/components/site-content/SocialLinks';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSection<SeoHomeContent>('seo_home');
    return {
      title: seo?.meta_title || '',
      description: seo?.meta_description || '',
      openGraph: {
        title: seo?.meta_title || '',
        description: seo?.meta_description || '',
        images: seo?.og_image ? [{ url: seo.og_image }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating homepage metadata:', error);
    return {}; // Safely returns empty, letting Next.js fall back to root layout metadata
  }
}

export default async function HomePage() {
  let hero: HeroContent | null = null;
  let footer: FooterContent | null = null;
  let socialLinks: SocialLinksContent | null = null;

  try {
    // Keep homepage bulk fetch exactly as specified in the original Module 10 document
    const data = await getBulkSections(['hero', 'footer', 'social_links']);
    hero = data.hero || null;
    footer = data.footer || null;
    socialLinks = data.social_links || null;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-space)', minHeight: '100vh', position: 'relative' }}>
      {/* Background glow overlay */}
      <div className="cosmic-glow-2" style={{ top: '40%', left: '10%', opacity: 0.25 }}></div>
      
      {/* Hero Section */}
      {hero ? (
        <HeroSection hero={hero} />
      ) : (
        <div style={{ 
          height: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem'
        }}>
          Connecting to GALXY Studio API...
        </div>
      )}

      {/* Featured Content / Studio Showcase (API Driven & Spec Compliant) */}
      {footer && socialLinks && (
        <section style={{
          padding: '6rem 2rem',
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          position: 'relative',
          zIndex: 3
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              background: 'linear-gradient(90deg, #fff, var(--text-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Discover the Studio
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: '1.6'
            }}>
              {footer.tagline}
            </p>
          </div>

          {/* Featured Cards / Visual Showcase Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem'
          }}>
            {/* Visual Card 1 */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div style={{ color: 'var(--color-pink)', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                Studio Hours
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300, whiteSpace: 'pre-line' }}>
                {footer.business_hours}
              </p>
            </div>

            {/* Visual Card 2 */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ color: 'var(--color-blue)', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
                Connect Online
              </div>
              <SocialLinks socialLinks={socialLinks} />
            </div>

            {/* Visual Card 3 - Showcase placeholder (No hardcoded text copy) */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem' }}>
              <div style={{ color: 'var(--color-violet)', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                GALXY Design
              </div>
              <div style={{
                height: '100%',
                minHeight: '80px',
                backgroundImage: 'linear-gradient(135deg, rgba(255, 45, 85, 0.1), rgba(88, 86, 214, 0.1))',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}>
                Artistic Craft Studio
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
