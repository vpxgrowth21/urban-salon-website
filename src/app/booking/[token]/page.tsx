import { BookingStatus } from '@/components/booking-status';
export const metadata = { title: 'Your Demo Request Status' };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ received?: string }>;
}) {
  const [{ token }, { received }] = await Promise.all([params, searchParams]);
  return <BookingStatus token={token} received={received === '1'} />;
}
