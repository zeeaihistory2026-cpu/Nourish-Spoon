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
    firebaseAuth?.currentUser && !firebaseAuth.currentUser.isAnonymous
      ? firebaseAuth.currentUser
      : null,
  );
  const [items, setItems] = useState<T[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(!!firebaseAuth?.currentUser);
  useEffect(
    () =>
      firebaseAuth
        ? onAuthStateChanged(firebaseAuth, (user) =>
            setUser(user && !user.isAnonymous ? user : null),
          )
        : undefined,
    [],
  );
  useEffect(() => {
    setItems([]);
    setError("");
    setLoading(!!user);
    if (!user) return;
    let active = true;
    try {
      const stop = watch(
        (items) => {
          if (!active) return;
          setItems(items);
          setLoading(false);
        },
        (error) => {
          if (!active) return;
          setError(commerceError(error));
          setLoading(false);
        },
      );
      return () => {
        active = false;
        stop();
      };
    } catch (error) {
      setError(commerceError(error));
      setLoading(false);
    }
  }, [user?.uid, watch]);
  return { user, items, error, loading };
}
