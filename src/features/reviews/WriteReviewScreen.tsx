import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { z } from 'zod';

import type { ProductsStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { AnalyticsEvent, trackReviewSubmitted } from '../../services/analytics/events';
import { submitReviewClientSide } from './services/reviewService';
import { useAuthStore } from '../../store/authStore';
import { colors, radius } from '../../theme';
import { getFriendlyError } from '../../utils/errors';

const writeReviewSchema = z.object({
  rating: z.number().min(1, 'Tap the stars to choose a rating'),
  comment: z
    .string()
    .min(4, 'Tell us a little more about the product')
    .max(500, 'Please keep it under 500 characters'),
});

type WriteReviewFormData = z.infer<typeof writeReviewSchema>;

export function WriteReviewScreen() {
  const route = useRoute<RouteProp<ProductsStackParamList, 'WriteReview'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const [submitError, setSubmitError] = useState('');
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WriteReviewFormData>({
    resolver: zodResolver(writeReviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) {
      setSubmitError('Please sign in to write a review.');
      return;
    }
    setSubmitError('');
    try {
      // TEMPORARY client-side submission until the server function is deployed.
      const result = await submitReviewClientSide(uid, {
        productId: route.params.productId,
        rating: values.rating,
        comment: values.comment.trim(),
      });
      setVerified(result.verifiedPurchase);
      setSubmitted(true);
      void trackReviewSubmitted(route.params.productId, values.rating);
    } catch (error) {
      setSubmitError(getFriendlyError(error));
    }
  });

  return (
    <Screen>
      <AppHeader variant="title" title="Write a Review" onBack />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {submitted ? (
          <View style={styles.success}>
            <View style={styles.successIcon}>
              <Check size={40} color={colors.goldDark} strokeWidth={2.6} />
            </View>
            <AppText variant="authTitle" color="greenDark" style={styles.successTitle}>
              Thank you!
            </AppText>
            <AppText variant="body" color="textMid" style={styles.successBody}>
              Your review for {route.params.productName} has been posted.
            </AppText>
            {verified ? (
              <View style={styles.verifiedTag}>
                <AppText variant="micro" style={{ color: colors.verified }}>
                  Verified Purchase
                </AppText>
              </View>
            ) : (
              <AppText variant="small" color="textLight" style={styles.successBody}>
                Reviews from delivered orders are marked as Verified Purchases.
              </AppText>
            )}
            <View style={styles.doneButton}>
              <Button label="Done" variant="green" onPress={() => navigation.goBack()} />
            </View>
          </View>
        ) : (
          <>
            <AppText variant="sectionTitle" color="greenDark">
              {route.params.productName}
            </AppText>
            <AppText variant="small" color="textMid" style={styles.sub}>
              How was your experience?
            </AppText>

            <Controller
              control={control}
              name="rating"
              render={({ field, fieldState }) => (
                <View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Pressable
                        key={value}
                        onPress={() => field.onChange(value)}
                        accessibilityRole="button"
                        accessibilityLabel={`${value} star${value === 1 ? '' : 's'}`}
                        style={styles.starButton}
                      >
                        <Star
                          size={34}
                          color={colors.gold}
                          fill={value <= field.value ? colors.gold : 'transparent'}
                          strokeWidth={value <= field.value ? 0 : 1.8}
                        />
                      </Pressable>
                    ))}
                  </View>
                  {fieldState.error ? (
                    <AppText variant="small" color="danger" style={styles.error}>
                      {fieldState.error.message}
                    </AppText>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name="comment"
              render={({ field, fieldState }) => (
                <Input
                  label="Your Review"
                  multiline
                  placeholder="What did you love about it?"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                  containerStyle={styles.commentInput}
                  style={styles.commentField}
                />
              )}
            />

            {submitError ? (
              <AppText variant="small" color="danger" style={styles.error}>
                {submitError}
              </AppText>
            ) : null}

            <View style={styles.submit}>
              <Button
                label="Post Review"
                variant="green"
                onPress={onSubmit}
                loading={isSubmitting}
              />
            </View>
            <AppText variant="smallLight" color="textLight" style={styles.note}>
              Reviews from delivered orders are automatically marked as a Verified Purchase.
            </AppText>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  sub: {
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 18,
  },
  starButton: {
    padding: 5,
  },
  commentInput: {
    marginTop: 18,
  },
  commentField: {
    height: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: 10,
  },
  submit: {
    marginTop: 22,
  },
  note: {
    marginTop: 12,
    textAlign: 'center',
  },
  success: {
    alignItems: 'center',
    paddingTop: 48,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    marginTop: 22,
  },
  successBody: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 280,
  },
  verifiedTag: {
    marginTop: 12,
    backgroundColor: 'rgba(37, 211, 102, 0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneButton: {
    marginTop: 28,
    width: '100%',
  },
});
