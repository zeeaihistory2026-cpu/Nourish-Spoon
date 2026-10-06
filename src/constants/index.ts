import type { PaymentMethod } from '../types/order';

// Brand photography and the drawn logo are bundled with the app so the UI
// always renders the real imagery, offline included.
import logoImage from '../assets/brand/logo.png';
import energyBallsImage from '../assets/brand/energy-balls.jpg';
import panjeeriImage from '../assets/brand/panjeeri.jpg';
import storyImage from '../assets/brand/story.jpg';
import bowlImage from '../assets/brand/bowl.jpg';
import homeHeroImage from '../assets/brand/home-hero.jpg';
import fullSplashImage from '../assets/brand/full-splash.jpg';
import fullOnboardingImage from '../assets/brand/full-onboarding.jpg';
import fullSignupImage from '../assets/brand/full-signup.jpg';
import fullLoginImage from '../assets/brand/full-login.jpg';
import fullHomeImage from '../assets/brand/full-home-v2.jpg';
import fullProductsImage from '../assets/brand/full-products-v2.jpg';
import fullDetailBallsImage from '../assets/brand/full-detail-balls-v2.jpg';
import fullDetailPanjeeriImage from '../assets/brand/full-detail-panjeeri-v2.jpg';

export const BRAND = {
  name: 'Nourish Spoon',
  tagline: 'Crafted with Love',
  splashFoot: 'Handcrafted Nutrition · Real Ingredients · Pure Love',
  logoImage,
  energyBallsImage,
  panjeeriImage,
  storyImage,
  bowlImage,
  homeHeroImage,
  fullSplashImage,
  fullOnboardingImage,
  fullSignupImage,
  fullLoginImage,
  fullHomeImage,
  fullProductsImage,
  fullDetailBallsImage,
  fullDetailPanjeeriImage,
} as const;

export const SUPPORT = {
  whatsappNumber: '923046721962',
  phoneDisplay: '+92 304 6721962',
  email: 'info@nourishspoon.com',
  website: 'https://nourishspoon.com',
  privacyUrl: 'https://nourishspoon.com/privacy',
  city: 'Sargodha',
} as const;

export const DELIVERY = {
  fee: 150,
  freeThreshold: 2500,
} as const;

export const APP_VERSION = '1.0.0';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  bank_transfer: 'Bank Transfer',
};
