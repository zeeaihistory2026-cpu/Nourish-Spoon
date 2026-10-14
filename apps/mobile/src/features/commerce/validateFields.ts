import { FieldErrors } from "../../hooks/useFormValidation";
export function addressErrors(values: {
  name: string;
  phone: string;
  city: string;
  line: string;
  label?: string;
}) {
  const errors: FieldErrors = {};
  for (const [key, message] of Object.entries({
    name: "Enter your full name.",
    phone: "Enter your mobile number.",
    city: "Enter your delivery city.",
    line: "Enter your street address.",
  })) {
    if (!values[key as keyof typeof values]?.trim()) errors[key] = message;
  }
  if (values.label !== undefined && !values.label.trim())
    errors.label = "Enter an address label.";
  if (
    values.phone.trim() &&
    !/^(?:\+?92|0)?3\d{9}$/.test(values.phone.replace(/[\s()-]/g, ""))
  )
    errors.phone = "Enter a valid Pakistani mobile number.";
  return errors;
}
