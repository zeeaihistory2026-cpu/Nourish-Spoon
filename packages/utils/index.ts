// ==============================================================================
// NOURISH SPOON: SHARED UTILITIES
// ==============================================================================

/**
 * Format currency in Pakistani Rupees (PKR)
 * e.g. 1999 -> "Rs. 1,999"
 */
export function formatPKR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
}

/**
 * Format price per 100g
 * e.g. 799.6 -> "Rs. 799.60 per 100g"
 */
export function formatPer100g(amount: number | null | undefined): string {
  if (!amount) return '';
  return `Rs. ${Number(amount).toFixed(2)} per 100g`;
}

export type WhatsAppOrderParams = {
  productName: string;
  variantWeight: string;
  unitPrice: number;
  quantity: number;
  customerName: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  isGift?: boolean;
  giftMessage?: string;
  businessWhatsApp?: string; // default '+92 304 6721962'
};

/**
 * Generate formatted WhatsApp order message as specified in PRD Section 6.9
 */
export function generateWhatsAppMessage(params: WhatsAppOrderParams): string {
  const total = params.unitPrice * params.quantity;
  const lines: string[] = [
    `🌿 *Assalam-o-Alaikum Nourish Spoon!*`,
    `I would like to place an order from your mobile app:`,
    ``,
    `📦 *Item:* ${params.productName}`,
    `⚖️ *Size:* ${params.variantWeight}`,
    `🔢 *Quantity:* ${params.quantity}`,
    `💰 *Price:* ${formatPKR(params.unitPrice)} each`,
    `💵 *Total Amount:* ${formatPKR(total)}`,
    ``,
    `👤 *Customer Name:* ${params.customerName}`,
    `📞 *Phone Number:* ${params.customerPhone}`,
    `📍 *Delivery City:* ${params.deliveryCity}`,
    `🏠 *Delivery Address:* ${params.deliveryAddress}`
  ];

  if (params.isGift) {
    lines.push(``);
    lines.push(`🎁 *Gift Order:* Yes`);
    if (params.giftMessage && params.giftMessage.trim()) {
      lines.push(`💌 *Personalized Note:* "${params.giftMessage.trim()}"`);
    }
  }

  lines.push(``);
  lines.push(`Please share the advance payment details (Bank Transfer / EasyPaisa / JazzCash) to confirm my order. JazakAllah!`);

  return lines.join('\n');
}

/**
 * Create WhatsApp direct link
 */
export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Standard business phone for Nourish Spoon
 */
export const DEFAULT_WHATSAPP_PHONE = '+92 304 6721962';
