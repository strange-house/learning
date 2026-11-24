import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { fontSize } from '../../theme/tokens';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'muted' | 'caption';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  bold?: boolean;
}

const sizes: Record<Variant, number> = {
  display: fontSize.display,
  title: fontSize.xl,
  subtitle: fontSize.lg,
  body: fontSize.md,
  muted: fontSize.sm,
  caption: fontSize.xs,
};

export function Txt({ variant = 'body', color, bold, style, ...rest }: Props) {
  const { colors } = useTheme();
  const defaultColor =
    variant === 'muted' ? colors.textMuted :
    variant === 'caption' ? colors.textMuted :
    variant === 'subtitle' ? colors.textSecondary : colors.text;
  const s: TextStyle = {
    fontSize: sizes[variant],
    color: color ?? defaultColor,
    fontWeight: bold ? '700' : variant === 'title' ? '700' : '400',
  };
  return <Text {...rest} style={[s, style]} />;
}
