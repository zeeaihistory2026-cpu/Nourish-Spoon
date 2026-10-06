interface FirebaseLikeError {
  code?: string;
  message?: string;
}

const AUTH_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
  'auth/invalid-email': 'That email address does not look right. Please check it and try again.',
  'auth/user-not-found': 'We could not find an account with that email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact support for help.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/requires-recent-login': 'For security, please sign in again before doing this.',
  'auth/weak-password': 'Please choose a stronger password.',
  'functions/already-exists': 'You have already reviewed this product.',
  'functions/permission-denied': 'You do not have permission to do that.',
  'functions/unavailable': 'The service is temporarily unavailable. Please try again.',
};

export function getFriendlyError(error: unknown): string {
  const code = (error as FirebaseLikeError | null)?.code;
  if (typeof code === 'string' && AUTH_MESSAGES[code]) {
    return AUTH_MESSAGES[code];
  }
  if (code === 'functions/failed-precondition') {
    const message = (error as FirebaseLikeError | null)?.message;
    if (typeof message === 'string' && message.length > 0 && !message.includes('Promise')) {
      return message;
    }
    return 'Please check your cart and try again.';
  }
  return 'Something went wrong. Please try again.';
}
