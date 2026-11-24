import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { Txt } from '../components/ui/Txt';
import { Chip } from '../components/bits';
import { useTheme } from '../theme/ThemeProvider';
import { useItemsStore } from '../stores/useItemsStore';
import { CATEGORIES, DEFAULT_CATEGORY, type Category } from '../domain/category';
import { PRIORITIES, DEFAULT_PRIORITY, type Priority } from '../domain/priority';
import { todayKey, addDaysKey, shortDate, friendlyDate } from '../utils/date';

export default function ItemEditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; due?: string }>();
  const items = useItemsStore((s) => s.items);
  const createItem = useItemsStore((s) => s.createItem);
  const updateItem = useItemsStore((s) => s.updateItem);

  const id = typeof params.id === 'string' ? params.id : undefined;
  const existing = id ? items.find((i) => i.id === id) : undefined;
  const today = todayKey();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDueDate(existing.dueDate);
      setCategory(existing.category ?? DEFAULT_CATEGORY);
      setPriority(existing.priority ?? DEFAULT_PRIORITY);
    } else {
      setTitle('');
      const due = typeof params.due === 'string' ? params.due : 'today';
      if (due === 'pool') setDueDate(null);
      else if (due === 'tomorrow') setDueDate(addDaysKey(today, 1));
      else setDueDate(today);
    }
  }, [existing, params.due, today]);

  const isToday = dueDate !== null && dueDate <= today;

  const dateOptions = useMemo(() => {
    const opts: { key: string; label: string; value: string | null }[] = [
      { key: 'pool', label: '待办池', value: null },
      { key: 'today', label: '今天', value: today },
      { key: 'tomorrow', label: '明天', value: addDaysKey(today, 1) },
      { key: 'dayafter', label: '后天', value: addDaysKey(today, 2) },
    ];
    for (let i = 3; i <= 14; i++) {
      const d = addDaysKey(today, i);
      opts.push({ key: d, label: shortDate(d), value: d });
    }
    return opts;
  }, [today]);

  const isStandard = dueDate === null || dateOptions.some((o) => o.value === dueDate);
  const displayOptions = isStandard
    ? dateOptions
    : [{ key: dueDate!, label: friendlyDate(dueDate!), value: dueDate! }, ...dateOptions];

  async function save() {
    const t = title.trim();
    if (!t) return;
    const cat = isToday ? category : null;
    const pri = isToday ? priority : null;
    if (existing) {
      await updateItem({ ...existing, title: t, category: cat, priority: pri, dueDate });
    } else {
      await createItem({ title: t, category: cat, priority: pri, dueDate });
    }
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: existing ? '编辑事项' : '新建事项' }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <TextField label="标题" value={title} onChangeText={setTitle} placeholder="例如：看书 30 分钟" autoFocus={!existing} />

        <Txt variant="caption" style={styles.lbl}>日期（软性 · 不做也没关系）</Txt>
        <View style={styles.chips}>
          {displayOptions.map((o) => (
            <Chip key={o.key} label={o.label} active={dueDate === o.value} onPress={() => setDueDate(o.value)} />
          ))}
        </View>

        {isToday ? (
          <>
            <Txt variant="caption" style={styles.lbl}>分类</Txt>
            <View style={styles.chips}>
              {CATEGORIES.map((c) => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}
            </View>

            <Txt variant="caption" style={styles.lbl}>优先级（A 最低，SSS 最高）</Txt>
            <View style={styles.chips}>
              {PRIORITIES.map((p) => <Chip key={p} label={p} active={priority === p} onPress={() => setPriority(p)} />)}
            </View>
          </>
        ) : null}

        <Button label="保存" onPress={save} style={{ marginTop: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  lbl: { marginBottom: 6, marginLeft: 2, marginTop: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
