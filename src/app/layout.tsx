import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { DemoProvider } from '@/components/demo-provider';
import { Header, Footer } from '@/components/site-shell';
import { homeDescription, homeTitle, siteName, siteOrigin } from '@/lib/site-metadata';
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
  metadataBase: new URL(siteOrigin),
  title: { default: homeTitle, template: `%s | ${siteName}` },
  description: homeDescription,
  robots: { index: false, follow: false },
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
