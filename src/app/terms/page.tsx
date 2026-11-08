import { Policy } from '@/components/policy';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/terms',
  title: 'Terms — Draft | Urban Beauti Salon',
  description:
    'Read the draft terms for exploring sample prices, stock inspiration and appointment requests in the Urban Beauti Salon demo.',
});
export default function Page() {
  return <Policy kind="terms" />;
}
