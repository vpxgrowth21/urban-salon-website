import { PageIntro } from '@/components/ui';
import { Gallery } from '@/components/gallery';
export const metadata = { title: 'Beauty Inspiration Gallery' };
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Beauty inspiration"
        title={<>Our Beauty Gallery</>}
        description="Explore stock beauty inspiration for this demonstration. These images are not Urban Beauti’s client work."
      />
      <Gallery />
    </>
  );
}
