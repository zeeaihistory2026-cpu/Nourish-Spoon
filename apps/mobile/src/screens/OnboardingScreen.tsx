import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Botanical, ART, GreenButton } from '../components/DesignPrimitives';
import { useMobileStore } from '../services/storeService';
export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const { theme: c } = useMobileStore(); const [index, setIndex] = useState(0);
  const slides = [
    { title: 'Real Ingredients\nReal Nutrition', description: 'Handcrafted with pure, natural ingredients in small batches for your family’s well-being.' },
    { title: 'Freshly Made in\nSmall Batches', description: 'Traditional family recipes, carefully prepared in our Sargodha kitchen with love.' },
    { title: 'Natural Goodness\nDelivered to You', description: 'Same-day delivery in Sargodha and nationwide delivery across Pakistan.' },
  ];
  return <View style={{ flex: 1, backgroundColor: c.background }}><Botanical full />
    <TouchableOpacity accessibilityRole="button" onPress={onComplete} style={{ alignSelf: 'flex-end', padding: 20 }}><Text style={{ color: c.textSecondary, fontSize: 16 }}>Skip</Text></TouchableOpacity>
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
      <Text style={{ fontFamily: 'serif', fontWeight: '700', fontSize: 32, lineHeight: 40, textAlign: 'center', color: c.primary, paddingHorizontal: 10, marginTop: 20 }}>{slides[index].title}</Text>
      <Text style={{ fontSize: 16, lineHeight: 22, color: c.text, textAlign: 'center', paddingHorizontal: 36, marginVertical: 16 }}>{slides[index].description}</Text>
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 7 }}>{[
        { icon: 'leaf-outline', title: '100% Natural\nIngredients' }, { icon: 'hand-heart-outline', title: 'Handcrafted\nFamily Recipes' }, { icon: 'basket-outline', title: 'Small Batch\nFreshness' },
      ].map(b => <View key={b.title} style={{ flex: 1, alignItems: 'center' }}><View style={{ width: 65, height: 65, borderRadius: 35, backgroundColor: c.isDark ? c.surface : '#E4E5C3', alignItems: 'center', justifyContent: 'center' }}><MaterialCommunityIcons name={b.icon as any} size={36} color={c.primary} /></View><Text style={{ textAlign: 'center', fontSize: 12, lineHeight: 16, color: c.text, marginTop: 7 }}>{b.title}</Text></View>)}</View>
      <Image source={ART.onboarding} style={{ width: '100%', aspectRatio: 1.47, marginTop: 12 }} resizeMode="cover" />
    </ScrollView>
    <View style={{ flexDirection: 'row', padding: 22, alignItems: 'center', justifyContent: 'space-between' }}><View style={{ flexDirection: 'row', gap: 14 }}>{slides.map((_, i) => <TouchableOpacity key={i} accessibilityLabel={'Onboarding slide ' + (i+1)} onPress={() => setIndex(i)} style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: i === index ? c.primary : c.border }} />)}</View><GreenButton title={index === 2 ? 'Get Started' : 'Next'} onPress={() => index === 2 ? onComplete() : setIndex(index+1)} style={{ width: '49%' }} /></View>
  </View>;
}

