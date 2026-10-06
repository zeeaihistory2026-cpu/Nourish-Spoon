import { addressSchema } from '../checkoutSchema';

const valid = {
  label: 'Home',
  fullName: 'Amina Khan',
  phone: '+923000000000',
  line1: 'House 12, Street 4, DHA Phase 5',
  city: 'Lahore',
};

describe('addressSchema', () => {
  it('accepts a complete address', () => {
    const result = addressSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('requires a label', () => {
    const result = addressSchema.safeParse({ ...valid, label: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid phone number', () => {
    const result = addressSchema.safeParse({ ...valid, phone: '0300-abc' });
    expect(result.success).toBe(false);
  });

  it('requires a meaningful street address', () => {
    const result = addressSchema.safeParse({ ...valid, line1: 'Home' });
    expect(result.success).toBe(false);
  });
});
