'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, X, MapPin } from 'lucide-react';
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Urban Beauti Salon home">
      <Image
        className="brand-symbol"
        src="/images/urban-beauti-monogram.webp"
        alt=""
        width={160}
        height={113}
        unoptimized
      />
      <span>
        URBAN BEAUTI<small>S A L O N</small>
      </span>
    </Link>
  );
}
const links = [
  ['/services', 'Services & Prices'],
  ['/bridal', 'Bridal'],
  ['/gallery', 'Gallery'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="topline">
        <span>Ladies-only beauty salon</span>
        <span>
          <MapPin size={12} /> Gandhinagar, Gujarat <i />{' '}
          <span className="demo-label">Website demo</span>
        </span>
      </div>
      <header className="header">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={path.startsWith(href) ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/book" className="button small">
            Book an Appointment <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)}>
              Book an Appointment
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
export function Footer() {
  const path = usePathname();
  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              A little care. A little confidence.
              <br />A moment, just for you.
            </p>
            <span className="location">
              <MapPin size={15} /> Gandhinagar, Gujarat
            </span>
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            <Link href="/services">Services & Prices</Link>
            <Link href="/bridal">Bridal & Makeup</Link>
            <Link href="/gallery">Beauty Gallery</Link>
            <Link href="/offers">Offers</Link>
          </div>
          <div>
            <span className="eyebrow">Plan your next visit</span>
            <p>Find your next beauty ritual.</p>
            <Link className="text-link" href="/book">
              Request an appointment <ArrowUpRight size={17} />
            </Link>
            <p className="muted caption">Pay at the salon · Owner approval required</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Urban Beauti Salon · Frontend demonstration</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/booking-policy">Booking policy</Link>
            <Link href="/demo/admin">
              Owner demo <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
        <p className="demo-disclosure">
          Illustrative services, prices and demonstration imagery. No real appointments or messages.
          Please use sample details. Contact information and final salon rates await owner approval.
        </p>
      </footer>
      {!path.startsWith('/book') && !path.startsWith('/demo') && !path.startsWith('/booking') && (
        <div className="mobile-book">
          <span>
            No advance payment
            <br />
            <strong>Salon approval required</strong>
          </span>
          <Link className="button small" href="/book">
            Book an Appointment <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
