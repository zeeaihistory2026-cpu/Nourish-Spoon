import { commerceEnabled } from "./availability";
import { useFormValidation } from "../../hooks/useFormValidation";
import React, { useState } from "react";
import { Share, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import {
  Page,
  Card,
  Heading,
  Copy,
  Message,
  Field,
  AccountGate,
} from "./components";
import { useRewardsAccount, rewardError } from "./rewardsService";
import { call } from "./service";
import { useMobileStore } from "../../services/storeService";
export function ReferralsScreen({ navigation }: { navigation: AppNavigation }) {
  const { user, account, error, loading, refresh } = useRewardsAccount();
  const { theme } = useMobileStore();
  const [code, setCode] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const form = useFormValidation();
  async function apply() {
    if (busy) return;
    if (
      !form.validate(
        /^[A-Z0-9]{4,24}$/.test(code.trim().toUpperCase())
          ? {}
          : { code: "Enter a valid friend’s referral code." },
      )
    )
      return;
    setBusy(true);
    setNotice("");
    try {
      await call("applyReferral", { code: code.trim().toUpperCase() });
      setNotice("Your friend’s code is linked.");
      await refresh();
    } catch (error) {
      setNotice(rewardError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      validationTick={form.validationTick}
      title="Refer & Earn"
      subtitle="Share something wholesome with a friend."
      back={navigation.goBack}
    >
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          {!!error && <Message>{error}</Message>}
          {!commerceEnabled && (
            <Card>
              <Heading>Refer & Earn 200 points</Heading>
              <Copy>
                Referral codes become available when rewards are activated. The
                bonus is awarded after your friend’s first paid, delivered
                order.
              </Copy>
              <GreenButton
                title="Shop Products"
                onPress={() => navigation.navigate("Products")}
              />
            </Card>
          )}
          {account && (
            <>
              <Card>
                <Ionicons
                  name="people-outline"
                  size={32}
                  color={theme.primary}
                />
                <Heading>Earn {account.config.referral_points} points</Heading>
                <Copy>
                  Your friend enters your code before their first order. You
                  earn the bonus when their first order is paid and delivered.
                </Copy>
                <View
                  style={{
                    padding: 16,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: theme.primary,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    selectable
                    style={{
                      fontSize: 23,
                      fontWeight: "700",
                      letterSpacing: 2,
                      color: theme.primary,
                      textAlign: "center",
                    }}
                  >
                    {account.referral_code}
                  </Text>
                </View>
                <GreenButton
                  title="Copy My Code"
                  onPress={async () => {
                    try {
                      await Clipboard.setStringAsync(account.referral_code);
                      setNotice("Referral code copied.");
                    } catch {
                      setNotice(
                        "Could not copy. You can select the code above.",
                      );
                    }
                  }}
                />
                <GreenButton
                  title="Share with a Friend"
                  onPress={async () => {
                    try {
                      await Share.share({
                        message: `Join me on Nourish Spoon! Sign up and enter referral code ${account.referral_code} in More → Refer & Earn before your first order. Discover homemade Panjeeri and Energy Balls at nourishspoon.com.`,
                      });
                    } catch {
                      setNotice(
                        "Could not open sharing. Copy your code instead.",
                      );
                    }
                  }}
                />
              </Card>
              <Card>
                <Heading>Have a friend’s code?</Heading>
                {account.referred_by ? (
                  <Copy>Your referral is already linked.</Copy>
                ) : account.has_delivered_order ? (
                  <Copy>
                    Referral codes are for new customers, before their first
                    order.
                  </Copy>
                ) : (
                  <>
                    <Copy>
                      Use another customer’s code once before placing an order.
                      Verify your email first.
                    </Copy>
                    <Field
                      label="Friend’s referral code"
                      value={code}
                      {...form.bind("code", setCode)}
                      autoCapitalize="characters"
                      maxLength={24}
                    />
                    <GreenButton
                      title={busy ? "Applying…" : "Apply Referral Code"}
                      disabled={busy}
                      onPress={apply}
                    />
                  </>
                )}
              </Card>
            </>
          )}
          {!!notice && <Message>{notice}</Message>}
          {!account && commerceEnabled && (
            <GreenButton
              title={loading ? "Loading…" : "Try Again"}
              disabled={loading}
              onPress={refresh}
            />
          )}
        </>
      )}
    </Page>
  );
}
