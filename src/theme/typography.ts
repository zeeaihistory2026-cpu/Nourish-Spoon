import type { TextStyle } from 'react-native';

// Font family names must match the keys passed to useFonts() in fonts.ts.
export const FONT_FAMILY = {
  display: {
    regular: 'CormorantGaramond_400Regular',
    regularItalic: 'CormorantGaramond_400Regular_Italic',
    medium: 'CormorantGaramond_500Medium',
    semibold: 'CormorantGaramond_600SemiBold',
    semiboldItalic: 'CormorantGaramond_600SemiBold_Italic',
    bold: 'CormorantGaramond_700Bold',
  },
  body: {
    light: 'Jost_300Light',
    regular: 'Jost_400Regular',
    medium: 'Jost_500Medium',
    semibold: 'Jost_600SemiBold',
    bold: 'Jost_700Bold',
  },
} as const;

export type TextVariant =
  | 'splashTitle'
  | 'onboardingTitle'
  | 'authTitle'
  | 'productTitle'
  | 'heroTitle'
  | 'sectionTitle'
  | 'screenTitle'
  | 'logoTitle'
  | 'profileTitle'
  | 'ratingBig'
  | 'button'
  | 'body'
  | 'bodyLight'
  | 'bodyMedium'
  | 'bodySemibold'
  | 'cardTitle'
  | 'cardTitleSmall'
  | 'caption'
  | 'captionLight'
  | 'captionMedium'
  | 'small'
  | 'smallLight'
  | 'smallMedium'
  | 'micro'
  | 'microRegular'
  | 'label'
  | 'tab'
  | 'stat'
  | 'inputText'
  | 'productTitleSmall'
  | 'ratingValue'
  | 'ratingCount'
  | 'priceValue'
  | 'priceFrom'
  | 'sectionTitleBig';

export const TEXT_STYLES: Record<TextVariant, TextStyle> = {
  splashTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 40, lineHeight: 46 },
  onboardingTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 30, lineHeight: 35 },
  authTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 28, lineHeight: 33 },
  productTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 26, lineHeight: 31 },
  heroTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 22, lineHeight: 26 },
  sectionTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 20, lineHeight: 26 },
  screenTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 20, lineHeight: 26 },
  logoTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 19, lineHeight: 24 },
  profileTitle: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 22, lineHeight: 27 },
  ratingBig: { fontFamily: FONT_FAMILY.display.semibold, fontSize: 44, lineHeight: 48 },
  button: {
    fontFamily: FONT_FAMILY.body.semibold,
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  body: { fontFamily: FONT_FAMILY.body.regular, fontSize: 14, lineHeight: 22 },
  bodyLight: { fontFamily: FONT_FAMILY.body.light, fontSize: 14, lineHeight: 22 },
  bodyMedium: { fontFamily: FONT_FAMILY.body.medium, fontSize: 14, lineHeight: 22 },
  bodySemibold: { fontFamily: FONT_FAMILY.body.semibold, fontSize: 14, lineHeight: 20 },
  cardTitle: { fontFamily: FONT_FAMILY.body.medium, fontSize: 13.5, lineHeight: 19 },
  cardTitleSmall: { fontFamily: FONT_FAMILY.body.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: FONT_FAMILY.body.regular, fontSize: 12, lineHeight: 17 },
  captionLight: { fontFamily: FONT_FAMILY.body.light, fontSize: 12, lineHeight: 17 },
  captionMedium: { fontFamily: FONT_FAMILY.body.medium, fontSize: 12, lineHeight: 17 },
  small: { fontFamily: FONT_FAMILY.body.regular, fontSize: 11.5, lineHeight: 16 },
  smallLight: { fontFamily: FONT_FAMILY.body.light, fontSize: 11, lineHeight: 16 },
  smallMedium: { fontFamily: FONT_FAMILY.body.medium, fontSize: 11.5, lineHeight: 16 },
  micro: { fontFamily: FONT_FAMILY.body.medium, fontSize: 10.5, lineHeight: 14 },
  microRegular: { fontFamily: FONT_FAMILY.body.regular, fontSize: 10.5, lineHeight: 14 },
  label: {
    fontFamily: FONT_FAMILY.body.medium,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  tab: { fontFamily: FONT_FAMILY.body.medium, fontSize: 10.5, lineHeight: 14, letterSpacing: 0.2 },
  stat: { fontFamily: FONT_FAMILY.body.semibold, fontSize: 17, lineHeight: 22 },
  inputText: { fontFamily: FONT_FAMILY.body.regular, fontSize: 14.5, lineHeight: 20 },
  productTitleSmall: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 19,
    lineHeight: 24,
  },
  ratingValue: { fontFamily: FONT_FAMILY.body.semibold, fontSize: 15, lineHeight: 20 },
  ratingCount: { fontFamily: FONT_FAMILY.body.regular, fontSize: 12.5, lineHeight: 17 },
  priceValue: { fontFamily: FONT_FAMILY.body.semibold, fontSize: 16, lineHeight: 21 },
  priceFrom: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 22,
    lineHeight: 27,
  },
  sectionTitleBig: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 28,
    lineHeight: 34,
  },
};
