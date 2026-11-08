import { PageIntro } from '@/components/ui';
import { Gallery } from '@/components/gallery';
import { publicPageMetadata } from '@/lib/site-metadata';
export const metadata = publicPageMetadata({
  path: '/gallery',
  title: 'Beauty Gallery | Urban Beauti Salon',
  description:
    'Browse beauty inspiration for bridal makeup, hair, nails and beauty treatments at Urban Beauti Salon.',
});
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Beauty inspiration"
        title={<>Our Beauty Gallery</>}
        description="Explore beauty inspiration for this demonstration. These images are not Urban Beauti’s client work."
      />
      <Gallery />
    </>
  );
}
