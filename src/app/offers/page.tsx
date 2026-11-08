import Link from 'next/link';
import { PageIntro, EmptyState } from '@/components/ui';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/offers',
  title: 'Offers & Beauty Packages | Urban Beauti Salon',
  description: 'Explore sample beauty packages and see where salon-approved offers will appear.',
});
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Explore more care"
        title={<>Offers & Beauty Packages</>}
        description="Salon-approved offers will appear here, with clear inclusions, validity and terms."
      />
      <section className="section">
        <EmptyState
          title="No current offers"
          description="There are no owner-approved offers in this demonstration. Explore our illustrative packages instead."
        />
        <div style={{ textAlign: 'center' }}>
          <Link className="button" href="/services?category=packages">
            Explore Beauty Packages
          </Link>
        </div>
      </section>
    </>
  );
}
