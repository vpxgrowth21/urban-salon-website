import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { EnquiryForm } from '@/components/enquiry-form';
import { PageIntro } from '@/components/ui';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/bridal',
  title: 'Bridal & Occasion Makeup | Urban Beauti Salon',
  description:
    'Explore bridal makeup, occasion hairstyling, draping and pre-bridal care, and try the demo consultation form.',
});
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="A look that feels like you"
        title={<>Bridal Makeup & Special Occasions</>}
        description="A wedding, an engagement, an evening to remember. Start with a conversation about a look that feels like you."
      />
      <section className="section editorial">
        <div className="editorial-photo">
          <Image
            src="/images/bridal.jpg"
            alt="Stock Indian bridal makeup inspiration, not Urban Beauti client work"
            fill
            priority
            sizes="(max-width: 700px) 90vw, 45vw"
          />
          <span className="photo-label">Demonstration inspiration</span>
        </div>
        <div>
          <span className="eyebrow">LET’S PLAN YOUR LOOK</span>
          <h2>
            Made for the moment.
            <br />
            <em>True to you.</em>
          </h2>
          <p>
            Share your event date, your outfit and the details you love. A consultation helps bring
            your makeup and hair plans together.
          </p>
          <p>
            Explore illustrative bridal makeup, occasion hairstyling, draping and pre-bridal care.
            Final services, pricing and venue availability await owner approval.
          </p>
          <Link href="#enquire" className="button">
            Request a consultation <ArrowDown size={16} />
          </Link>
          <div className="notice">
            Consultation required. We don’t assign a routine time slot or an invented bridal package
            price.
          </div>
        </div>
      </section>
      <section className="section feature-cards">
        {[
          [
            '01',
            'The consultation',
            'Tell us about your event, preferences and the look you have in mind.',
          ],
          [
            '02',
            'The little details',
            'Discuss hair, makeup, draping and preparation as appropriate.',
          ],
          [
            '03',
            'Your personal plan',
            'Receive a salon-approved quote and schedule after consultation.',
          ],
        ].map(([n, title, text]) => (
          <div className="feature-card" key={n}>
            <span>{n}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>
      <section className="section form-section" id="enquire">
        <div>
          <span className="eyebrow">THE FIRST STEP TO YOUR LOOK</span>
          <h2>
            Let’s make it
            <br />
            <em>your moment.</em>
          </h2>
          <p>A few details are all we need to demonstrate your bridal enquiry.</p>
          <Link href="/services?category=makeup" className="text-link">
            Explore occasion makeup <ArrowUpRight size={16} />
          </Link>
        </div>
        <EnquiryForm kind="bridal" />
      </section>
    </>
  );
}
