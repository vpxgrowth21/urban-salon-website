import { Home } from '@/components/home';
import { homeDescription, homeTitle, publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/',
  title: homeTitle,
  socialTitle: 'Urban Beauti Salon — Your Beauty. Your Moment.',
  description: homeDescription,
});
export default function Page() {
  return <Home />;
}
