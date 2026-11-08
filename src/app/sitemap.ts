import type { MetadataRoute } from 'next';
import { services } from '@/lib/demo/catalogue';
import { siteOrigin } from '@/lib/site-metadata';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/services',
    '/bridal',
    '/gallery',
    '/about',
    '/contact',
    '/offers',
    ...services.map((s) => `/services/${s.id}`),
  ].map((path) => ({ url: new URL(path, siteOrigin).href }));
}
