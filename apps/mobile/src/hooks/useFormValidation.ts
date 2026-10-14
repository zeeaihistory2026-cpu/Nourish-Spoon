import { useState } from "react";
export type FieldErrors = Record<string, string>;
export function useFormValidation() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [validationTick, setTick] = useState(0);
  function validate(next: FieldErrors) {
    setErrors(next);
    if (Object.keys(next).length) {
      setTick((value) => value + 1);
      return false;
    }
    return true;
  }
  function clear(key: string) {
    setErrors((previous) => ({ ...previous, [key]: "" }));
  }
  function bind(key: string, change: (value: string) => void) {
    return {
      error: errors[key],
      validationTick,
      onChangeText: (value: string) => {
        clear(key);
        change(value);
      },
    };
  }
  return {
    errors,
    validationTick,
    validate,
    clear,
    bind,
    reset: () => setErrors({}),
  };
}
