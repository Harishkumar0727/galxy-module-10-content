import React from 'react';
import { getSection } from '@/lib/api/site-content';
import { ContactContent } from '@/lib/types/site-content';
import ContactSection from '@/components/site-content/ContactSection';

export default async function ContactPage() {
  let contact: ContactContent | null = null;

  try {
    contact = await getSection<ContactContent>('contact');
  } catch (error) {
    console.error('Error fetching contact page content:', error);
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-space)', minHeight: '80vh', position: 'relative' }}>
      {contact && (
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
            {contact.title}
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            {contact.subtitle}
          </p>
        </div>
      )}

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
          Content Unavailable
        </div>
      )}
    </div>
  );
}
