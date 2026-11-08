import { BookingFlow } from '@/components/booking-flow';
export const metadata = { title: 'Request an Appointment' };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return <BookingFlow initialService={service} />;
}
