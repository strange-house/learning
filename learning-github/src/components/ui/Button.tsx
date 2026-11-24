import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  const { colors } = useTheme();
  let bg = colors.primary;
  let fg = colors.onPrimary;
  if (variant === 'ghost') { bg = colors.surfaceAlt; fg = colors.text; }
  if (variant === 'danger') { bg = colors.danger; fg = '#FFFFFF'; }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 }, style]}
    >
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 16, alignItems: 'center' },
  label: { fontSize: 15, fontWeight: '700' },
});
