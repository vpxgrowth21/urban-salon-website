import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { DemoProvider } from '@/components/demo-provider';
import { Header, Footer } from '@/components/site-shell';
import './globals.css';
const editorial = localFont({
  src: [
    { path: '../../public/fonts/editorial.woff2', weight: '300 700', style: 'normal' },
    { path: '../../public/fonts/editorial-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-editorial',
  display: 'swap',
});
const manrope = localFont({
  src: '../../public/fonts/manrope.woff2',
  weight: '200 800',
  variable: '--font-manrope',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  ),
  title: {
    default: 'Urban Beauti Salon | Beauty, on your terms',
    template: '%s | Urban Beauti Salon',
  },
  description:
    'Explore an illustrative beauty service menu and a simple appointment request demo for Urban Beauti Salon, Gandhinagar.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Urban Beauti Salon',
    description: 'A little time for yourself. Explore the frontend demonstration.',
    images: [{ url: '/images/hero.jpg', width: 1400, height: 2100 }],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${editorial.variable} ${manrope.variable}`}>
      <body>
        <DemoProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </DemoProvider>
      </body>
    </html>
  );
}
