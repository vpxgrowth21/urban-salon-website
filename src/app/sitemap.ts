import type { MetadataRoute } from 'next';
import { services } from '@/lib/demo/catalogue';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];
  return [
    '',
    '/services',
    '/bridal',
    '/gallery',
    '/about',
    '/contact',
    '/offers',
    ...services.map((s) => `/services/${s.id}`),
  ].map((path) => ({ url: new URL(path, origin).href }));
}
