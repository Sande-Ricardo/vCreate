import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'vCreate — ATS-Friendly CV Builder',
  description:
    'Create, edit, and export ATS-optimized CVs in Spanish and English. Download your professional resume as a PDF package.',
  keywords: ['CV builder', 'ATS resume', 'curriculum vitae', 'PDF generator'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
