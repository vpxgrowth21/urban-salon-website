'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock3, Search, ShieldCheck, Wallet } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDemo } from './demo-provider';
import { DemoPriceNotice, EmptyState, ServiceRow } from './ui';
import { customerSchema, selectionItems } from '@/lib/booking';
import { addDays, dateLabel, instant, localDate, money, timeLabel } from '@/lib/format';
import { messages } from '@/lib/i18n';
import type { Selection } from '@/lib/types';
export function BookingFlow({ initialService }: { initialService?: string }) {
  const { state, gateway } = useDemo();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<Selection[]>(() =>
    initialService &&
    state.services.some((s) => s.id === initialService && s.active && s.price !== null)
      ? [{ serviceId: initialService }]
      : [],
  );
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [idempotency] = useState(() => crypto.randomUUID());
  const panel = useRef<HTMLDivElement>(null);
  const today = localDate();
  const result = selectionItems(selections, state.services);
  const items = result.ok ? result.value : [];
  const total = items.reduce((n, i) => n + i.price, 0),
    duration = items.reduce((n, i) => n + i.duration, 0);
  const slots = date ? gateway.getAvailability(selections, date) : [];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof customerSchema>, unknown, z.output<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', phone: '', note: '', policy: false },
  });
  const navigate = (s: number) => {
    setStep(s);
    setError('');
    panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const changeSelection = (next: Selection[]) => {
    setSelections(next);
    setTime('');
  };
  const toggle = (id: string) => {
    changeSelection(
      selections.some((s) => s.serviceId === id)
        ? selections.filter((s) => s.serviceId !== id)
        : [...selections, { serviceId: id }],
    );
  };
  const submit = handleSubmit(async (data) => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    const r = await gateway.submitAppointmentRequest({
      ...data,
      selections,
      date,
      time,
      idempotencyKey: idempotency,
    });
    if (r.ok) {
      router.push(`/booking/${r.value.token}?received=1`);
    } else {
      setError(r.error);
      setSubmitting(false);
      if (/time|conflict|closed|soon|hours/.test(r.error)) {
        setTime('');
        setStep(2);
      }
    }
  });
  return (
    <div className="booking-wrap">
      <div className="booking-heading">
        <span className="eyebrow">Appointment request · Demo</span>
        <h1>Request an Appointment</h1>
        <p>Three simple steps. No account. No advance payment.</p>
      </div>
      <div className="steps" aria-label="Booking progress">
        {[messages.en.chooseService, messages.en.chooseTime, messages.en.details].map(
          (label, i) => (
            <button
              key={label}
              onClick={() => navigate(i + 1)}
              disabled={i + 1 > step}
              className={step === i + 1 ? 'active' : ''}
              aria-current={step === i + 1 ? 'step' : undefined}
            >
              <span>{step > i + 1 ? <Check size={12} /> : i + 1}</span>
              {label}
            </button>
          ),
        )}
      </div>
      <div className={`booking-layout step-${step}`}>
        <div ref={panel} className="booking-panel" tabIndex={-1}>
          {step === 1 && (
            <>
              <h2>Choose your services</h2>
              <p>Pick one service or a few. Add options only where you need them.</p>
              <div className="search-box">
                <Search size={17} />
                <input
                  aria-label="Search booking services"
                  placeholder="Try hair spa, facial, haircut…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="booking-picker">
                {state.services
                  .filter(
                    (s) =>
                      s.active &&
                      s.price !== null &&
                      `${s.name} ${s.subcategory}`.toLowerCase().includes(search.toLowerCase()),
                  )
                  .sort(
                    (a, b) =>
                      Number(selections.some((x) => x.serviceId === b.id)) -
                      Number(selections.some((x) => x.serviceId === a.id)),
                  )
                  .map((s) => {
                    const selected = selections.find((x) => x.serviceId === s.id);
                    return (
                      <div key={s.id}>
                        <ServiceRow
                          service={s}
                          selected={!!selected}
                          onSelect={() => toggle(s.id)}
                        />
                        {selected && s.variants && (
                          <div className="selected-options">
                            <strong>{s.name} — choose hair length</strong>
                            <div className="option-buttons">
                              {s.variants.map((v) => (
                                <button
                                  key={v.id}
                                  className={selected.variantId === v.id ? 'active' : ''}
                                  aria-pressed={selected.variantId === v.id}
                                  onClick={() =>
                                    changeSelection(
                                      selections.map((x) =>
                                        x.serviceId === s.id ? { ...x, variantId: v.id } : x,
                                      ),
                                    )
                                  }
                                >
                                  {v.name}
                                  <br />
                                  {money(v.price)} · {v.duration}m
                                </button>
                              ))}
                            </div>
                            {s.addons?.map((a) => (
                              <label className="checkbox" key={a.id}>
                                <input
                                  type="checkbox"
                                  checked={selected.addonIds?.includes(a.id) || false}
                                  onChange={(e) =>
                                    changeSelection(
                                      selections.map((x) =>
                                        x.serviceId === s.id
                                          ? {
                                              ...x,
                                              addonIds: e.target.checked
                                                ? [...(x.addonIds || []), a.id]
                                                : (x.addonIds || []).filter((id) => id !== a.id),
                                            }
                                          : x,
                                      ),
                                    )
                                  }
                                />
                                {a.name} + {money(a.price)} · {a.duration} min
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="notice">
                Bridal or a quote-based treatment?{' '}
                <Link className="underline" href="/bridal#enquire">
                  Request a consultation
                </Link>
                .
              </div>
              {!result.ok && selections.length > 0 && (
                <p className="field-error" role="alert">
                  {result.error}
                </p>
              )}
              <div className="booking-nav">
                <span className="muted caption">{selections.length} selected</span>
                <button className="button" disabled={!result.ok} onClick={() => navigate(2)}>
                  Choose date & time <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Choose your preferred date & time</h2>
              <p>
                {duration} min of care + {state.hours.buffer} min cleanup. Times are in
                Asia/Kolkata.
              </p>
              <div className="notice">
                Illustrative hours: {timeLabel(`${String(state.hours.open).padStart(2, '0')}:00`)}–
                {timeLabel(`${String(state.hours.close).padStart(2, '0')}:00`)}.{' '}
                {
                  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
                    state.hours.closedDay
                  ]
                }{' '}
                closed. These are requestable times, subject to approval.
              </div>
              <div className="dates" aria-label="Choose appointment date">
                {Array.from({ length: 14 }, (_, i) => addDays(today, i)).map((d, i) => {
                  const closed = new Date(instant(d)).getUTCDay() === state.hours.closedDay;
                  return (
                    <button
                      key={d}
                      className={`date-chip ${date === d ? 'active' : ''}`}
                      disabled={closed}
                      aria-label={`${dateLabel(d)}${closed ? ' — closed' : ''}`}
                      aria-pressed={date === d}
                      onClick={() => {
                        setDate(d);
                        setTime('');
                      }}
                    >
                      <span>
                        {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dateLabel(d).split(',')[0]}
                      </span>
                      <strong>{d.slice(-2)}</strong>
                      <span>
                        {closed
                          ? 'Closed'
                          : new Intl.DateTimeFormat('en-IN', {
                              month: 'short',
                              timeZone: 'Asia/Kolkata',
                            }).format(new Date(instant(d)))}
                      </span>
                    </button>
                  );
                })}
              </div>
              <label className="field date-input">
                Or choose another date
                <input
                  type="date"
                  value={date}
                  min={today}
                  max={addDays(today, state.hours.advanceDays)}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime('');
                  }}
                />
              </label>
              {date && (
                <>
                  <h3>{dateLabel(date)}</h3>
                  {slots.some((s) => s.state === 'requestable') ? (
                    <div className="slot-grid">
                      {slots.map((s) => (
                        <button
                          className={`slot ${s.time === time ? 'selected' : ''}`}
                          key={s.time}
                          disabled={s.state !== 'requestable'}
                          title={s.reason}
                          aria-label={`${s.label} — ${s.time === time ? 'selected' : s.state}`}
                          aria-pressed={s.time === time}
                          onClick={() => {
                            setTime(s.time);
                            setError('');
                          }}
                        >
                          <span>{s.label}</span>
                          <small>
                            {s.time === time
                              ? 'Selected'
                              : s.state === 'requestable'
                                ? 'Requestable'
                                : s.state === 'held'
                                  ? 'Demo hold'
                                  : s.state === 'confirmed'
                                    ? 'Confirmed demo'
                                    : 'Unavailable'}
                          </small>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No time options on this date"
                      description="Try another day. The full service duration must fit within the illustrative schedule."
                    />
                  )}
                  <div className="slot-legend">
                    <span>Selected ≠ reserved</span>
                    <span>Demo holds expire automatically</span>
                    <span>Owner approval required</span>
                  </div>
                </>
              )}
              {error && (
                <div className="notice error" role="alert">
                  {error}
                </div>
              )}
              <div className="booking-nav">
                <button className="text-link" onClick={() => navigate(1)}>
                  <ArrowLeft size={14} />
                  Services
                </button>
                <button
                  className="button"
                  disabled={
                    !time || !slots.find((s) => s.time === time && s.state === 'requestable')
                  }
                  onClick={() => navigate(3)}
                >
                  Your details <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>Your details</h2>
              <p>Use sample details to try the experience. Nothing is sent to the salon.</p>
              <form onSubmit={submit} noValidate>
                <label className="field">
                  Full name
                  <input
                    {...register('name')}
                    autoComplete="name"
                    placeholder="e.g. Demo Guest"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <span id="name-error" className="field-error" role="alert">
                      {errors.name.message}
                    </span>
                  )}
                </label>
                <label className="field">
                  Mobile number
                  <input
                    {...register('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="10-digit Indian mobile number"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <span id="phone-error" className="field-error" role="alert">
                      {errors.phone.message}
                    </span>
                  )}
                  <small>Demo only. No call, WhatsApp or OTP will be sent.</small>
                </label>
                <label className="field">
                  Additional notes <small>Optional</small>
                  <textarea
                    {...register('note')}
                    maxLength={500}
                    placeholder="Preferences or a note for the salon"
                  />
                  {errors.note && <span className="field-error">{errors.note.message}</span>}
                </label>
                <label className="checkbox">
                  <input type="checkbox" {...register('policy')} />{' '}
                  <span>
                    I understand this is a demo request, requires owner approval, and follows the{' '}
                    <Link className="underline" href="/booking-policy" target="_blank">
                      booking policy
                    </Link>
                    . Please use sample information only.
                  </span>
                </label>
                {errors.policy && (
                  <p className="field-error" role="alert">
                    {errors.policy.message}
                  </p>
                )}
                <div className="notice">
                  <strong>Your appointment is not confirmed yet.</strong>
                  <br />
                  This is a local demo. A real appointment will need salon review once the website
                  launches.
                </div>
                {error && (
                  <div className="notice error" role="alert">
                    {error}
                  </div>
                )}
                <button className="button full-width" type="submit" disabled={submitting}>
                  {submitting
                    ? 'Creating demo request…'
                    : 'Request Appointment — No Advance Payment'}
                  <ArrowUpRightIcon />
                </button>
                <div className="booking-nav">
                  <button className="text-link" type="button" onClick={() => navigate(2)}>
                    <ArrowLeft size={14} />
                    Edit date & time
                  </button>
                  <span className="caption muted">No payment needed</span>
                </div>
              </form>
            </>
          )}
        </div>
        <aside className="booking-summary" aria-label="Your request summary">
          <span className="eyebrow">Your request summary</span>
          {selections.length === 0 ? (
            <p>Choose a service to start your request.</p>
          ) : (
            selections.map((s) => {
              const service = state.services.find((x) => x.id === s.serviceId);
              const item = items.find((x) => x.serviceId === s.serviceId);
              return (
                <div key={s.serviceId} className="summary-item">
                  <div>
                    {service?.name || 'Unavailable service'}
                    <small>
                      {item?.variant || (service?.variants ? 'Choose an option' : '')}
                      {item?.addons?.length ? ` + ${item.addons.join(', ')}` : ''}
                      {item ? ` · ${item.duration} min` : ''}
                    </small>
                  </div>
                  <div>
                    <span>{item ? money(item.price) : 'Select option'}</span>
                    <br />
                    <button
                      className="caption underline"
                      aria-label={`Remove ${service?.name || 'service'}`}
                      onClick={() => {
                        changeSelection(selections.filter((x) => x.serviceId !== s.serviceId));
                        navigate(1);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
          {items.length > 0 && (
            <div className="summary-total">
              <span>
                Estimated demo total
                <br />
                <small>{duration} min</small>
              </span>
              <strong>{money(total)}</strong>
            </div>
          )}
          {date && (
            <div className="summary-item">
              <div>
                {dateLabel(date)}
                <small>{time ? timeLabel(time) : 'Choose a preferred time'} · Asia/Kolkata</small>
              </div>
              <button className="caption underline" onClick={() => navigate(2)}>
                Edit
              </button>
            </div>
          )}
          <DemoPriceNotice />
          <div className="summary-reassurance">
            <span>
              <Wallet size={14} />
              Pay at the salon
            </span>
            <span>
              <ShieldCheck size={14} />
              Owner approval required
            </span>
            <span>
              <Clock3 size={14} />
              No real reservation created
            </span>
          </div>
          <p>Demo only — held times coordinate only within this browser, never across devices.</p>
        </aside>
      </div>
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={16} />;
}
