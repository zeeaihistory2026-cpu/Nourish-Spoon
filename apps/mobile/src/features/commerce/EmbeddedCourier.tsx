import { useRef, useState } from "react";

import { ActivityIndicator, View } from "react-native";

import { WebView } from "react-native-webview";

import { GreenButton, Text } from "../../components/DesignPrimitives";

import { useMobileStore } from "../../services/storeService";

export function EmbeddedCourier({
  trackingNumber,
}: {
  trackingNumber: string;
}) {
  const browser = useRef<WebView>(null);

  const { theme } = useMobileStore();

  const [failed, setFailed] = useState(false);

  const digits = /^\d{8,20}$/.test(trackingNumber) ? trackingNumber : "";

  // TCS owns the form and results. Fill only its observed tracking field;

  // the customer still submits the official form and any courier challenge.

  const populate = `(function(){let attempts=0;const timer=setInterval(function(){const input=document.querySelector('input[type="number"][placeholder="Tracking Number"]');if(input){const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,${JSON.stringify(digits)});input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.scrollIntoView({block:'center'});clearInterval(timer);}else if(++attempts>=40){clearInterval(timer);}},250);})();true;`;

  return (
    <View style={{ flex: 1 }}>
      {failed && (
        <View style={{ padding: 18, gap: 12 }}>
          <Text accessibilityRole="alert">
            TCS could not load. Check your internet connection and try again.
          </Text>

          <GreenButton
            title="Retry TCS"

            onPress={() => {
              setFailed(false);

              browser.current?.reload();
            }}
          />
        </View>
      )}

      <WebView
        ref={browser}

        source={{ uri: "https://www.tcsexpress.com/track/" }}

        style={{ flex: 1 }}

        startInLoadingState

        renderLoading={() => (
          <ActivityIndicator
            style={{ position: "absolute", alignSelf: "center", top: 30 }}

            color={theme.primary}
          />
        )}

        injectedJavaScript={digits ? populate : undefined}

        onError={() => setFailed(true)}

        onHttpError={({ nativeEvent }) => {
          if (nativeEvent.statusCode >= 400) setFailed(true);
        }}

        onLoadStart={() => setFailed(false)}

        originWhitelist={["https://*"]}

        onShouldStartLoadWithRequest={({ url }) =>
          url === "about:blank" ||
          /^https:\/\/([a-z0-9-]+\.)*tcsexpress\.com(?:\/|$)/i.test(url)
        }

        setSupportMultipleWindows={false}

        mixedContentMode="never"
      />
    </View>
  );
}
