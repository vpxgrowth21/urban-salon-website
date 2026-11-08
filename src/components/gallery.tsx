'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { gallery } from '@/lib/demo/catalogue';
export function Gallery() {
  const [category, setCategory] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const list = gallery.filter((x) => category === 'All' || x.category === category);
  const item = active === null ? null : list[active];
  const change = (offset: number) =>
    setActive((i) => (i === null ? null : (i + offset + list.length) % list.length));
  const touchStart = useRef(0);
  return (
    <section className="section">
      <div className="pill-tabs gallery-filters" aria-label="Gallery categories">
        {['All', 'Hair', 'Bridal', 'Makeup', 'Nails', 'Skin', 'The space'].map((c) => (
          <button
            key={c}
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="notice">
        Stock imagery and an AI-generated hair portrait for this demonstration. These images are
        inspiration, and are not Urban Beauti’s client work or salon premises.
      </div>
      <div className="gallery-grid">
        {list.map((x, i) => (
          <button
            className="gallery-card"
            key={x.id}
            onClick={() => setActive(i)}
            aria-label={`Open ${x.title}`}
          >
            <div>
              <Image
                src={x.image}
                alt={x.alt ?? `Stock inspiration: ${x.title}`}
                fill
                sizes="(max-width: 700px) 43vw, 29vw"
                style={{ objectPosition: x.position }}
              />
            </div>
            <span>{x.category}</span>
            <h3>{x.title}</h3>
          </button>
        ))}
      </div>
      <Dialog.Root
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content
            className="lightbox"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') change(1);
              if (e.key === 'ArrowLeft') change(-1);
            }}
            onTouchStart={(e) => {
              touchStart.current = e.changedTouches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const d = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(d) > 50) change(d < 0 ? 1 : -1);
            }}
          >
            {item && (
              <>
                <div className="lightbox-photo">
                  <Image
                    src={item.image}
                    alt={item.alt ?? `Demonstration stock photograph: ${item.title}`}
                    fill
                    sizes="90vw"
                  />
                </div>
                <Dialog.Title asChild>
                  <h2>{item.title}</h2>
                </Dialog.Title>
                <Dialog.Description>
                  Demonstration inspiration only · {(active || 0) + 1} of {list.length}
                </Dialog.Description>
              </>
            )}
            <Dialog.Close className="icon-button lightbox-close" aria-label="Close image">
              <X />
            </Dialog.Close>
            <button
              className="icon-button lightbox-prev"
              onClick={() => change(-1)}
              aria-label="Previous image"
            >
              <ArrowLeft />
            </button>
            <button
              className="icon-button lightbox-next"
              onClick={() => change(1)}
              aria-label="Next image"
            >
              <ArrowRight />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
