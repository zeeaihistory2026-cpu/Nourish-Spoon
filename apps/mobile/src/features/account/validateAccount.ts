export function validateAccount(
  signup: boolean,
  values: {
    email: string;
    password: string;
    name: string;
    phone: string;
    confirm: string;
  },
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter your password.";
  else if (signup && values.password.length < 8)
    errors.password = "Use at least 8 characters.";
  if (signup) {
    if (!values.name.trim()) errors.name = "Enter your full name.";
    if (!values.phone.trim()) errors.phone = "Enter your mobile number.";
    else if (!/^(?:\+?92|0)?3\d{9}$/.test(values.phone.replace(/[\s()-]/g, "")))
      errors.phone = "Enter a valid Pakistani mobile number.";
    if (!values.confirm) errors.confirm = "Confirm your password.";
    else if (values.password !== values.confirm)
      errors.confirm = "Passwords must match.";
  }
  return errors;
}
