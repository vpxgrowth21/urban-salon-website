import { Policy } from '@/components/policy';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/privacy',
  title: 'Privacy Notice — Draft | Urban Beauti Salon',
  description:
    'Read how the Urban Beauti Salon website demo stores sample requests in your browser.',
});
export default function Page() {
  return <Policy kind="privacy" />;
}
