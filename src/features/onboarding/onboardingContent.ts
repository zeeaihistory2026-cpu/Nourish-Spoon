import { BRAND } from '../../constants';

export interface OnboardingSlide {
  image: number | string;
  cover?: boolean;
  badge: string;
  title: { text: string; gold?: boolean }[];
  body: string;
  features: string[];
}

export const SLIDES: OnboardingSlide[] = [
  {
    image: BRAND.bowlImage,
    badge: 'Small-Batch Fresh',
    title: [
      { text: 'Handcrafted ' },
      { text: 'Nutrition', gold: true },
      { text: ', Made the Traditional Way' },
    ],
    body: 'Authentic Panjeeri and date-nut energy balls, prepared in small batches from generational family recipes.',
    features: ['Premium natural sourcing', 'Wholesome family-safe nutrition'],
  },
  {
    image: BRAND.bowlImage,
    cover: true,
    badge: '100% Natural',
    title: [
      { text: 'Real Ingredients. ' },
      { text: 'Zero', gold: true },
      { text: ' Preservatives.' },
    ],
    body: 'Just dates, nuts and pure ghee â€” nothing artificial. Sealed fresh in food-grade airtight packaging.',
    features: ['No additives or preservatives', 'Energy & protein rich'],
  },
  {
    image: BRAND.energyBallsImage,
    badge: 'Delivered Fresh',
    title: [
      { text: 'Order in a Tap. ' },
      { text: 'Delivered', gold: true },
      { text: ' with Love.' },
    ],
    body: 'Browse our signature range and order straight to your door â€” or checkout instantly on WhatsApp.',
    features: ['Fast local delivery', 'One-tap WhatsApp ordering'],
  },
];
