import type { Metadata } from 'next';

export const siteName = 'Urban Beauti Salon';
export const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://urban-salon-website.vercel.app',
).origin;

export const homeTitle = `${siteName} | Ladies Beauty Salon in Gandhinagar`;
export const homeDescription =
  'Discover Urban Beauti Salon in Gandhinagar. Explore beauty services, sample prices and a demo appointment request.';

const shareImage = {
  url: '/opengraph-image.jpg?v=2',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'Urban Beauti Salon website preview. Your Beauty. Your Moment. Ladies beauty salon in Gandhinagar, alongside a stock Indian bridal portrait.',
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
