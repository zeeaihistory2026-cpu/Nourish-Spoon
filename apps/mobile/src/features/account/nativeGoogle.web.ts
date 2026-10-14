export async function nativeGoogleSignIn(): Promise<void> {
  throw new Error(
    "Native Google sign-in is only available in the installed app.",
  );
}
