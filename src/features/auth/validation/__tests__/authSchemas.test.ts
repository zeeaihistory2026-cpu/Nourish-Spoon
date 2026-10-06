import { loginSchema, signUpSchema } from '../authSchemas';

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    const result = loginSchema.safeParse({
      email: 'amina@nourish.pk',
      password: 'craftedlove',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'amina@@nourish', password: 'craftedlove' });
    expect(result.success).toBe(false);
  });

  it('rejects a short password', () => {
    const result = loginSchema.safeParse({ email: 'amina@nourish.pk', password: '123' });
    expect(result.success).toBe(false);
  });
});

describe('signUpSchema', () => {
  const valid = {
    fullName: 'Amina Khan',
    email: 'amina@nourish.pk',
    password: 'craftedlove',
    confirmPassword: 'craftedlove',
    phone: '+923000000000',
    acceptTerms: true,
  };

  it('accepts a valid sign-up', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it('allows an empty optional phone', () => {
    expect(signUpSchema.safeParse({ ...valid, phone: '' }).success).toBe(true);
  });

  it('rejects an invalid Pakistani mobile number', () => {
    const result = signUpSchema.safeParse({ ...valid, phone: '030012' });
    expect(result.success).toBe(false);
  });

  it('rejects sign-up without accepting terms', () => {
    const result = signUpSchema.safeParse({ ...valid, acceptTerms: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('Terms');
    }
  });
});
