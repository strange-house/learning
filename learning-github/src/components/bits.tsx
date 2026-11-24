import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Txt } from './ui/Txt';
import { hitSlop, radius } from '../theme/tokens';

export function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <View style={styles.section}>
      <Txt variant="muted" bold>{title}</Txt>
      {note ? <Txt variant="caption">{note}</Txt> : null}
    </View>
  );
}

export function Tag({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: colors.primarySoft }]}>
      <Text style={[styles.tagText, { color: colors.primary }]}>{label}</Text>
    </View>
  );
}

export function PriorityBadge({ priority }: { priority: string | null }) {
  const { colors } = useTheme();
  const p = priority || 'A';
  const fg: Record<string, string> = { A: colors.textMuted, S: colors.success, SS: colors.primary, SSS: colors.warning };
  const bg: Record<string, string> = { A: colors.surfaceAlt, S: colors.successSoft, SS: colors.primarySoft, SSS: colors.warningSoft };
  return (
    <View style={[styles.priority, { backgroundColor: bg[p] || colors.surfaceAlt }]}>
      <Text style={[styles.priorityText, { color: fg[p] || colors.textMuted }]}>{p}</Text>
    </View>
  );
}

export function MoreButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop} style={styles.more}>
      <Text style={{ color: colors.textMuted, fontSize: 20, fontWeight: '700', lineHeight: 22 }}>⋯</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? { backgroundColor: colors.primarySoft, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Text style={[styles.chipText, { color: active ? colors.primary : colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 10, paddingHorizontal: 2 },
  tag: { borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 11, fontWeight: '600' },
  priority: { borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 2, minWidth: 24, alignItems: 'center' },
  priorityText: { fontSize: 11, fontWeight: '800' },
  more: { paddingHorizontal: 6, paddingVertical: 2 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 7, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontWeight: '600' },
});
