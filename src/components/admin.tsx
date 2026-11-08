'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, RotateCcw, Download, CalendarDays } from 'lucide-react';
import { useDemo } from './demo-provider';
import { StatusBadge, EmptyState } from './ui';
import { addDays, dateLabel, localDate, money, timeLabel } from '@/lib/format';
import type { Booking, Hours, Result, Service } from '@/lib/types';
const tabs = [
  'Requests',
  'Calendar',
  'Services & Prices',
  'Business hours',
  'Enquiries',
  'Simulator',
];
export function Admin() {
  const { state, gateway } = useDemo();
  const [tab, setTab] = useState('Requests');
  const [selected, setSelected] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [resetting, setResetting] = useState(false);
  const report = (r: Result<unknown>, success: string) => setMessage(r.ok ? success : r.error);
  const list = state.bookings.filter((b) => filter === 'all' || b.status === filter);
  const booking = state.bookings.find((b) => b.id === selected) || list[0];
  const pending = state.bookings.filter((b) => b.status === 'pending_approval');
  function exportPrices() {
    const text = [
      'service_id,price_paise,duration_minutes,active',
      ...state.services.map((s) => `${s.id},${s.price ?? ''},${s.duration},${s.active}`),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urban-beauti-demo-prices.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="admin-page">
      <div className="admin-wrap">
        <div className="admin-top">
          <div>
            <span className="eyebrow">URBAN BEAUTI / OWNER DEMONSTRATION</span>
            <h1>Owner Dashboard</h1>
            <p>
              Public demo · Synthetic requests · Changes stay in this browser · No notifications
              sent
            </p>
          </div>
          <div className="admin-actions">
            <Link href="/book" className="button small outline">
              Try customer booking <ArrowUpRight size={15} />
            </Link>
            <button className="button small outline" onClick={() => setResetting(true)}>
              <RotateCcw size={14} />
              Reset demo
            </button>
          </div>
        </div>
        {resetting && (
          <div className="notice">
            Reset all local demo bookings, enquiries, service edits and hours?
            <div className="success-actions">
              <button
                className="button small"
                onClick={() => {
                  gateway.reset();
                  setResetting(false);
                  setSelected('');
                  setMessage('Demo data restored.');
                }}
              >
                Reset all demo data
              </button>
              <button className="button small outline" onClick={() => setResetting(false)}>
                Keep my changes
              </button>
            </div>
          </div>
        )}
        <div className="admin-stats">
          <Stat title="Pending approval" value={pending.length} />
          <Stat
            title="Confirmed demo appointments"
            value={state.bookings.filter((b) => b.status === 'confirmed').length}
          />
          <Stat
            title="Illustrative active services"
            value={state.services.filter((s) => s.active).length}
          />
          <Stat title="Local enquiries" value={state.enquiries.length} />
        </div>
        <div className="admin-tabs" aria-label="Owner demo sections">
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? 'active' : ''}
              aria-pressed={tab === t}
              onClick={() => {
                setTab(t);
                setMessage('');
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {message && (
          <div className="notice" role="status">
            {message}
          </div>
        )}
        {tab === 'Requests' && (
          <>
            <div className="catalogue-toolbar">
              <h2 className="admin-subheading">Appointment Requests</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter requests"
              >
                <option value="all">All requests</option>
                <option value="pending_approval">Pending approval</option>
                <option value="confirmed">Confirmed</option>
                <option value="reschedule_proposed">Time proposed</option>
                <option value="declined">Declined</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no_show">No-show</option>
              </select>
            </div>
            <div className="admin-inbox">
              <div className="admin-list">
                {list.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelected(b.id)}
                    className={`request-card ${booking?.id === b.id ? 'active' : ''}`}
                  >
                    <div className="request-card-top">
                      <strong>{b.name}</strong>
                      <StatusBadge status={b.status} />
                    </div>
                    <p>{b.items.map((i) => i.name).join(' + ')}</p>
                    <div className="caption muted">
                      <span>
                        {dateLabel(b.date)} · {timeLabel(b.time)}
                      </span>
                      <span>
                        {b.duration} min · {money(b.total)}
                      </span>
                    </div>
                  </button>
                ))}
                {!list.length && (
                  <EmptyState
                    title="A quiet little inbox"
                    description="Try a customer booking to add a local demo request."
                  />
                )}
              </div>
              {booking && <RequestDetail key={booking.id} booking={booking} report={report} />}
            </div>
          </>
        )}
        {tab === 'Calendar' && (
          <>
            <h2 className="admin-subheading">Demo Appointment Calendar</h2>
            <p className="notice">
              Confirmed appointments allocate one sample resource. Pending requests only block time
              while their mock hold is active. All times: Asia/Kolkata.
            </p>
            <div className="calendar-list">
              {[...new Set(state.bookings.map((b) => b.date))].sort().map((d) => (
                <div key={d} className="calendar-day">
                  <h3>{dateLabel(d)}</h3>
                  {state.bookings
                    .filter((b) => b.date === d)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((b) => (
                      <div key={b.id} className="calendar-event">
                        <strong>
                          {timeLabel(b.time)} · {b.duration} min
                        </strong>
                        <p>
                          {b.name} · {b.items.map((i) => i.name).join(', ')}
                        </p>
                        <StatusBadge status={b.status} />
                        <div className="caption muted">Hold: {b.holdState}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
            {!state.bookings.length && (
              <EmptyState
                title="No demo appointments yet"
                description="Try a request from the customer website."
              />
            )}
          </>
        )}
        {tab === 'Services & Prices' && (
          <>
            <div className="catalogue-toolbar">
              <h2 className="admin-subheading">Manage Demo Services & Prices</h2>
              <button className="button outline small" onClick={exportPrices}>
                <Download size={14} />
                Export prices CSV
              </button>
            </div>
            <p className="notice">
              Edit illustrative prices, descriptions, durations, variants and visibility. All
              amounts below are in rupees. Every price remains unverified in this demo. Past
              bookings retain their original price snapshots.
            </p>
            <div className="admin-editor">
              {state.services.map((s) => (
                <ServiceEditor
                  key={`${s.id}-${s.price}-${s.duration}-${s.active}-${s.name}`}
                  service={s}
                  onSave={(service) => {
                    gateway.updateService(service);
                    setMessage(`${service.name} updated in this browser.`);
                  }}
                />
              ))}
            </div>
          </>
        )}
        {tab === 'Business hours' && (
          <HoursEditor
            key={JSON.stringify(state.hours)}
            hours={state.hours}
            onSave={(hours) =>
              report(
                gateway.updateHours(hours),
                'Illustrative business hours updated. Availability now uses this schedule.',
              )
            }
          />
        )}
        {tab === 'Enquiries' && (
          <>
            <h2 className="admin-subheading">A conversation starts here</h2>
            {state.enquiries.length ? (
              state.enquiries.map((e) => (
                <div className="enquiry-card" key={e.id}>
                  <span className="eyebrow">
                    {e.kind === 'bridal' ? 'BRIDAL — CONSULTATION REQUIRED' : 'CONTACT ENQUIRY'}
                  </span>
                  <h3>{e.name}</h3>
                  <p>Sample contact: {e.phone}</p>
                  {e.date && (
                    <p>
                      {dateLabel(e.date)} · {e.event} · {e.people} person(s) · {e.location}
                    </p>
                  )}
                  <p>{e.note || 'No additional notes.'}</p>
                  <span className="caption muted">Local demo only. No messages sent.</span>
                </div>
              ))
            ) : (
              <EmptyState
                title="No local enquiries yet"
                description="Try the bridal or contact form with sample details to see the enquiry here."
              />
            )}
          </>
        )}
        {tab === 'Simulator' && (
          <div className="admin-editor">
            <h2 className="admin-subheading">See the scheduling rules in action.</h2>
            <p className="notice">
              These controls demonstrate browser-local behavior only. They do not prove cross-device
              concurrency or create real reservations. Default mock hold: {state.hours.holdMinutes}{' '}
              minutes.
            </p>
            <div className="feature-cards">
              <div className="feature-card">
                <span>SCENARIO A</span>
                <h3>A competing request</h3>
                <p>
                  Attempt the same occupied time as a pending or confirmed demo request. A complete
                  duration overlap is treated as a conflict.
                </p>
                <button
                  className="button outline small"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    const b = state.bookings.find(
                      (b) => b.holdState === 'held' || b.status === 'confirmed',
                    );
                    setMessage(b ? gateway.simulateConflict(b.id) : 'Create a demo request first.');
                  }}
                >
                  Simulate a conflict
                </button>
              </div>
              <div className="feature-card">
                <span>SCENARIO B</span>
                <h3>A hold expires</h3>
                <p>
                  Expire one pending hold. It releases the time without cancelling the request. A
                  confirmed appointment stays allocated.
                </p>
                <button
                  className="button outline small"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    const b = state.bookings.find((b) => b.holdState === 'held');
                    if (b) {
                      gateway.expireNow(b.id);
                      setMessage('Mock hold expired. The calendar and availability have updated.');
                    } else
                      setMessage('There are no active mock holds. Create a new request first.');
                  }}
                >
                  Expire a mock hold
                </button>
              </div>
              <div className="feature-card">
                <span>SCENARIOS C & D</span>
                <h3>The owner decides</h3>
                <p>
                  Approve a request to allocate the time. Decline it to release the hold. Check the
                  customer status link afterwards.
                </p>
                <button
                  className="button outline small"
                  style={{ marginTop: 20 }}
                  onClick={() => setTab('Requests')}
                >
                  Open the inbox <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
            <h3>Current mock allocations</h3>
            {state.bookings.map((b) => (
              <div key={b.id} className="summary-item">
                <div>
                  {b.name}
                  <small>
                    {dateLabel(b.date)} · {timeLabel(b.time)} · {b.duration} min
                  </small>
                </div>
                <span>{b.holdState}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="stat">
      <small>{title}</small>
      <strong>{value.toString().padStart(2, '0')}</strong>
    </div>
  );
}
function RequestDetail({
  booking: b,
  report,
}: {
  booking: Booking;
  report: (r: Result<unknown>, success: string) => void;
}) {
  const { gateway } = useDemo();
  const [date, setDate] = useState(addDays(b.date, 1));
  const [time, setTime] = useState('16:00');
  const [proposing, setProposing] = useState(false);
  return (
    <div className="request-detail">
      <span className="eyebrow">{b.reference}</span>
      <h2>{b.name}</h2>
      <StatusBadge status={b.status} />
      <div className="request-meta">
        <div>
          <small>Requested time</small>
          {dateLabel(b.date)}
          <br />
          {timeLabel(b.time)}
        </div>
        <div>
          <small>Duration & estimate</small>
          {b.duration} min
          <br />
          {money(b.total)}
        </div>
        <div>
          <small>Sample contact</small>
          {b.phone}
        </div>
        <div>
          <small>Mock hold</small>
          {b.holdState}
        </div>
      </div>
      <div className="notice">
        {b.items.map((i) => (
          <div key={i.serviceId}>
            {i.name}
            {i.variant && ` · ${i.variant}`} · {money(i.price)}
            {i.addons?.length ? (
              <small className="muted caption" style={{ display: 'block' }}>
                + {i.addons.join(', ')}
              </small>
            ) : null}
          </div>
        ))}
      </div>
      {b.note && <p className="caption">Note: {b.note}</p>}
      {b.status === 'pending_approval' && (
        <div className="success-actions">
          <button
            className="button small"
            onClick={() =>
              report(gateway.approveRequest(b.id), 'Approved in the demo. No notification sent.')
            }
          >
            <Check size={14} />
            Approve
          </button>
          <button
            className="button outline small"
            onClick={() => report(gateway.declineRequest(b.id), 'Declined. Mock hold released.')}
          >
            Decline
          </button>
        </div>
      )}
      {['pending_approval', 'confirmed', 'reschedule_proposed'].includes(b.status) && (
        <>
          <div className="success-actions">
            <button className="text-link" onClick={() => setProposing(!proposing)}>
              <CalendarDays size={14} />
              Propose a new time
            </button>
            <button
              className="text-link"
              onClick={() =>
                report(
                  gateway.cancelRequest(b.token),
                  'Demo request cancelled and allocation released.',
                )
              }
            >
              Cancel request
            </button>
          </div>
          {proposing && (
            <div className="selected-options">
              <label className="field">
                Proposed date
                <input
                  type="date"
                  value={date}
                  min={localDate()}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label className="field">
                Proposed time
                <input
                  type="time"
                  step="1800"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
              <button
                className="button small"
                onClick={() =>
                  report(
                    gateway.proposeAlternativeTime(b.id, date, time),
                    'Alternative time proposed. Awaiting customer response; not confirmed.',
                  )
                }
              >
                Save proposal
              </button>
            </div>
          )}
        </>
      )}
      {b.status === 'reschedule_proposed' && b.proposedDate && b.proposedTime && (
        <p className="notice">
          Proposed: {dateLabel(b.proposedDate)}, {timeLabel(b.proposedTime)}. No time is held.
        </p>
      )}
      {b.status === 'confirmed' && (
        <div className="success-actions">
          <button
            className="button outline small"
            onClick={() =>
              report(gateway.markOutcome(b.id, 'completed'), 'Demo appointment marked completed.')
            }
          >
            Mark completed
          </button>
          <button
            className="button outline small"
            onClick={() =>
              report(gateway.markOutcome(b.id, 'no_show'), 'Demo appointment marked no-show.')
            }
          >
            Mark no-show
          </button>
        </div>
      )}
      <Link href={`/booking/${b.token}`} className="text-link" style={{ marginTop: 15 }}>
        View customer demo status <ArrowUpRight size={15} />
      </Link>
      <details className="history">
        <summary>Request history</summary>
        {b.history.map((h, i) => (
          <p key={i}>{h.message}</p>
        ))}
      </details>
      <p className="caption muted">
        Public demo controls. No authentication, live customer data, calls or message delivery.
      </p>
    </div>
  );
}
function ServiceEditor({ service: s, onSave }: { service: Service; onSave: (s: Service) => void }) {
  const [draft, setDraft] = useState(s);
  const [error, setError] = useState('');
  return (
    <div>
      <div className="editor-row">
        <div>
          <h3>{s.name}</h3>
          <span className="caption muted">{s.subcategory}</span>
        </div>
        <label className="field">
          Demo price ₹
          <input
            type="number"
            min="0"
            step="1"
            value={draft.price === null ? '' : draft.price / 100}
            disabled={draft.price === null}
            aria-label={`Price for ${s.name}`}
            placeholder="Consultation"
            onChange={(e) =>
              setDraft({ ...draft, price: Math.round(Number(e.target.value) * 100) })
            }
          />
        </label>
        <label className="field">
          Minutes
          <input
            type="number"
            min="5"
            max="480"
            step="5"
            value={draft.duration}
            aria-label={`Duration for ${s.name}`}
            onChange={(e) => setDraft({ ...draft, duration: Number(e.target.value) })}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
            aria-label={`${s.name} visible`}
          />
          Visible
        </label>
        <button
          className="button outline small"
          onClick={() => {
            if (
              !draft.name.trim() ||
              draft.duration < 5 ||
              draft.duration > 480 ||
              (draft.price !== null &&
                (!Number.isSafeInteger(draft.price) ||
                  draft.price < 100 ||
                  draft.price > 10000000)) ||
              draft.variants?.some((v) => v.price < 100 || v.duration < 5)
            ) {
              setError('Use a name, a positive price and duration from 5–480 minutes.');
              return;
            }
            setError('');
            onSave(draft);
          }}
        >
          Save
        </button>
      </div>
      <details className="history">
        <summary>
          Edit {s.name} details{draft.variants ? ' & options' : ''}
        </summary>
        <label className="field">
          Service name
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </label>
        <label className="field">
          Short description
          <textarea
            value={draft.description}
            maxLength={400}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </label>
        <label className="field">
          Demonstration image
          <select
            value={draft.image}
            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
          >
            {['hair', 'hero', 'bridal', 'facial', 'nails', 'salon', 'styling'].map((i) => (
              <option key={i} value={`/images/${i}.jpg`}>
                {i}
              </option>
            ))}
          </select>
        </label>
        {draft.variants?.map((v, index) => (
          <div className="form-grid" key={v.id}>
            <label className="field">
              {v.name} price ₹
              <input
                type="number"
                min="1"
                value={v.price / 100}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    variants: draft.variants?.map((x, i) =>
                      i === index ? { ...x, price: Math.round(Number(e.target.value) * 100) } : x,
                    ),
                    price: index === 0 ? Math.round(Number(e.target.value) * 100) : draft.price,
                  })
                }
              />
            </label>
            <label className="field">
              {v.name} minutes
              <input
                type="number"
                min="5"
                max="480"
                value={v.duration}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    variants: draft.variants?.map((x, i) =>
                      i === index ? { ...x, duration: Number(e.target.value) } : x,
                    ),
                  })
                }
              />
            </label>
          </div>
        ))}
      </details>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function HoursEditor({ hours, onSave }: { hours: Hours; onSave: (h: Hours) => void }) {
  const [h, setH] = useState(hours);
  return (
    <div className="admin-editor hours-form">
      <h2 className="admin-subheading">Make the sample schedule yours.</h2>
      <p className="notice">
        Illustrative only. Changes affect new requests and approval checks. Existing confirmed demo
        appointments are never automatically released.
      </p>
      <div className="form-grid">
        <label className="field">
          Opening hour (24h)
          <input
            type="number"
            min="0"
            max="22"
            value={h.open}
            onChange={(e) => setH({ ...h, open: Number(e.target.value) })}
          />
        </label>
        <label className="field">
          Closing hour (24h)
          <input
            type="number"
            min="1"
            max="23"
            value={h.close}
            onChange={(e) => setH({ ...h, close: Number(e.target.value) })}
          />
        </label>
        <label className="field">
          Weekly closed day
          <select
            value={h.closedDay}
            onChange={(e) => setH({ ...h, closedDay: Number(e.target.value) })}
          >
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
              (d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ),
            )}
          </select>
        </label>
        <label className="field">
          Mock hold duration (minutes)
          <input
            type="number"
            min="1"
            max="60"
            value={h.holdMinutes}
            onChange={(e) => setH({ ...h, holdMinutes: Number(e.target.value) })}
          />
        </label>
      </div>
      <p className="caption muted">
        30-minute intervals · {h.buffer}-minute cleanup · {h.noticeMinutes}-minute minimum notice ·{' '}
        {h.advanceDays}-day booking window · One sample resource
      </p>
      <button className="button" style={{ marginTop: 25 }} onClick={() => onSave(h)}>
        Save illustrative hours <Check size={16} />
      </button>
    </div>
  );
}
