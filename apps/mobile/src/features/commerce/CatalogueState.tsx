import { ScrollView, View } from "react-native";
import { Header } from "../../components/Header";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import {
  ProductSkeletons,
  SkeletonBlock,
  SkeletonPulse,
} from "../../components/LoadingSkeleton";
import { useMobileStore } from "../../services/storeService";

/** Only verified server prices replace these placeholders; bundled prices never flash. */
export function CatalogueState({
  failed,
  onRetry,
  home = false,
  onBack,
  onMenu,
}: {
  failed: boolean;
  onRetry: () => void;
  home?: boolean;
  onBack: () => void;
  onMenu: () => void;
}) {
  const theme = useMobileStore((state) => state.theme);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        premium={home}
        title={home ? undefined : "Loading products"}
        showBack={!home}
        onBack={onBack}
        onMenu={onMenu}
        rightAction="none"
      />
      {failed ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            gap: 18,
          }}
        >
          <Text
            style={{ fontSize: 22, fontWeight: "600", textAlign: "center" }}
          >
            Let’s reconnect
          </Text>
          <Text style={{ textAlign: "center", color: theme.textSecondary }}>
            Check your internet connection and try again.
          </Text>
          <GreenButton
            title="Try again"
            onPress={onRetry}
            style={{ minWidth: 180 }}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 20 }}
          accessibilityLabel="Loading products and current prices"
          accessibilityState={{ busy: true }}
        >
          {home && (
            <SkeletonPulse style={{ gap: 16 }}>
              <SkeletonBlock style={{ height: 235, borderRadius: 24 }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingVertical: 8,
                }}
              >
                {[0, 1, 2].map((key) => (
                  <View key={key} style={{ alignItems: "center", gap: 8 }}>
                    <SkeletonBlock
                      style={{ width: 64, height: 64, borderRadius: 32 }}
                    />
                    <SkeletonBlock style={{ height: 12, width: 64 }} />
                  </View>
                ))}
              </View>
              <SkeletonBlock style={{ height: 55, borderRadius: 20 }} />
            </SkeletonPulse>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 26,
                lineHeight: 32,
                fontFamily: "serif",
                fontWeight: "700",
              }}
            >
              {home ? "Best Sellers" : "Our Products"}
            </Text>
          </View>
          <ProductSkeletons />
          {!home && <ProductSkeletons />}
        </ScrollView>
      )}
    </View>
  );
}
