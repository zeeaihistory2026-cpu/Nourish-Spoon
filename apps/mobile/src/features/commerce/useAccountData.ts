import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { commerceError } from "./service";
export function useAccountData<T>(
  watch: (
    next: (items: T[]) => void,
    error: (error: unknown) => void,
  ) => () => void,
) {
  const [user, setUser] = useState<User | null>(
    firebaseAuth?.currentUser || null,
  );
  const [items, setItems] = useState<T[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  useEffect(
    () =>
      firebaseAuth ? onAuthStateChanged(firebaseAuth, setUser) : undefined,
    [],
  );
  useEffect(() => {
    setItems([]);
    setError("");
    setLoading(!!user);
    if (!user) return;
    try {
      return watch(
        (items) => {
          setItems(items);
          setLoading(false);
        },
        (error) => {
          setError(commerceError(error));
          setLoading(false);
        },
      );
    } catch (error) {
      setError(commerceError(error));
      setLoading(false);
    }
  }, [user?.uid, watch]);
  return { user, items, error, loading };
}
