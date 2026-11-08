import type { CategoryId, Service, Variant } from '../types';
export const business = {
  name: 'Urban Beauti Salon',
  city: 'Gandhinagar, Gujarat',
  timezone: 'Asia/Kolkata',
  demo: true,
  phone: null,
  whatsapp: null,
  address: null,
  instagram: null,
} as const;
export const hairPortrait = {
  image: '/images/hair-campaign.jpg',
  alt: 'AI-generated portrait of a woman with layered chestnut hair and honey highlights',
  position: '50% 0%',
};

export type DemoImage = { image: string; alt?: string; position?: string };

export const categories: { id: CategoryId; name: string; subtitle: string; image: string }[] = [
  { id: 'hair', name: 'Hair', subtitle: 'Cut, colour & care', image: hairPortrait.image },
  { id: 'facials', name: 'Facials', subtitle: 'Your time to glow', image: '/images/facial.jpg' },
  { id: 'threading', name: 'Threading', subtitle: 'The finer details', image: '/images/hero.jpg' },
  { id: 'waxing', name: 'Waxing', subtitle: 'Smooth & simple', image: '/images/facial.jpg' },
  {
    id: 'makeup',
    name: 'Makeup',
    subtitle: 'A look for every occasion',
    image: '/images/hero.jpg',
  },
  {
    id: 'bridal',
    name: 'Bridal',
    subtitle: 'Beautifully, unmistakably you',
    image: '/images/bridal.jpg',
  },
  {
    id: 'nails',
    name: 'Nails & Care',
    subtitle: 'Perfect finishing touches',
    image: '/images/nails.jpg',
  },
  {
    id: 'packages',
    name: 'Packages',
    subtitle: 'A little more self-care',
    image: '/images/salon.jpg',
  },
];
const lengths: Variant[] = [
  { id: 'short', name: 'Short', price: 80000, duration: 45 },
  { id: 'medium', name: 'Medium', price: 100000, duration: 60 },
  { id: 'long', name: 'Long', price: 130000, duration: 75 },
];
type Row = [string, number | null, number, string?];
const groups: { category: CategoryId; subcategory: string; rows: Row[] }[] = [
  {
    category: 'hair',
    subcategory: 'Cutting & styling',
    rows: [
      ['Signature Haircut', 450, 45, 'A fresh shape, finished your way.'],
      ['Layer Haircut', 600, 60],
      ['Step Haircut', 550, 60],
      ['U-cut', 350, 30],
      ['V-cut', 400, 30],
      ['Bob Haircut', 650, 60],
      ['Fringe Trim', 150, 15],
      ['Hair Wash', 200, 20],
      ['Blow-dry', 400, 30],
      ['Iron Straightening', 600, 45],
      ['Soft Curls', 700, 45],
      ['Party Hairstyle', 1200, 60],
      ['Hair Updo', 1500, 60],
      ['Hair Braiding', 500, 30],
    ],
  },
  {
    category: 'hair',
    subcategory: 'Colour',
    rows: [
      ['Root Touch-up', 1000, 75],
      ['Global Hair Colour', 2500, 120],
      ['Highlights', 2000, 120],
      ['Balayage', 4500, 180],
      ['Ombré', 3500, 150],
      ['Hair Streaks', 800, 60],
      ['Hair Toner', 1200, 60],
      ['Colour Consultation', null, 30],
    ],
  },
  {
    category: 'hair',
    subcategory: 'Treatments',
    rows: [
      ['Hair Spa', 800, 45, 'A nourishing pause for your hair.'],
      ['Deep Conditioning', 600, 45],
      ['Keratin Consultation', null, 30],
      ['Smoothening Consultation', null, 30],
      ['Scalp Care', 900, 60],
      ['Bond Repair', 1800, 75],
    ],
  },
  {
    category: 'facials',
    subcategory: 'Skin & facials',
    rows: [
      ['Classic Cleanup', 500, 30],
      ['Fruit Cleanup', 650, 40],
      ['Herbal Facial', 900, 60],
      ['Fruit Facial', 1000, 60],
      ['Gold Facial', 1500, 75],
      ['Pearl Facial', 1400, 60],
      ['Hydrating Facial', 1200, 60, 'A gentle ritual for refreshed-feeling skin.'],
      ['De-tan Facial', 1100, 60],
      ['Brightening Facial', 1500, 75],
      ['Premium Facial', 2200, 90],
      ['Facial Massage', 400, 30],
    ],
  },
  {
    category: 'threading',
    subcategory: 'Threading',
    rows: [
      ['Eyebrow Threading', 60, 15],
      ['Upper Lip Threading', 40, 10],
      ['Lower Lip Threading', 30, 10],
      ['Forehead Threading', 50, 10],
      ['Chin Threading', 40, 10],
      ['Side Locks Threading', 80, 15],
      ['Full Face Threading', 250, 30],
    ],
  },
  {
    category: 'waxing',
    subcategory: 'Waxing',
    rows: [
      ['Underarm Waxing', 150, 15],
      ['Half Arms Waxing', 250, 20],
      ['Full Arms Waxing', 400, 30],
      ['Half Legs Waxing', 350, 30],
      ['Full Legs Waxing', 600, 45],
      ['Full Body Waxing', 1800, 120],
      ['Face Waxing', 300, 30],
      ['Chocolate Wax — Arms', 550, 30],
      ['Premium Wax — Legs', 900, 45],
    ],
  },
  {
    category: 'nails',
    subcategory: 'Hands, feet & nails',
    rows: [
      ['Classic Manicure', 450, 40],
      ['Classic Pedicure', 600, 50],
      ['Spa Manicure', 700, 50],
      ['Spa Pedicure', 900, 60],
      ['Luxury Manicure', 1000, 60],
      ['Luxury Pedicure', 1200, 75],
      ['Polish Change', 200, 20],
      ['Gel Nail Polish', 700, 45],
      ['Gel Extensions', 1800, 90],
      ['Nail Art', 300, 30],
      ['Nail Refill', 1000, 60],
      ['Nail Removal', 400, 30],
    ],
  },
  {
    category: 'makeup',
    subcategory: 'Occasion makeup',
    rows: [
      ['Natural Makeup', 1800, 60],
      ['Party Makeup', 2500, 75],
      ['Engagement Makeup', null, 120],
      ['Reception Makeup', null, 120],
      ['HD Makeup', 3500, 90],
      ['Eye Makeup', 900, 45],
      ['Occasion Hairstyling', 1200, 60],
      ['Saree Draping', 500, 30],
    ],
  },
  {
    category: 'bridal',
    subcategory: 'Bridal consultation',
    rows: [
      ['Bridal Makeup', null, 120],
      ['Bridal Hairstyle', null, 90],
      ['Pre-Bridal Consultation', null, 30],
      ['Bridal Makeup Trial', null, 60],
      ['Wedding Event Beauty', null, 120],
    ],
  },
  {
    category: 'packages',
    subcategory: 'Beauty packages',
    rows: [
      ['Everyday Grooming', 900, 75, 'Cleanup, eyebrow threading and upper lip threading.'],
      ['Hair & Glow Ritual', 1800, 105, 'Short-hair spa and a hydrating facial.'],
      ['Mani-Pedi Moment', 950, 90, 'Classic manicure and classic pedicure.'],
      ['Festive Beauty', 3200, 120, 'Natural makeup, soft curls and saree draping.'],
    ],
  },
];
export const services: Service[] = groups.flatMap((g) =>
  g.rows.map(
    ([name, price, duration, description]) =>
      ({
        id: name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-$/, ''),
        name,
        category: g.category,
        subcategory: g.subcategory,
        description:
          description ||
          `Explore our illustrative ${name.toLowerCase()} treatment. Details will be confirmed by the salon.`,
        price: price === null ? null : price * 100,
        priceType: price === null ? 'consultation' : g.subcategory === 'Colour' ? 'from' : 'fixed',
        duration,
        includes:
          g.category === 'packages'
            ? (description || '').replace(/\.$/, '').split(/, | and /)
            : [
                'A brief consultation about your preferences',
                'Selected treatment and finishing touches',
              ],
        image: categories.find((c) => c.id === g.category)!.image,
        active: true,
        priceIsVerified: false,
        demo: true,
        featured: [
          'Signature Haircut',
          'Hair Spa',
          'Hydrating Facial',
          'Classic Pedicure',
        ].includes(name),
        ...(name === 'Hair Spa'
          ? {
              priceType: 'variant',
              variants: lengths,
              addons: [{ id: 'massage', name: 'Extra scalp massage', price: 20000, duration: 15 }],
            }
          : {}),
      }) as Service,
  ),
);
export const gallery: (DemoImage & { id: string; category: string; title: string })[] = [
  {
    id: 'bridal',
    category: 'Bridal',
    image: '/images/bridal.jpg',
    title: 'A moment that is beautifully yours',
    position: '50% 30%',
  },
  {
    id: 'beauty',
    category: 'Makeup',
    image: '/images/hero.jpg',
    title: 'Natural beauty, softly defined',
    position: '50% 32%',
  },
  {
    id: 'hair',
    category: 'Hair',
    title: 'Texture with a little personality',
    ...hairPortrait,
  },
  {
    id: 'nails',
    category: 'Nails',
    image: '/images/nails.jpg',
    title: 'The finishing details',
    position: '50% 50%',
  },
  {
    id: 'space',
    category: 'The space',
    image: '/images/salon.jpg',
    title: 'A moment of calm',
    position: '50% 50%',
  },
  {
    id: 'styling',
    category: 'Hair',
    image: '/images/styling.jpg',
    title: 'Everyday hair inspiration',
    position: '50% 50%',
  },
  {
    id: 'skin',
    category: 'Skin',
    image: '/images/facial.jpg',
    title: 'A considered skincare ritual',
    position: '50% 50%',
  },
];
export const faqs = [
  [
    'Is my appointment confirmed immediately?',
    'Every request needs salon approval. In this demonstration, you can explore that process in the owner demo. No request is sent to the salon.',
  ],
  [
    'Do I need to pay online?',
    'No advance online payment is required. Payment will be made at the salon once real bookings are available.',
  ],
  [
    'Are these the final salon prices?',
    'These are illustrative demo prices. Urban Beauti’s final services, durations and rates are awaiting owner confirmation.',
  ],
  [
    'Can I request more than one service?',
    'Yes. Add your preferred services in the booking flow. We combine their durations and show a single estimated total.',
  ],
  [
    'How do I change my request?',
    'Use the status link saved in this browser to cancel or respond to a proposed time. Demo requests can also be managed in the owner demo.',
  ],
];
