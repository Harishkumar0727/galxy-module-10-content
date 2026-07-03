import React from 'react';
import { Metadata } from 'next';
import { getSection } from '@/lib/api/site-content';
import { ContactContent } from '@/lib/types/site-content';
import ContactSection from '@/components/site-content/ContactSection';

export const metadata: Metadata = {
  title: 'Contact GALXY | Custom Lighting & Craft Studio',
  description: 'Get in touch with GALXY Studio for custom neon lighting projects, quotes, or queries.',
};

export default async function ContactPage() {
  let contact: ContactContent | null = null;

  try {
    contact = await getSection<ContactContent>('contact');
  } catch (error) {
    console.error('Error fetching contact page content:', error);
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
          Let's Glow
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Start Your Project Today
        </p>
      </div>

      {contact ? (
        <ContactSection contact={contact} />
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
