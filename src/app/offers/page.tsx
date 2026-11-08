import Link from 'next/link';
import { PageIntro, EmptyState } from '@/components/ui';
export const metadata = { title: 'Offers & Beauty Packages' };
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
