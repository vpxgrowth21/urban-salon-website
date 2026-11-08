'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { categories } from '@/lib/demo/catalogue';
import { useDemo } from './demo-provider';
import { DemoPriceNotice, EmptyState, ServiceRow } from './ui';
export function Catalogue({ initialCategory = 'all' }: { initialCategory?: string }) {
  const { state } = useDemo();
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended');
  const list = state.services
    .filter(
      (s) =>
        s.active &&
        (category === 'all' || s.category === category) &&
        `${s.name} ${s.subcategory} ${s.description}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'price'
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : sort === 'duration'
          ? a.duration - b.duration
          : 0,
    );
  return (
    <section className="section catalogue-layout">
      <aside className="catalogue-sidebar">
        <span className="eyebrow">FIND YOUR RITUAL</span>
        <div className="category-nav" aria-label="Filter services by category">
          {[{ id: 'all', name: 'All services' }, ...categories].map((c) => (
            <button
              key={c.id}
              className={category === c.id ? 'active' : ''}
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
              <span>
                {
                  state.services.filter((s) => s.active && (c.id === 'all' || s.category === c.id))
                    .length
                }
              </span>
            </button>
          ))}
        </div>
        <div className="sidebar-note">
          <p>Something for a special day?</p>
          <Link className="text-link" href="/bridal">
            Let’s talk bridal <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div>
        <div className="search-box">
          <Search size={18} />
          <input
            aria-label="Search services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search haircut, facial, threading…"
          />
          {search && (
            <button className="icon-button" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>
        <div className="catalogue-toolbar">
          <span>{list.length} illustrative services</span>
          <label>
            Sort by{' '}
            <select
              aria-label="Sort services"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price">Price: low to high</option>
              <option value="duration">Duration</option>
            </select>
          </label>
        </div>
        <DemoPriceNotice />
        {list.length ? (
          list.map((s, i) => (
            <div key={s.id}>
              {(i === 0 || s.subcategory !== list[i - 1].subcategory) && sort === 'recommended' && (
                <h2 className="catalogue-heading">{s.subcategory}</h2>
              )}
              <ServiceRow service={s} />
            </div>
          ))
        ) : (
          <EmptyState
            title="No rituals found"
            description="Try another service name or explore a different category."
          />
        )}
      </div>
    </section>
  );
}
