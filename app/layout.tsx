import './globals.css';
import React from 'react';
import Link from 'next/link';
import Footer from '@/components/site-content/Footer';
import StickyContact from '@/components/site-content/StickyContact';
import { getBulkSections } from '@/lib/api/site-content';

export const metadata = {
  title: 'GALXY | Custom Lighting & Craft Studio',
  description: 'Handcrafted custom neon lights, aesthetic signs, and custom craft lighting designs.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let footer = null;
  let socialLinks = null;
  let contact = null;

  try {
    const data = await getBulkSections(['footer', 'social_links', 'contact']);
    footer = data.footer;
    socialLinks = data.social_links;
    contact = data.contact;
  } catch (error) {
    console.error('Error fetching global layout content:', error);
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {/* Navigation Bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(3, 3, 3, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          zIndex: 50,
        }}>
          <nav className="navbar">
            <Link href="/" className="nav-logo">
              GALXY
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Global Page Content */}
        <main>{children}</main>

        {/* Global Footer */}
        {footer && <Footer footer={footer} socialLinks={socialLinks} />}

        {/* Persistent Floating Sticky Contact Buttons */}
        {contact && socialLinks && (
          <StickyContact
            whatsappNumber={contact.whatsapp_number}
            instagramUrl={socialLinks.instagram}
          />
        )}
      </body>
    </html>
  );
}
