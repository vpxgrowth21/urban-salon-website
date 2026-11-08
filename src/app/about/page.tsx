import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/ui';
export const metadata = { title: 'About Urban Beauti' };
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="MEET URBAN BEAUTI"
        title={<>About Urban Beauti Salon</>}
        description="A ladies-only salon concept in Gandhinagar, with a simple idea: make caring for yourself feel effortless."
      />
      <section className="section editorial">
        <div className="editorial-photo">
          <Image
            src="/images/salon.jpg"
            alt="Stock salon interior for demonstration; not the Urban Beauti premises"
            fill
            priority
            sizes="(max-width: 700px) 90vw, 45vw"
          />
          <span className="photo-label">Stock interior · Demonstration only</span>
        </div>
        <div>
          <span className="eyebrow">A LITTLE SPACE FOR YOU</span>
          <h2>
            Everyday beauty.
            <br />
            <em>Extra care.</em>
          </h2>
          <p>
            Urban Beauti Salon is a ladies-only beauty salon in Gandhinagar, Gujarat. This website
            demonstrates a welcoming way to explore hair, skin, makeup and beauty services.
          </p>
          <p>
            Discover a treatment, see an estimated price and request a convenient time. Every
            appointment will need salon approval, with payment at the salon.
          </p>
          <p>The owner’s story, team and actual salon photographs will be added once approved.</p>
          <Link className="button" href="/services">
            View Services & Prices <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="section feature-cards">
        {[
          [
            '01',
            'Clarity, from the start',
            'Service details, estimated duration and transparent demonstration prices.',
          ],
          [
            '02',
            'Your time matters',
            'A short request flow, without creating an account or making an online payment.',
          ],
          [
            '03',
            'A thoughtful next step',
            'Owner review before confirmation, so your appointment is clearly understood.',
          ],
        ].map(([n, t, p]) => (
          <div className="feature-card" key={n}>
            <span>{n}</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </div>
        ))}
      </section>
    </>
  );
}
