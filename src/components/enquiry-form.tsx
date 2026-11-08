'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useDemo } from './demo-provider';
import { localDate } from '@/lib/format';
interface Fields {
  name: string;
  phone: string;
  note: string;
  date: string;
  event: string;
  people: number;
  location: string;
  consent: boolean;
}
export function EnquiryForm({ kind }: { kind: 'bridal' | 'contact' }) {
  const { gateway } = useDemo();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({
    defaultValues: { people: 1, event: 'Bridal consultation', location: 'At the salon' },
  });
  const submit = handleSubmit((data) => {
    setError('');
    if (kind === 'bridal' && data.date < localDate()) {
      setError('Choose today or a future event date.');
      return;
    }
    const r = gateway.addEnquiry({
      kind,
      name: data.name,
      phone: data.phone,
      note: data.note,
      date: data.date,
      event: data.event,
      people: data.people,
      location: data.location,
    });
    if (r.ok) setSent(true);
    else setError(r.error);
  });
  if (sent)
    return (
      <div className="form-card">
        <div className="success-icon">
          <Check />
        </div>
        <h3>Demo enquiry received.</h3>
        <p className="notice success">
          Saved in this browser’s owner demo. Nothing has been sent to Urban Beauti Salon.
        </p>
        <Link href="/demo/admin" className="text-link">
          View the owner demo <ArrowUpRight size={16} />
        </Link>
        <button className="button outline" onClick={() => setSent(false)}>
          Try another enquiry
        </button>
      </div>
    );
  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="notice">Frontend demo — please use sample details. No messages are sent.</div>
      <label className="field">
        Full name
        <input
          {...register('name', {
            required: 'Please enter your full name.',
            minLength: { value: 2, message: 'Use at least 2 characters.' },
            maxLength: 80,
          })}
          autoComplete="name"
          placeholder="Demo Guest"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <span className="field-error" role="alert">
            {errors.name.message}
          </span>
        )}
      </label>
      <label className="field">
        Mobile number
        <input
          {...register('phone', {
            required: 'Please enter a mobile number.',
            validate: (v) =>
              /^(?:\+91[ -]?)?[6-9]\d{9}$/.test(v.replace(/[\s()-]/g, '')) ||
              'Enter a valid 10-digit Indian mobile number.',
          })}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="10-digit mobile number"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <span className="field-error" role="alert">
            {errors.phone.message}
          </span>
        )}
      </label>
      {kind === 'bridal' && (
        <>
          <div className="form-grid">
            <label className="field">
              Event date
              <input
                {...register('date', { required: 'Choose your event date.' })}
                type="date"
                min={localDate()}
              />
              {errors.date && <span className="field-error">{errors.date.message}</span>}
            </label>
            <label className="field">
              Event type
              <select {...register('event')}>
                <option>Bridal consultation</option>
                <option>Wedding</option>
                <option>Engagement</option>
                <option>Reception</option>
                <option>Other occasion</option>
              </select>
            </label>
          </div>
          <div className="form-grid">
            <label className="field">
              Number of people
              <input
                {...register('people', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'At least one person.' },
                  max: { value: 20, message: 'For more than 20 people, add a note.' },
                })}
                type="number"
                min="1"
                max="20"
              />
              {errors.people && <span className="field-error">{errors.people.message}</span>}
            </label>
            <label className="field">
              Location preference
              <select {...register('location')}>
                <option>At the salon</option>
                <option>At the venue — enquire</option>
                <option>Let’s discuss</option>
              </select>
            </label>
          </div>
        </>
      )}
      <label className="field">
        {kind === 'bridal' ? 'Tell us about your look' : 'Your message'}{' '}
        <small>{kind === 'bridal' ? 'Optional' : ''}</small>
        <textarea
          {...register('note', {
            required: kind === 'contact' ? 'Please add a message.' : false,
            maxLength: 500,
          })}
          placeholder={
            kind === 'bridal'
              ? 'Your event, inspiration or questions…'
              : 'What would you like to know?'
          }
          maxLength={500}
        />
        {errors.note && <span className="field-error">{errors.note.message}</span>}
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          {...register('consent', { required: 'Please acknowledge the demo privacy notice.' })}
        />
        <span>
          I understand my sample information is stored in this browser for the demo.{' '}
          <Link href="/privacy" className="underline">
            Privacy notice
          </Link>
        </span>
      </label>
      {errors.consent && (
        <p className="field-error" role="alert">
          {errors.consent.message}
        </p>
      )}
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <button className="button" type="submit">
        {kind === 'bridal' ? 'Request a Bridal Consultation' : 'Send a Demo Enquiry'}
        <ArrowUpRight size={17} />
      </button>
      <p className="form-disclaimer">
        {kind === 'bridal'
          ? 'Enquiry / Consultation Required. Final availability, pricing and location will need salon approval. '
          : ' '}
        Demo only — this enquiry stays in your browser and is not sent to the salon.
      </p>
    </form>
  );
}
