import React from 'react';
import { Metadata } from 'next';
import { getSection } from '@/lib/api/site-content';
import { AboutContent } from '@/lib/types/site-content';
import AboutSection from '@/components/site-content/AboutSection';

export const metadata: Metadata = {
  title: 'About GALXY | Custom Lighting & Craft Studio',
  description: 'Learn about the vision, team, and crafted history of GALXY Custom Lighting.',
};

export default async function AboutPage() {
  let about: AboutContent | null = null;

  try {
    about = await getSection<AboutContent>('about');
  } catch (error) {
    console.error('Error fetching about page content:', error);
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-space)', minHeight: '80vh', position: 'relative' }}>
      <div style={{
        paddingTop: '4rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 3,
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}>
          Our Story
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Handcrafted in the Studio
        </p>
      </div>

      {about ? (
        <AboutSection about={about} />
      ) : (
        <div style={{ 
          height: '40vh', 
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
    </div>
  );
}
