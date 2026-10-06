import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { Screen } from '../components/ui/Screen';
import { colors, radius } from '../theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. Receives the error and a retry function. */
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time crashes anywhere in the subtree and shows a branded
 * fallback instead of a blank screen. Place it high in the tree (around the
 * navigation container) so a single broken screen can't take down the app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Hook up to crash reporting here (e.g. Sentry) when it's added.
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  private retry = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    if (this.props.fallback) {
      return this.props.fallback(error, this.retry);
    }
    return (
      <Screen>
        <View style={styles.wrap}>
          <AppText variant="screenTitle" color="greenDark" style={styles.title}>
            Something went wrong
          </AppText>
          <AppText variant="body" color="textMid" style={styles.message}>
            The app hit an unexpected problem. Your cart and data are safe — try again.
          </AppText>
          <Pressable
            onPress={this.retry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <AppText variant="button" color="white">
              Try Again
            </AppText>
          </Pressable>
          {__DEV__ ? (
            <AppText variant="small" color="danger" style={styles.debug}>
              {error.message}
            </AppText>
          ) : null}
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.cream,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  pressed: {
    opacity: 0.85,
  },
  debug: {
    marginTop: 16,
    textAlign: 'center',
  },
});
