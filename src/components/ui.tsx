import Link from 'next/link';
import { ArrowUpRight, Check, Clock3 } from 'lucide-react';
import type { BookingStatus, Service } from '@/lib/types';
import { priceLabel, statusLabels } from '@/lib/format';
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  link = 'View all services',
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function DemoPriceNotice() {
  return (
    <p className="price-notice">
      <span className="tiny-dot" /> Demo prices — final salon rates pending confirmation
    </p>
  );
}
export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`status ${status}`}>
      <span className="tiny-dot" />
      {statusLabels[status]}
    </span>
  );
}
export function ServiceRow({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div className={`service-row ${selected ? 'selected' : ''}`}>
      <div className="service-info">
        <Link href={`/services/${service.id}`}>
          <h3>{service.name}</h3>
        </Link>
        <span className="muted caption">
          <Clock3 size={13} />
          {service.duration} min <span>·</span> {service.subcategory}
        </span>
      </div>
      <div className="service-price">
        <strong>{priceLabel(service)}</strong>
        {onSelect ? (
          <button
            onClick={onSelect}
            className={`button outline small ${selected ? 'chosen' : ''}`}
            aria-pressed={selected}
          >
            {selected ? (
              <>
                <Check size={14} /> Added
              </>
            ) : service.variants ? (
              'Choose options'
            ) : (
              'Add +'
            )}
          </button>
        ) : (
          <Link
            className="button outline small"
            href={
              service.price === null
                ? service.category === 'bridal' || service.category === 'makeup'
                  ? '/bridal#enquire'
                  : '/contact'
                : `/book?service=${service.id}`
            }
          >
            {service.price === null ? 'Enquire' : service.variants ? 'Choose options' : 'Book'}
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <span className="eyebrow">A LITTLE PAUSE</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
