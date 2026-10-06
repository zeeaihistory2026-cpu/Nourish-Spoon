import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  FileText,
  Heart,
  House,
  ShoppingBag,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../ui/AppText';
import { colors } from '../../theme';

const ICONS: Record<string, LucideIcon> = {
  Home: House,
  Products: ShoppingBag,
  Reviews: Heart,
  About: FileText,
  More: User,
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name];
        const label = descriptors[route.key]?.options.tabBarLabel ?? route.name;
        if (!Icon) {
          return null;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const tint = focused ? colors.greenDark : colors.textMid;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={typeof label === 'string' ? label : route.name}
            onPress={onPress}
            style={styles.tab}
          >
            <Icon size={22} color={tint} strokeWidth={focused ? 2.2 : 1.9} />
            <AppText variant="tab" style={{ color: tint }}>
              {typeof label === 'string' ? label : route.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
});
