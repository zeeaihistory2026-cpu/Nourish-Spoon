import { Package, Star } from 'lucide-react-native';
import type { ReactNode } from 'react';

import { colors } from '../../theme';

export const PACKAGE_ICON: ReactNode = (
  <Package size={30} color={colors.goldDark} strokeWidth={1.8} />
);

export const STAR_ICON: ReactNode = <Star size={30} color={colors.goldDark} strokeWidth={1.8} />;
