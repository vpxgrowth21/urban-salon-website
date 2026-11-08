import type { Metadata } from 'next';

export const siteName = 'Urban Beauti Salon';
export const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://urban-salon-website.vercel.app',
).origin;

export const homeTitle = `${siteName} | Ladies Beauty Salon in Gandhinagar`;
export const homeDescription =
  'Discover Urban Beauti Salon in Gandhinagar. Explore beauty services, sample prices and a demo appointment request.';

const shareImage = {
  url: '/opengraph-image.png',
  width: 1731,
  height: 909,
  type: 'image/png',
  alt: 'Urban Beauti Salon in Gandhinagar. Your Beauty. Your Moment. A collage of hairstyling, skincare, threading, waxing, nail care and bridal makeup.',
};

export function publicPageMetadata({
  path,
  title,
  description,
  socialTitle = title,
}: {
  path: string;
  title: string;
  description: string;
  socialTitle?: string;
}): Metadata {
  const url = new URL(path, siteOrigin).href;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      siteName,
      type: 'website',
      url,
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [shareImage],
    },
  };
}
