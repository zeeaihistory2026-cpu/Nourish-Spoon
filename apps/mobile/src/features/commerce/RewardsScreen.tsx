import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { Page, Card, Heading, Copy, Message, AccountGate } from "./components";
import { useRewardsAccount } from "./rewardsService";
import { useMobileStore } from "../../services/storeService";
export function RewardsScreen({ navigation }: { navigation: AppNavigation }) {
  const { user, account, error, loading, refresh } = useRewardsAccount();
  const { theme } = useMobileStore();
  return (
    <Page
      title="My Points"
      subtitle="A little thank you for choosing wholesome."
      back={navigation.goBack}
    >
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          {!!error && <Message>{error}</Message>}
          {account && (
            <>
              <Card>
                <Ionicons name="gift-outline" size={30} color={theme.primary} />
                <Text
                  style={{
                    fontFamily: "serif",
                    fontSize: 48,
                    fontWeight: "700",
                    color: theme.primary,
                  }}
                >
                  {account.balance}
                </Text>
                <Heading>Available points</Heading>
                <Copy>
                  {account.config.minimum_redemption} points = Rs.{" "}
                  {account.config.minimum_redemption *
                    account.config.point_value}
                  . Use points at checkout.
                </Copy>
                {!account.config.enabled && (
                  <Copy>Rewards are currently paused.</Copy>
                )}
              </Card>
              <Card>
                <Heading>How you earn</Heading>
                <Copy>
                  Earn 1 point for every Rs. {account.config.spend_per_point} of
                  products after discounts. Points arrive once payment is
                  confirmed and your order is delivered.
                </Copy>
                <Copy>
                  Delivery charges do not earn points. Cancelled or refunded
                  orders are adjusted automatically.
                </Copy>
                <GreenButton
                  title="Refer & Earn"
                  onPress={() => navigation.navigate("Referrals")}
                />
              </Card>
              <Card>
                <Heading>Points history</Heading>
                {!account.history.length && (
                  <Copy>Your earned and redeemed points will appear here.</Copy>
                )}
                {account.history.map((entry) => (
                  <View
                    key={entry.id}
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      borderBottomWidth: 1,
                      borderColor: theme.border,
                      paddingVertical: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "600" }}>{entry.title}</Text>
                      <Copy>
                        {new Date(entry.created_at).toLocaleDateString()}
                      </Copy>
                    </View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: entry.points >= 0 ? theme.primary : theme.danger,
                      }}
                    >
                      {entry.points > 0 ? "+" : ""}
                      {entry.points}
                    </Text>
                  </View>
                ))}
              </Card>
              <GreenButton
                title="Shop Products"
                onPress={() => navigation.navigate("Products")}
              />
            </>
          )}
          <GreenButton
            title={loading ? "Loading points…" : "Refresh Points"}
            disabled={loading}
            onPress={refresh}
          />
        </>
      )}
    </Page>
  );
}
