import type { AppRoute } from "./types";

export function signedIn(
  user: { uid: string; isAnonymous: boolean } | null | undefined,
) {
  return !!user?.uid && !user.isAnonymous;
}

export function entryRoute(
  authenticated: boolean,
  onboarded: boolean,
): AppRoute {
  return { name: !authenticated ? "Login" : onboarded ? "Home" : "onboarding" };
}

/** Render guard also covers logout and auth restoration before navigation effects run. */
export function accessibleRoute(
  route: AppRoute,
  authenticated: boolean,
  authReady: boolean,
): AppRoute {
  if (route.name === "splash") return route;
  if (!authReady) return { name: "splash" };
  if (!authenticated && route.name !== "Login" && route.name !== "Signup")
    return { name: "Login" };
  return route;
}
