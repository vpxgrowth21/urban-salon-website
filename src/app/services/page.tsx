import { Catalogue } from '@/components/catalogue';
import { PageIntro } from '@/components/ui';
export const metadata = { title: 'Services & Prices' };
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
