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
  const [snapshot, setSnapshot] = useState<{ uid: string | null; items: T[] }>({
      uid: null,
      items: [],
    }),
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
    setSnapshot({ uid: null, items: [] });
    setError("");
    setLoading(!!user);
    if (!user) return;
    let active = true;
    try {
      const stop = watch(
        (items) => {
          if (!active) return;
          setSnapshot({ uid: user.uid, items });
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
  // Never show the previous account's data while an auth change is rendering.
  const items =
    snapshot.uid === user?.uid && user?.uid === firebaseAuth?.currentUser?.uid
      ? snapshot.items
      : [];
  return { user, items, error, loading };
}
