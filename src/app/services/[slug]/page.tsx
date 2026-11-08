import { notFound } from 'next/navigation';
import { services } from '@/lib/demo/catalogue';
import { ServiceDetail } from '@/components/service-detail';
import { publicPageMetadata, siteName } from '@/lib/site-metadata';
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.id === slug);
  if (!service) notFound();
  return publicPageMetadata({
    path: `/services/${service.id}`,
    title: `${service.name} | ${siteName}`,
    description: `Explore ${service.name} at Urban Beauti Salon, including sample prices and estimated treatment times.`,
  });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!services.some((s) => s.id === slug)) notFound();
  return <ServiceDetail id={slug} />;
}
