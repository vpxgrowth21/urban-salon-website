import { BookingFlow } from '@/components/booking-flow';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/book',
  title: 'Appointment Request | Urban Beauti Salon',
  description:
    'Try a sample appointment request for Urban Beauti Salon by choosing a beauty service and preferred time.',
});
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return <BookingFlow initialService={service} />;
}
