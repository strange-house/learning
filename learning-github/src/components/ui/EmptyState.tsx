import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Txt } from './Txt';

export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Txt style={styles.icon}>{icon}</Txt>
      <Txt variant="subtitle" style={styles.t}>{title}</Txt>
      {subtitle ? <Txt variant="muted" style={styles.s}>{subtitle}</Txt> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  icon: { fontSize: 34, marginBottom: 8 },
  t: { fontWeight: '700', marginBottom: 4 },
  s: { textAlign: 'center', lineHeight: 18 },
});
