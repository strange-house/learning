import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export function CheckCircle({ checked, onPress }: { checked: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.c, checked ? { backgroundColor: colors.success, borderColor: colors.success } : { borderColor: colors.border }]}
    >
      {checked ? <Text style={styles.tick}>✓</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  c: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  tick: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', lineHeight: 16 },
});
