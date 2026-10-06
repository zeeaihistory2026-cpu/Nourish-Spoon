import { Linking } from 'react-native';

import { SUPPORT } from '../constants';

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SUPPORT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export async function openWhatsApp(message: string): Promise<void> {
  try {
    await Linking.openURL(whatsappUrl(message));
  } catch {
    // WhatsApp not installed — fall back to the brand site rather than failing silently.
    try {
      await Linking.openURL(SUPPORT.website);
    } catch {
      // Nothing else we can do; ignore.
    }
  }
}
