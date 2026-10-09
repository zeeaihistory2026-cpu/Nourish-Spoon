export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) {
    return 'Rs. —';
  }
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded).toString();
  let grouped = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      grouped += ',';
    }
    grouped += digits[i];
  }
  return `Rs. ${sign}${grouped}`;
}
