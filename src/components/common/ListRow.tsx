import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { FONT_FAMILY, colors } from '../../theme';

interface ListRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  chevron?: boolean;
  trailing?: ReactNode;
  onPress?: () => void;
}

export function ListRow({ icon, label, value, danger, chevron, trailing, onPress }: ListRowProps) {
  const tint = danger ? colors.danger : colors.greenMid;
  const content = (
    <>
      {icon}
      <AppText variant="body" style={[styles.label, danger && { color: colors.danger }]}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="caption" color="textLight" style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {trailing}
      {chevron ? <ChevronRight size={15} color={colors.chevron} strokeWidth={2} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderRow,
  },
  label: {
    fontSize: 13.5,
    lineHeight: 19,
    fontFamily: FONT_FAMILY.body.regular,
    flexShrink: 1,
  },
  value: {
    marginLeft: 'auto',
  },
});
