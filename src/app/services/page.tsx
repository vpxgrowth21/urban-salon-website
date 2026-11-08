import { Catalogue } from '@/components/catalogue';
import { PageIntro } from '@/components/ui';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/services',
  title: 'Beauty Services & Prices | Urban Beauti Salon',
  description:
    'Explore hair, skin, makeup and nail services at Urban Beauti Salon, with sample prices and estimated treatment times.',
});
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <>
      <PageIntro
        eyebrow="Your beauty menu"
        title={<>Services & Prices</>}
        description="Explore treatments, demo prices and estimated durations."
      />
      <Catalogue initialCategory={category} />
    </>
  );
}
