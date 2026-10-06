import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'Give this address a name (e.g. Home)'),
  fullName: z.string().min(2, 'Please enter the recipient name'),
  phone: z.string().regex(/^(\+?92|0)?\d{10}$/, 'Enter a valid Pakistani mobile number'),
  line1: z.string().min(5, 'Enter your street address'),
  city: z.string().min(2, 'Enter your city'),
});

export type AddressFormData = z.infer<typeof addressSchema>;
