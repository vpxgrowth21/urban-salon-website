'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Clock3, ArrowUpRight, Copy } from 'lucide-react';
import { useDemo } from './demo-provider';
import { dateLabel, money, timeLabel } from '@/lib/format';
import { StatusBadge } from './ui';
export function BookingStatus({ token, received }: { token: string; received: boolean }) {
  const { gateway, state, ready } = useDemo();
  const [now, setNow] = useState(() => Date.now());
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [cancelPrompt, setCancelPrompt] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!ready)
    return (
      <div className="loading" role="status">
        Loading your local demo request…
      </div>
    );
  const b = state.bookings.find((b) => b.token === token);
  if (!b)
    return (
      <section className="success-wrap">
        <div className="success-card">
          <h1>
            Request not found
            <br />
            <em>in this browser.</em>
          </h1>
          <p>
            Demo status links work only with this browser’s local data. Your demo may have been
            reset, or this link belongs to a different browser.
          </p>
          <Link href="/book" className="button" style={{ marginTop: 25 }}>
            Try a demo request
          </Link>
        </div>
      </section>
    );
  const hold = Math.max(0, Math.ceil((b.holdExpiresAt - now) / 1000));
  return (
    <section className="success-wrap">
      <div className="success-card">
        <div className="success-icon">{b.status === 'confirmed' ? <Check /> : <Clock3 />}</div>
        <StatusBadge status={b.status} />
        <h1>{received ? 'Appointment Request Received!' : <>Your Appointment Request</>}</h1>
        <p>
          {b.status === 'pending_approval'
            ? 'Your preferred appointment has been requested in the demo and is awaiting simulated owner approval.'
            : b.status === 'confirmed'
              ? 'The owner approved this simulated appointment. This is still a demonstration, not a real reservation.'
              : 'View the latest status of your demonstration request.'}
        </p>
        <div className="notice">
          <strong>Demo only — this request has not been sent to the salon.</strong>
          <br />
          No real appointment, notification or payment has been created.
        </div>
        <div className="request-meta">
          <div>
            <small>Request reference</small>
            {b.reference}
          </div>
          <div>
            <small>Preferred date & time</small>
            {dateLabel(b.date)}
            <br />
            {timeLabel(b.time)} · Asia/Kolkata
          </div>
          <div>
            <small>Selected services</small>
            {b.items.map((i, index) => (
              <div key={index}>
                {i.name}
                {i.variant && ` · ${i.variant}`}
                {i.addons?.length ? (
                  <small className="muted caption" style={{ display: 'block' }}>
                    + {i.addons.join(', ')}
                  </small>
                ) : null}
              </div>
            ))}
          </div>
          <div>
            <small>Estimated demo price</small>
            {money(b.total)} · {b.duration} min
            <br />
            <span className="caption muted">Payment: At the Salon</span>
          </div>
        </div>
        {b.holdState === 'held' && hold > 0 ? (
          <div className="hold-note">
            Simulated temporary hold: {Math.floor(hold / 60)}:{String(hold % 60).padStart(2, '0')}{' '}
            remaining. This browser only. A hold is not confirmation.
          </div>
        ) : b.holdState === 'expired' ? (
          <div className="hold-note">
            Demo hold expired. The time is requestable again; owner approval requires a fresh
            availability check.
          </div>
        ) : b.holdState === 'allocated' ? (
          <div className="hold-note">
            Confirmed in the demo calendar. A temporary-hold timer will not release this allocation.
          </div>
        ) : (
          <div className="hold-note">Demo hold released. No exclusive reservation remains.</div>
        )}
        {b.status === 'reschedule_proposed' && b.proposedDate && b.proposedTime && (
          <div className="notice">
            <strong>New time proposed:</strong>
            <br />
            {dateLabel(b.proposedDate)}, {timeLabel(b.proposedTime)}
            <p className="caption">No time is held. Availability is rechecked when accepted.</p>
            <div className="success-actions">
              <button
                className="button small"
                onClick={() => {
                  const r = gateway.acceptProposal(token);
                  setMessage(r.ok ? 'Proposed time accepted in the demo.' : r.error);
                }}
              >
                Accept proposed time
              </button>
              <button
                className="button outline small"
                onClick={() => {
                  const r = gateway.cancelRequest(token);
                  setMessage(r.ok ? 'Proposal declined and demo request cancelled.' : r.error);
                }}
              >
                Decline & cancel
              </button>
            </div>
          </div>
        )}
        <div className="success-actions">
          <button
            className="button outline small"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`${window.location.origin}/booking/${token}`);
                setCopied(true);
              } catch {
                setMessage('Copy the status link from the address bar.');
              }
            }}
          >
            <Copy size={14} />
            {copied ? 'Status link copied' : 'Copy status link'}
          </button>
          {['pending_approval', 'confirmed', 'reschedule_proposed'].includes(b.status) && (
            <button className="text-link" onClick={() => setCancelPrompt(true)}>
              Cancel demo request
            </button>
          )}
        </div>
        {cancelPrompt && (
          <div className="notice">
            Cancel this demonstration request and release its time?
            <div className="success-actions">
              <button
                className="button small"
                onClick={() => {
                  const r = gateway.cancelRequest(token);
                  setMessage(r.ok ? 'Demo request cancelled.' : r.error);
                  setCancelPrompt(false);
                }}
              >
                Yes, cancel request
              </button>
              <button className="button outline small" onClick={() => setCancelPrompt(false)}>
                Keep request
              </button>
            </div>
          </div>
        )}
        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}
        <details className="history">
          <summary>Demo status history</summary>
          {b.history.map((h, i) => (
            <p key={i}>{h.message}</p>
          ))}
        </details>
        <Link className="text-link" href={`/book?service=${b.items[0]?.serviceId}`}>
          Request these services again <ArrowUpRight size={15} />
        </Link>
        <p className="caption muted" style={{ marginTop: 20 }}>
          Please let the salon know if plans change when real bookings become available. This status
          link contains no customer details and is only usable with this browser’s demo data.
        </p>
      </div>
    </section>
  );
}
