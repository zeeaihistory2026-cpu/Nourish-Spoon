import { useState } from "react";
import { Image, Share, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppNavigation } from "../../navigation/types";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Accordion } from "../../components/Accordion";
import { BUTTON_COLORS, BUTTON_OUTLINE } from "../../constants/theme";
import { useFormValidation } from "../../hooks/useFormValidation";
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
import { commerceEnabled } from "./availability";
import { call } from "./service";
import { useMobileStore } from "../../services/storeService";

export function ReferralsScreen({ navigation }: { navigation: AppNavigation }) {
  const { user, account, error, loading, refresh } = useRewardsAccount();
  const theme = useMobileStore((state) => state.theme);
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  const [referralNotice, setReferralNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const form = useFormValidation();
  const headline =
    account?.referral_program?.headline ||
    `Earn ${account?.config.referral_points ?? 0} Points`;

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
    setReferralNotice("");
    try {
      await call("applyReferral", { code: code.trim().toUpperCase() });
      setReferralNotice("Your friend’s code is linked.");
      await refresh();
    } catch (error) {
      setReferralNotice(rewardError(error));
    } finally {
      setBusy(false);
    }
  }
  async function copyCode() {
    if (!account?.referral_code) return;
    try {
      await Clipboard.setStringAsync(account.referral_code);
      setNotice("Referral code copied.");
    } catch {
      setNotice("Could not copy. You can select the code above.");
    }
  }
  async function shareCode() {
    if (!account?.referral_code) return;
    try {
      await Share.share({
        message: `Join me on Nourish Spoon! Sign up and enter referral code ${account.referral_code} in More → Refer & Earn before your first order. Discover homemade Panjeeri and Energy Balls at nourishspoon.com.`,
      });
    } catch {
      setNotice("Could not open sharing. Copy your code instead.");
    }
  }
  return (
    <Page
      botanical
      validationTick={form.validationTick}
      validationPosition="bottom"
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
              <Heading>Refer & Earn</Heading>
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
          {account && !account.config.referrals_enabled && (
            <Message>The referral program is currently paused.</Message>
          )}
          {account?.config.referrals_enabled && (
            <>
              <View
                style={[
                  s.inviteCard,
                  {
                    backgroundColor: theme.isDark ? theme.surface : "#FFFDF8",
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <View style={s.ornaments}>
                  <View
                    style={[
                      s.gift,
                      {
                        backgroundColor: theme.isDark
                          ? theme.surfaceWarm
                          : "#ECF0DF",
                      },
                    ]}
                  >
                    <Ionicons
                      name="gift-outline"
                      size={28}
                      color={theme.primary}
                    />
                  </View>
                  <Ionicons
                    name="paper-plane-outline"
                    size={27}
                    color={theme.gold}
                    style={{ transform: [{ rotate: "-12deg" }] }}
                  />
                </View>
                <Text accessibilityRole="header" style={s.headline}>
                  {headline.split(/(\d[\d,]*)/).map((part, index) => (
                    <Text
                      key={index}
                      style={[
                        s.headline,
                        /^\d/.test(part) && { color: theme.gold },
                      ]}
                    >
                      {part}
                    </Text>
                  ))}
                </Text>
                <Copy>
                  {account.referral_program?.copy ||
                    "Your friend enters your code before their first order. You earn the bonus when their first order is paid and delivered."}
                </Copy>
                <View
                  style={[
                    s.codePanel,
                    {
                      backgroundColor: theme.isDark
                        ? theme.surfaceWarm
                        : "#F8F5E9",
                    },
                  ]}
                >
                  <Text style={s.codeLabel}>Your Referral Code</Text>
                  <View
                    style={[
                      s.codeBox,
                      {
                        borderColor: theme.isDark
                          ? theme.primaryLight
                          : "#9EB5A7",
                        backgroundColor: theme.surface,
                      },
                    ]}
                  >
                    <Text
                      selectable
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.65}
                      style={s.code}
                    >
                      {account.referral_code}
                    </Text>
                    <TouchableOpacity
                      accessibilityLabel="Copy referral code"
                      onPress={copyCode}
                      style={s.copyIcon}
                    >
                      <Ionicons
                        name="copy-outline"
                        size={21}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  accessibilityLabel="Copy My Code"
                  onPress={copyCode}
                  style={[
                    s.action,
                    BUTTON_OUTLINE,
                    { backgroundColor: BUTTON_COLORS.background },
                  ]}
                >
                  <Ionicons
                    name="copy-outline"
                    size={23}
                    color={BUTTON_COLORS.text}
                  />
                  <Text style={[s.actionLabel, { color: BUTTON_COLORS.text }]}>
                    Copy My Code
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Share with a Friend"
                  onPress={shareCode}
                  style={[
                    s.action,
                    {
                      borderWidth: 1,
                      borderColor: theme.primary,
                      backgroundColor: theme.surface,
                    },
                  ]}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={23}
                    color={theme.primary}
                  />
                  <Text style={[s.actionLabel, { color: theme.primary }]}>
                    Share with a Friend
                  </Text>
                </TouchableOpacity>
                {!!notice && (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={{
                      color: theme.primary,
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    {notice}
                  </Text>
                )}
              </View>
              <View style={s.footer} pointerEvents="none">
                <Image
                  source={require("../../../assets/design/referral-nuts-footer.png")}
                  resizeMode="contain"
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      width: "100%",
                      height: "100%",
                      opacity: theme.isDark ? 0.45 : 1,
                    },
                  ]}
                  accessible={false}
                />
                <View style={s.footerCopy}>
                  <Text
                    style={[
                      s.quote,
                      { color: theme.isDark ? theme.gold : "#92602B" },
                    ]}
                  >
                    Good Food{"\n"}Brings{"\n"}Good People
                  </Text>
                  <Ionicons name="heart" size={19} color={theme.gold} />
                </View>
              </View>
              <Accordion title="Have a friend’s code?">
                {!!referralNotice && (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={{ fontSize: 14, lineHeight: 21 }}
                  >
                    {referralNotice}
                  </Text>
                )}
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
              </Accordion>
              {!!account.referral_program?.terms && (
                <Accordion title="Program terms">
                  <Copy>{account.referral_program.terms}</Copy>
                </Accordion>
              )}
            </>
          )}
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

const s = StyleSheet.create({
  inviteCard: {
    padding: 18,
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#4B3212",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  ornaments: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 4,
  },
  gift: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headline: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 31,
    lineHeight: 40,
  },
  codePanel: { borderRadius: 16, padding: 10, gap: 7, marginTop: 2 },
  codeLabel: { fontSize: 13, paddingHorizontal: 5 },
  codeBox: {
    minHeight: 48,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 3,
  },
  code: {
    flex: 1,
    minWidth: 0,
    fontWeight: "700",
    fontSize: 21,
    letterSpacing: 2,
    textAlign: "center",
  },
  copyIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "center",
  },
  footer: { aspectRatio: 2, marginHorizontal: -16, overflow: "hidden" },
  footerCopy: {
    marginLeft: "54%",
    paddingTop: 23,
    paddingRight: 12,
    alignItems: "center",
    gap: 4,
  },
  quote: {
    fontFamily: "serif",
    fontStyle: "italic",
    fontSize: 25,
    lineHeight: 28,
    textAlign: "center",
  },
});
