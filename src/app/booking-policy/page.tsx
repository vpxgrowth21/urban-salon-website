import { Policy } from '@/components/policy';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/booking-policy',
  title: 'Booking Policy — Draft | Urban Beauti Salon',
  description:
    'Read the draft appointment request, approval and rescheduling policies for the Urban Beauti Salon demo.',
});
export default function Page() {
  return <Policy kind="booking" />;
}
