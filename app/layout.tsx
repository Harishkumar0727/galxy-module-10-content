import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GALXY — Admin CMS",
  description: "GALXY Custom Lighting & Craft Studio — Admin Content Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
