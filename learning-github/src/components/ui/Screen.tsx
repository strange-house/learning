import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
}

export function Screen({ children, scroll = true, contentContainerStyle }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 88, paddingHorizontal: 16 };
  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={[pad, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.root, { backgroundColor: colors.bg }, pad, contentContainerStyle]}>{children}</View>;
}

const styles = StyleSheet.create({ root: { flex: 1 } });
