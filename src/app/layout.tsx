import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import './globals.css';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.eventName} | ${siteConfig.organization}`,
  description: siteConfig.description,
  icons: '/favicon.svg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={{ '--accent': siteConfig.primaryColor } as CSSProperties}>{children}</body>
    </html>
  );
}
