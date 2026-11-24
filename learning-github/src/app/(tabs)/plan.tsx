import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Txt';
import { ActionSheet } from '../../components/ui/ActionSheet';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Fab } from '../../components/ui/Fab';
import { SectionTitle, MoreButton } from '../../components/bits';
import { useTheme } from '../../theme/ThemeProvider';
import { useItemsStore } from '../../stores/useItemsStore';
import { selectPoolItems, selectFutureItems } from '../../domain/selectors';
import { todayKey, futureLabel } from '../../utils/date';
import type { Item } from '../../domain/types';

export default function PlanScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const items = useItemsStore((s) => s.items);
  const moveToToday = useItemsStore((s) => s.moveToToday);
  const moveToTomorrow = useItemsStore((s) => s.moveToTomorrow);
  const deleteItem = useItemsStore((s) => s.deleteItem);

  const [fabOpen, setFabOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<Item | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);

  const today = todayKey();
  const pool = useMemo(() => selectPoolItems(items), [items]);
  const future = useMemo(() => selectFutureItems(items, today), [items, today]);

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Txt variant="title">计划</Txt>
        <Txt variant="muted" style={{ marginTop: 4, marginBottom: 8 }}>想做的事先丢进来，有空再挑，别急着排满</Txt>

        <SectionTitle title="待办池" note="不设日期 · 无压力" />
        {pool.length === 0 ? (
          <EmptyState icon="🧺" title="待办池是空的" subtitle="想起什么就记进来，不用现在决定哪天做" />
        ) : (
          pool.map((item) => (
            <View key={item.id} style={[styles.row, { backgroundColor: colors.surface }]}>
              <View style={styles.rowBody}><Txt>{item.title}</Txt></View>
              <Pressable onPress={() => moveToTomorrow(item.id)} style={[styles.miniBtn, { backgroundColor: colors.surfaceAlt }]}>
                <Txt variant="caption">排到明天</Txt>
              </Pressable>
              <Pressable onPress={() => moveToToday(item.id)} style={[styles.miniBtn, { backgroundColor: colors.successSoft }]}>
                <Txt variant="caption" color={colors.success} bold>今天做</Txt>
              </Pressable>
              <MoreButton onPress={() => setMenuItem(item)} />
            </View>
          ))
        )}

        <SectionTitle title="接下来几天" note="软性安排" />
        {future.length === 0 ? (
          <EmptyState icon="🍃" title="没有排期" subtitle="可以把待办池里的东西排到明天" />
        ) : (
          future.map((item) => (
            <View key={item.id} style={[styles.futureRow, { borderColor: colors.border }]}>
              <View style={[styles.futureWhen, { backgroundColor: colors.surfaceAlt }]}><Txt variant="caption">{futureLabel(item.dueDate!)}</Txt></View>
              <View style={styles.rowBody}><Txt variant="muted">{item.title}</Txt></View>
              <Pressable onPress={() => moveToToday(item.id)} style={[styles.miniBtn, { backgroundColor: colors.primarySoft }]}>
                <Txt variant="caption" color={colors.primary} bold>今天做</Txt>
              </Pressable>
              <MoreButton onPress={() => setMenuItem(item)} />
            </View>
          ))
        )}
      </Screen>

      <Fab onPress={() => setFabOpen(true)} />

      <ActionSheet
        visible={fabOpen}
        title="添加"
        options={[
          { label: '记到待办池', onPress: () => router.push('/item-edit?due=pool') },
          { label: '安排到未来某天', onPress: () => router.push('/item-edit?due=tomorrow') },
        ]}
        onClose={() => setFabOpen(false)}
      />

      <ActionSheet
        visible={menuItem !== null}
        title={menuItem ? menuItem.title : undefined}
        options={menuItem ? [
          { label: '编辑', onPress: () => router.push('/item-edit?id=' + menuItem.id) },
          { label: '删除', destructive: true, onPress: () => { setMenuItem(null); setConfirmDelete(menuItem); } },
        ] : []}
        onClose={() => setMenuItem(null)}
      />

      <Dialog
        visible={confirmDelete !== null}
        title="删除这条事项？"
        message={confirmDelete ? confirmDelete.title : ''}
        confirmLabel="删除"
        destructive
        onConfirm={async () => { if (confirmDelete) await deleteItem(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 16, padding: 13, marginBottom: 10 },
  rowBody: { flex: 1, minWidth: 0 },
  miniBtn: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  futureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 16, padding: 11, marginBottom: 10 },
  futureWhen: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3 },
});
