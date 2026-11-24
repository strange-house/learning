import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Txt';
import { CheckCircle } from '../../components/ui/CheckCircle';
import { ActionSheet } from '../../components/ui/ActionSheet';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Fab } from '../../components/ui/Fab';
import { SectionTitle, Tag, PriorityBadge, MoreButton } from '../../components/bits';
import { useTheme } from '../../theme/ThemeProvider';
import { useHabitsStore } from '../../stores/useHabitsStore';
import { useItemsStore } from '../../stores/useItemsStore';
import { isHabitDue } from '../../domain/schedule';
import { selectTodayItems, selectFutureItems, sortByPriority } from '../../domain/selectors';
import { todayKey, dayHeader, futureLabel } from '../../utils/date';
import { PRIORITIES } from '../../domain/priority';
import type { Item } from '../../domain/types';

export default function TodayScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const habits = useHabitsStore((s) => s.habits);
  const completedByHabit = useHabitsStore((s) => s.completedByHabit);
  const toggleCompletion = useHabitsStore((s) => s.toggleCompletion);
  const items = useItemsStore((s) => s.items);
  const toggleDone = useItemsStore((s) => s.toggleDone);
  const moveToToday = useItemsStore((s) => s.moveToToday);
  const updateItem = useItemsStore((s) => s.updateItem);
  const deleteItem = useItemsStore((s) => s.deleteItem);

  const [fabOpen, setFabOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<Item | null>(null);
  const [priorityFor, setPriorityFor] = useState<Item | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);

  const today = todayKey();
  const header = dayHeader(today);

  const dueHabits = useMemo(() => habits.filter((h) => isHabitDue(h, today)), [habits, today]);
  const todayItems = useMemo(() => sortByPriority(selectTodayItems(items, today)), [items, today]);
  const futureItems = useMemo(() => selectFutureItems(items, today), [items, today]);

  const doneCount = dueHabits.filter((h) => (completedByHabit[h.id] || []).includes(today)).length + todayItems.filter((i) => i.done).length;
  const totalCount = dueHabits.length + todayItems.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Txt variant="title">{header.date} · {header.weekday}</Txt>
        <Txt variant="muted" style={{ marginTop: 4 }}>已完成 {doneCount} / {totalCount} · 决策成本越低，越容易开始</Txt>
        <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
          <View style={[styles.fill, { width: pct + '%', backgroundColor: colors.primary }]} />
        </View>

        {dueHabits.length > 0 ? (
          <>
            <SectionTitle title="习惯" note="每天自动出现，不用再想" />
            {dueHabits.map((h) => {
              const checked = (completedByHabit[h.id] || []).includes(today);
              return (
                <View key={h.id} style={[styles.row, { backgroundColor: colors.surface }]}>
                  <CheckCircle checked={checked} onPress={() => toggleCompletion(h.id, today)} />
                  <View style={styles.rowBody}>
                    <Txt style={checked ? styles.doneText : null}>{h.title}</Txt>
                    <View style={styles.metaRow}><Tag label={h.category} /></View>
                  </View>
                </View>
              );
            })}
          </>
        ) : null}

        <SectionTitle title="今日计划" note="点 ＋ 添加，做完自己打勾" />
        {todayItems.length === 0 ? (
          <EmptyState icon="🌱" title="今天还没有计划" subtitle="点右下角 ＋，10 秒定一件小事" />
        ) : (
          todayItems.map((item) => (
            <View key={item.id} style={[styles.row, { backgroundColor: colors.surface }]}>
              <CheckCircle checked={item.done} onPress={() => toggleDone(item.id)} />
              <View style={styles.rowBody}>
                <Txt style={item.done ? styles.doneText : null}>{item.title}</Txt>
                <View style={styles.metaRow}>
                  {item.category ? <Tag label={item.category} /> : null}
                  <PriorityBadge priority={item.priority} />
                </View>
              </View>
              <MoreButton onPress={() => setMenuItem(item)} />
            </View>
          ))
        )}

        {futureItems.length > 0 ? (
          <>
            <SectionTitle title="接下来几天" note="软性 · 不做也没关系" />
            {futureItems.map((item) => (
              <View key={item.id} style={[styles.futureRow, { borderColor: colors.border }]}>
                <View style={[styles.futureWhen, { backgroundColor: colors.surfaceAlt }]}><Txt variant="caption">{futureLabel(item.dueDate!)}</Txt></View>
                <View style={styles.rowBody}><Txt variant="muted">{item.title}</Txt></View>
                <Pressable onPress={() => moveToToday(item.id)} style={[styles.softBtn, { backgroundColor: colors.primarySoft }]}>
                  <Txt variant="caption" color={colors.primary} bold>今天做</Txt>
                </Pressable>
                <MoreButton onPress={() => setMenuItem(item)} />
              </View>
            ))}
          </>
        ) : null}
      </Screen>

      <Fab onPress={() => setFabOpen(true)} />

      <ActionSheet
        visible={fabOpen}
        title="添加"
        options={[
          { label: '添加今日计划', onPress: () => router.push('/item-edit?due=today') },
          { label: '添加习惯', onPress: () => router.push('/habit-edit') },
          { label: '记到待办池', onPress: () => router.push('/item-edit?due=pool') },
        ]}
        onClose={() => setFabOpen(false)}
      />

      <ActionSheet
        visible={menuItem !== null}
        title={menuItem ? menuItem.title : undefined}
        options={menuItem ? [
          ...(menuItem.dueDate !== null && menuItem.dueDate <= today
            ? [{ label: '改优先级', onPress: () => { setMenuItem(null); setPriorityFor(menuItem); } }]
            : []),
          { label: '编辑', onPress: () => router.push('/item-edit?id=' + menuItem.id) },
          { label: '删除', destructive: true, onPress: () => { setMenuItem(null); setConfirmDelete(menuItem); } },
        ] : []}
        onClose={() => setMenuItem(null)}
      />

      <ActionSheet
        visible={priorityFor !== null}
        title="选择优先级"
        options={PRIORITIES.slice().reverse().map((p) => ({
          label: p === priorityFor?.priority ? '✓ ' + p : p,
          onPress: async () => { if (priorityFor) await updateItem({ ...priorityFor, priority: p }); setPriorityFor(null); },
        }))}
        onClose={() => setPriorityFor(null)}
      />

      <Dialog
        visible={confirmDelete !== null}
        title="删除这条计划？"
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
  track: { height: 7, borderRadius: 4, overflow: 'hidden', marginTop: 12, marginBottom: 4 },
  fill: { height: '100%', borderRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, marginBottom: 10 },
  rowBody: { flex: 1, minWidth: 0 },
  metaRow: { flexDirection: 'row', gap: 6, marginTop: 5, alignItems: 'center' },
  doneText: { color: '#8A93A6', textDecorationLine: 'line-through' },
  futureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 16, padding: 11, marginBottom: 10 },
  futureWhen: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3 },
  softBtn: { borderRadius: 12, paddingHorizontal: 11, paddingVertical: 7 },
});
