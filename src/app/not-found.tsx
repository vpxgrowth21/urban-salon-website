import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="not-found">
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>
        Let’s find your
        <br />
        <em>way back.</em>
      </h1>
      <p>We couldn’t find that page. Your next beauty ritual is just a click away.</p>
      <Link className="button" href="/services">
        Explore services
      </Link>
    </div>
  );
}
