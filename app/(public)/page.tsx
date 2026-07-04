import React from 'react';
import { Metadata } from 'next';
import { getBulkSections, getSection } from '@/lib/api/site-content';
import { SeoHomeContent, HeroContent, AboutContent, FooterContent, SocialLinksContent } from '@/lib/types/site-content';
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
    return {}; // No hardcoded fallback
  }
}

export default async function HomePage() {
  let hero: HeroContent | null = null;
  let about: AboutContent | null = null;
  let footer: FooterContent | null = null;
  let socialLinks: SocialLinksContent | null = null;

  try {
    const data = await getBulkSections(['hero', 'about', 'footer', 'social_links']);
    hero = data.hero || null;
    about = data.about || null;
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

      {/* Featured Content / Studio Showcase (API Driven) */}
      {about && (
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
              {about.title}
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              maxWidth: '800px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: '1.8',
              whiteSpace: 'pre-line'
            }}>
              {about.body_text}
            </p>
          </div>

          {/* Dynamic Grid showing about image showcase */}
          {about.images && about.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem'
            }}>
              {about.images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '16px', aspectRatio: '1.5' }}>
                  <img src={img} alt={`Showcase visual ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Dynamic footer/social integrations to consume all bulk fetched sections */}
          {footer && socialLinks && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              marginTop: '4rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '4rem'
            }}>
              <div className="glass-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Studio Tagline</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300 }}>
                  {footer.tagline}
                </p>
              </div>

              <div className="glass-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Business Hours</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300, whiteSpace: 'pre-line' }}>
                  {footer.business_hours}
                </p>
              </div>

              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Connect With Us</h3>
                <SocialLinks socialLinks={socialLinks} />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
