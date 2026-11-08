'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { useDemo } from './demo-provider';
import { DemoPriceNotice, ServiceRow } from './ui';
import { money, priceLabel } from '@/lib/format';
export function ServiceDetail({ id }: { id: string }) {
  const { state } = useDemo();
  const s = state.services.find((s) => s.id === id);
  if (!s) return null;
  return (
    <>
      <div className="breadcrumbs">
        <Link href="/services">Services & Prices</Link> / {s.name}
      </div>
      <section className="section service-detail">
        <div className="detail-photo">
          <Image
            src={s.image}
            alt={`Demonstration inspiration for ${s.name}`}
            fill
            priority
            sizes="(max-width: 700px) 90vw, 45vw"
          />
          <span className="photo-label">Demonstration photography</span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{s.subcategory.toUpperCase()}</span>
          <h1>{s.name}</h1>
          <p>{s.description}</p>
          <div className="detail-price">
            {priceLabel(s)}
            <span>
              <Clock3 size={15} />
              {s.duration} min {s.variants && 'and up'}
            </span>
          </div>
          <DemoPriceNotice />
          {s.priceType === 'from' && (
            <p className="caption">
              Starting price only. Hair length, product choice and consultation may affect the final
              salon quote.
            </p>
          )}
          {s.variants?.map((v) => (
            <div className="option-card" key={v.id}>
              <span>
                {v.name} hair · {v.duration} min
              </span>
              <strong>{money(v.price)}</strong>
            </div>
          ))}
          {s.addons && (
            <>
              <h3>Optional extras</h3>
              {s.addons.map((a) => (
                <div className="option-card" key={a.id}>
                  <span>
                    {a.name} · {a.duration} min
                  </span>
                  <strong>{money(a.price)}</strong>
                </div>
              ))}
            </>
          )}
          <h3>What’s included</h3>
          <ul>
            {s.includes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h3>Before your visit</h3>
          <p className="caption">
            Tell the salon about your preferences and any product sensitivities during consultation.
            Treatment suitability and final details need salon approval.
          </p>
          {s.active ? (
            <Link
              className="button"
              href={
                s.price === null
                  ? s.category === 'bridal' || s.category === 'makeup'
                    ? '/bridal#enquire'
                    : '/contact'
                  : `/book?service=${s.id}`
              }
            >
              {s.price === null ? 'Enquire about a consultation' : 'Request this service'}
              <ArrowUpRight size={17} />
            </Link>
          ) : (
            <div className="notice">This demonstration service is currently unavailable.</div>
          )}
          <p className="caption">No advance payment · Appointments require owner approval</p>
        </div>
      </section>
      <section className="section">
        <span className="eyebrow">KEEP EXPLORING</span>
        <h2>
          A little more <em>you-time.</em>
        </h2>
        {state.services
          .filter((x) => x.id !== s.id && x.category === s.category && x.active)
          .slice(0, 3)
          .map((x) => (
            <ServiceRow key={x.id} service={x} />
          ))}
      </section>
    </>
  );
}
