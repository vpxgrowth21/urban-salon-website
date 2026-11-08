'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Flower2,
  Scissors,
  Sparkles,
  Heart,
  CalendarDays,
  Check,
  Leaf,
  Paintbrush,
  Hand,
  Layers,
} from 'lucide-react';
import { categories, faqs } from '@/lib/demo/catalogue';
import { useDemo } from './demo-provider';
import { DemoPriceNotice, SectionHeading, ServiceRow } from './ui';
const icons = [Scissors, Sparkles, Flower2, Leaf, Paintbrush, Heart, Hand, Layers];
export function Home() {
  const { state } = useDemo();
  const [category, setCategory] = useState('popular');
  const shown = state.services
    .filter((s) => s.active && (category === 'popular' ? s.featured : s.category === category))
    .slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="short-line" /> Ladies-only salon · Gandhinagar
          </span>
          <h1>
            Your Beauty.
            <br />
            <span>Your Moment.</span>
          </h1>
          <p>Explore hair care, skincare and makeup at Urban Beauti Salon in Gandhinagar.</p>
          <div className="hero-buttons">
            <Link href="/book" className="button">
              Book an Appointment <ArrowUpRight size={18} />
            </Link>
            <Link href="/services" className="text-link">
              Explore Services & Prices <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-reassurance">
            <span>
              <Check size={14} /> No advance payment
            </span>
            <span>
              <Check size={14} /> Salon approval required
            </span>
          </div>
          <Link className="hero-scroll" href="#services">
            <span className="circle-icon">
              <ArrowDown size={16} />
            </span>{' '}
            Explore beauty services
          </Link>
        </div>
        <div className="hero-image">
          <Image
            src="/images/hero.jpg"
            alt="Stock beauty portrait of a woman in soft natural light"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 55vw"
          />
          <div className="image-tag">Beauty for every occasion</div>
          <div className="hero-note">
            <Flower2 strokeWidth={1} />
            <span>
              Thoughtfully chosen.
              <br />
              <em>Beautifully you.</em>
            </span>
          </div>
          <span className="photo-label">Demonstration photography</span>
        </div>
      </section>
      <div className="ritual-strip">
        <span>Hair care & styling</span>
        <Flower2 size={17} />
        <span>Facials & skincare</span>
        <Flower2 size={17} />
        <span>Makeup & nails</span>
        <Flower2 size={17} />
        <span>Bridal & occasions</span>
      </div>
      <section className="section services-home" id="services">
        <SectionHeading
          eyebrow="Services & prices"
          title={<>Explore Our Beauty Services</>}
          description="Find your favourite treatment, check demo prices and request a convenient appointment."
          href="/services"
        />
        <div className="category-grid">
          {categories.map((c, i) => {
            const Icon = icons[i];
            return (
              <Link href={`/services?category=${c.id}`} className="category-tile" key={c.id}>
                <Icon size={26} strokeWidth={1.2} />
                <span>{c.name}</span>
                <ArrowUpRight size={14} />
              </Link>
            );
          })}
        </div>
        <div className="popular-heading">
          <h3>Popular Beauty Services</h3>
          <div className="pill-tabs" aria-label="Featured service categories">
            {[
              ['popular', 'Popular'],
              ['hair', 'Hair'],
              ['facials', 'Facials'],
              ['nails', 'Nails'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={category === id ? 'active' : ''}
                aria-pressed={category === id}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="popular-layout">
          <div className="popular-image">
            <Image
              src="/images/styling.jpg"
              alt="Demonstration photo of a hair styling session"
              fill
              sizes="(max-width: 700px) 100vw, 35vw"
            />
            <span>GOOD HAIR. GOOD MOOD.</span>
          </div>
          <div className="popular-list">
            {shown.map((s) => (
              <ServiceRow key={s.id} service={s} />
            ))}
            <DemoPriceNotice />
          </div>
        </div>
      </section>
      <section className="bridal-feature">
        <div className="bridal-photo">
          <Image
            src="/images/bridal.jpg"
            alt="Stock Indian bridal makeup inspiration; not salon work"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <span className="photo-label">Sample beauty inspiration</span>
        </div>
        <div className="bridal-copy">
          <span className="eyebrow">For your special day</span>
          <h2>Bridal Makeup &amp; Special Occasions</h2>
          <p>
            From an intimate celebration to your wedding day, let’s talk about a look that’s
            unmistakably you.
          </p>
          <Link href="/bridal" className="button light">
            Explore Bridal & Makeup <ArrowUpRight size={17} />
          </Link>
          <span className="caption">Personal consultation · Thoughtful planning</span>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="Beauty inspiration"
          title={<>Our Beauty Gallery</>}
          href="/gallery"
          link="Explore the gallery"
          description="Explore hair, makeup and beauty inspiration. Demonstration photography only."
        />
        <div className="home-gallery">
          {[
            { img: 'hair', label: 'Hair that moves with you' },
            { img: 'nails', label: 'It’s all in the details' },
            { img: 'facial', label: 'Make room for your ritual' },
          ].map((x) => (
            <Link href="/gallery" key={x.img}>
              <div>
                <Image
                  src={`/images/${x.img}.jpg`}
                  alt={`Stock inspiration: ${x.label}`}
                  fill
                  sizes="(max-width: 700px) 80vw, 30vw"
                />
              </div>
              <span>
                {x.label}
                <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
        <p className="muted caption gallery-note">
          Curated stock photography for this demonstration. Our salon portfolio is coming after
          owner approval.
        </p>
      </section>
      <section className="care-section section">
        <div>
          <span className="eyebrow">Simple appointment requests</span>
          <h2>Book in 3 Easy Steps</h2>
          <p className="booking-explanation">
            Choose a service, select a preferred time and send your request. Salon approval is
            required.
          </p>
          <Link href="/about" className="text-link">
            Meet Urban Beauti <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="care-items">
          {[
            {
              Icon: Scissors,
              title: 'Choose your service',
              text: 'Browse services, clear demo prices and estimated durations.',
            },
            {
              Icon: CalendarDays,
              title: 'Select your preferred time',
              text: 'Request a time that fits into your day. No account needed.',
            },
            {
              Icon: Heart,
              title: 'Send your appointment request',
              text: 'The salon reviews your request. Pay when you visit.',
            },
          ].map(({ Icon, title, text }, i) => (
            <div key={title}>
              <span className="care-icon">
                <Icon strokeWidth={1.3} />
              </span>
              <div>
                <small>0{i + 1}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section faq-section">
        <div>
          <span className="eyebrow">Before you book</span>
          <h2>Questions Before Booking?</h2>
          <p>So you can book with clarity.</p>
        </div>
        <div className="faqs">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="visit-banner">
        <Flower2 size={40} strokeWidth={0.8} />
        <span className="eyebrow">GANDHINAGAR, GUJARAT</span>
        <h2>
          Ready for Your Next
          <br />
          Beauty Appointment?
        </h2>
        <Link className="button" href="/book">
          Request an Appointment <ArrowUpRight size={18} />
        </Link>
        <p>Appointment requests are reviewed by the salon. No advance payment.</p>
      </section>
    </>
  );
}
