import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../components/Header';
import { TrustBadges } from '../components/TrustBadges';
import { Text, ART, Rating, GreenButton } from '../components/DesignPrimitives';
import { useMobileStore } from '../services/storeService';
import { formatPKR } from '@packages/utils';
import { Product } from '@packages/types';
interface Props { onNavigateTab: (tab: string) => void; onSelectProduct: (p: Product) => void; onOpenWhatsAppOrder: (p?: Product) => void; onOpenDeliveryInfo: () => void; }
export function HomeScreen({ onNavigateTab, onSelectProduct, onOpenWhatsAppOrder, onOpenDeliveryInfo }: Props) {
  const { theme: c, products, favorites, toggleFavorite } = useMobileStore();
  return <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }}>
    <Header onMenu={() => onNavigateTab('More')} onNotification={() => onNavigateTab('Reviews')} />
    <TouchableOpacity accessibilityRole="button" onPress={onOpenDeliveryInfo} style={[s.delivery, { backgroundColor: c.primaryDark }]}>
      <MaterialCommunityIcons name="truck-delivery" size={30} color="#F4C55D" />
      <View style={{ flex: 1 }}><Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Same-day delivery in Sargodha</Text><Text style={{ color: '#fff', fontSize: 11, marginTop: 3 }}>Freshly made • Direct to your doorstep</Text></View>
      <Ionicons name="chevron-forward" size={22} color="#fff" />
    </TouchableOpacity>
    <View style={s.hero}>
      <Image source={ART.home} style={s.heroImage} resizeMode="cover" />
      <LinearGradient pointerEvents="none" colors={[c.background, c.background, c.isDark ? '#0C1B1280' : '#FFF9EC20', 'transparent']} locations={[0, 0.40, 0.72, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <View style={s.heroCopy}>
        <Text style={[s.heading, { color: c.text }]}>Handcrafted{'\n'}Nutrition.{'\n'}Real Ingredients.{'\n'}<Text style={{ color: '#8E5609', fontFamily: 'serif', fontWeight: '700' }}>Pure Love.</Text></Text>
        <Text style={[s.sub, { color: c.text }]}>Premium Panjeeri & Date-Nut Energy Balls made with pure, natural ingredients for your family’s well-being.</Text>
        <GreenButton title="Order on WhatsApp" whatsapp onPress={() => onOpenWhatsAppOrder(products[0])} style={{ marginTop: 15, width: '100%' }} />
        <TouchableOpacity accessibilityRole="button" onPress={() => onNavigateTab('Products')} style={[s.explore, { borderColor: c.border, backgroundColor: c.surface }]}><Text style={{ color: c.text, fontSize: 14, fontWeight: '700' }}>Explore Products</Text><Ionicons name="arrow-forward" size={20} color={c.text} /></TouchableOpacity>
      </View>
    </View>
    <View style={{ paddingHorizontal: 12 }}>
      <TrustBadges variant="home" />
      <View style={s.section}><Text style={[s.sectionTitle, { color: c.text }]}>Our Signature Products</Text><TouchableOpacity onPress={() => onNavigateTab('Products')}><Text style={{ fontSize: 11, color: c.primary, fontWeight: '700' }}>View All →</Text></TouchableOpacity></View>
      <View style={{ flexDirection: 'row', gap: 8 }}>{products.filter(p => p.active).slice(0, 2).map(p => <TouchableOpacity accessibilityRole="button" accessibilityLabel={p.name} key={p.id} onPress={() => onSelectProduct(p)} style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View><Image source={p.category === 'panjeeri' ? ART.panjeeriCard : ART.energyCard} style={s.cardImage} /><TouchableOpacity accessibilityLabel={'Favorite ' + p.name} onPress={() => toggleFavorite(p.id)} style={s.heart}><Ionicons name={favorites.includes(p.id) ? 'heart' : 'heart-outline'} size={19} color="#EF1747" /></TouchableOpacity></View>
        <View style={{ padding: 9 }}><Text style={{ fontFamily: 'serif', color: c.text, fontWeight: '700', fontSize: 13 }}>{p.name}</Text><Rating product={p} compact /><Text style={{ color: c.textSecondary, fontSize: 11, lineHeight: 15, minHeight: 60 }}>{p.short_description}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}><View><Text style={{ color: c.textSecondary, fontSize: 10 }}>From</Text><Text style={{ fontFamily: 'serif', color: c.primary, fontWeight: '700', fontSize: 19 }}>{formatPKR(p.variants[0].sale_price ?? p.variants[0].regular_price)}</Text></View><TouchableOpacity accessibilityLabel={'Order ' + p.name} onPress={() => onOpenWhatsAppOrder(p)} style={[s.cart, { backgroundColor: c.primaryDark }]}><Ionicons name="cart-outline" size={21} color="#fff" /></TouchableOpacity></View>
        </View>
      </TouchableOpacity>)}</View>
    </View>
  </ScrollView>;
}
const s = StyleSheet.create({ delivery: { marginHorizontal: 12, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#fff' }, hero: { minHeight: 305, position: 'relative', overflow: 'hidden' }, heroImage: { position: 'absolute', width: '50%', right: 0, height: '100%' }, heroCopy: { width: '68%', padding: 18, paddingRight: 4 }, heading: { fontFamily: 'serif', fontWeight: '700', fontSize: 25, lineHeight: 30, letterSpacing: -1 }, sub: { width: '88%', fontSize: 12, lineHeight: 17, marginTop: 9 }, explore: { borderWidth: 1, borderRadius: 25, minHeight: 37, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginTop: 7 }, section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 1, marginBottom: 12 }, sectionTitle: { fontFamily: 'serif', fontSize: 19, fontWeight: '700', letterSpacing: -0.7 }, card: { flex: 1, borderRadius: 13, borderWidth: 1, overflow: 'hidden' }, cardImage: { width: '100%', aspectRatio: 1.76 }, heart: { position: 'absolute', right: 7, top: 6, width: 27, height: 27, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, cart: { width: 32, height: 32, borderRadius: 18, alignItems: 'center', justifyContent: 'center' } });

