import React from "react";
import { View } from "react-native";
import { Text } from "../../components/DesignPrimitives";
export function EmbeddedCourier({
  trackingNumber,
}: {
  trackingNumber: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      {!!trackingNumber && (
        <Text
          style={{ paddingHorizontal: 18, paddingBottom: 10, fontSize: 12 }}
        >
          In this browser preview, paste your copied number below. The Android
          app fills the TCS field automatically.
        </Text>
      )}
      {React.createElement("iframe", {
        src: "https://www.tcsexpress.com/track/",
        title: "Official TCS shipment tracking",
        style: { width: "100%", height: "100%", flex: 1, border: 0 },
        referrerPolicy: "strict-origin-when-cross-origin",
      })}
    </View>
  );
}
