import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { Text, Brand, Botanical, ART } from '../components/DesignPrimitives';
import { useMobileStore } from '../services/storeService';
export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { theme } = useMobileStore();
  useEffect(() => { const timer = setTimeout(onFinish, 2200); return () => clearTimeout(timer); }, [onFinish]);
  return <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center' }}>
    <Botanical full />
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}><Brand large /><Text style={{ fontFamily: 'serif', fontSize: 18, textAlign: 'center', color: theme.primary, marginTop: 24 }}>Wholesome Nutrition{'\n'}for Healthier Tomorrows</Text></View>
    <Image source={ART.splash} style={{ width: '100%', height: '45%' }} resizeMode="cover" />
    <Text style={{ fontFamily: 'serif', color: theme.primary, fontSize: 11, paddingVertical: 20 }}>100% Natural   |   Handmade   |   Pakistani Goodness</Text>
  </View>;
}

