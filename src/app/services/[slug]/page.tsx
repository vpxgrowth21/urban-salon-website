import { notFound } from 'next/navigation';
import { services } from '@/lib/demo/catalogue';
import { ServiceDetail } from '@/components/service-detail';
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: services.find((s) => s.id === slug)?.name || 'Service',
    description:
      'Explore illustrative treatment details, duration and demonstration prices at Urban Beauti Salon.',
  };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!services.some((s) => s.id === slug)) notFound();
  return <ServiceDetail id={slug} />;
}
