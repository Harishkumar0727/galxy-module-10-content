import React from 'react';
import { Metadata } from 'next';
import { getBulkSections, getSection } from '@/lib/api/site-content';
import { SeoHomeContent, HeroContent } from '@/lib/types/site-content';
import HeroSection from '@/components/site-content/HeroSection';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSection<SeoHomeContent>('seo_home');
    return {
      title: seo.meta_title,
      description: seo.meta_description,
      openGraph: {
        title: seo.meta_title,
        description: seo.meta_description,
        images: seo.og_image ? [{ url: seo.og_image }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating homepage metadata:', error);
    return {
      title: 'GALXY | Custom Lighting & Craft Studio',
      description: 'Handcrafted custom neon lights, aesthetic signs, and custom craft lighting designs.',
    };
  }
}

export default async function HomePage() {
  let hero: HeroContent | null = null;

  try {
    const data = await getBulkSections(['hero', 'footer', 'social_links']);
    hero = data.hero;
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

      {/* Featured Content / Studio Showcase Preview */}
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
            Crafted for Brilliance
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: 300,
            lineHeight: '1.6'
          }}>
            Explore our curated craft light collections designed to illuminate your environment with customized, artistic glows.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              color: 'var(--color-pink)',
              fontWeight: 800,
              fontSize: '1.5rem',
              fontFamily: 'var(--font-display)'
            }}>
              01 / Neon Art
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>Custom Signs</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300 }}>
              Turn your logo, slogan, or illustration into an exquisite, vibrant neon sign crafted using standard energy-efficient LEDs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              color: 'var(--color-blue)',
              fontWeight: 800,
              fontSize: '1.5rem',
              fontFamily: 'var(--font-display)'
            }}>
              02 / Glow Panels
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>Ambient backlights</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300 }}>
              Engineered panels providing smooth backlighting effects, perfect for modern offices, bedrooms, and gaming setups.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              color: 'var(--color-violet)',
              fontWeight: 800,
              fontSize: '1.5rem',
              fontFamily: 'var(--font-display)'
            }}>
              03 / Installations
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>Large Scale</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300 }}>
              Bespoke lighting systems and architectural installations tailored to event stages, storefronts, and galleries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
