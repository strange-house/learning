import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { Txt } from '../components/ui/Txt';
import { Chip } from '../components/bits';
import { useTheme } from '../theme/ThemeProvider';
import { useHabitsStore } from '../stores/useHabitsStore';
import { CATEGORIES, DEFAULT_CATEGORY, type Category } from '../domain/category';
import type { HabitFrequencyType } from '../domain/types';

const WEEKDAYS = [
  { v: 1, label: '一' }, { v: 2, label: '二' }, { v: 3, label: '三' },
  { v: 4, label: '四' }, { v: 5, label: '五' }, { v: 6, label: '六' }, { v: 7, label: '日' },
];

export default function HabitEditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const habits = useHabitsStore((s) => s.habits);
  const createHabit = useHabitsStore((s) => s.createHabit);
  const updateHabit = useHabitsStore((s) => s.updateHabit);

  const id = typeof params.id === 'string' ? params.id : undefined;
  const existing = id ? habits.find((h) => h.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [freq, setFreq] = useState<HabitFrequencyType>('daily');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setFreq(existing.frequencyType);
      setWeekdays(existing.weekdays);
      setCategory(existing.category);
    }
  }, [existing]);

  function toggleWeekday(v: number) {
    setWeekdays((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  async function save() {
    const t = title.trim();
    if (!t) return;
    const wd = freq === 'weekly' ? weekdays : [];
    if (existing) {
      await updateHabit({ ...existing, title: t, frequencyType: freq, weekdays: wd, category });
    } else {
      await createHabit({ title: t, frequencyType: freq, weekdays: wd, category });
    }
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: existing ? '编辑习惯' : '添加习惯' }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <TextField label="习惯名称" value={title} onChangeText={setTitle} placeholder="例如：每日英语 · 输入输出" autoFocus={!existing} />

        <Txt variant="caption" style={styles.lbl}>频次</Txt>
        <View style={styles.chips}>
          <Chip label="每天" active={freq === 'daily'} onPress={() => setFreq('daily')} />
          <Chip label="每周固定几天" active={freq === 'weekly'} onPress={() => setFreq('weekly')} />
        </View>

        {freq === 'weekly' ? (
          <>
            <Txt variant="caption" style={styles.lbl}>哪几天</Txt>
            <View style={styles.chips}>
              {WEEKDAYS.map((w) => (
                <Chip key={w.v} label={w.label} active={weekdays.includes(w.v)} onPress={() => toggleWeekday(w.v)} />
              ))}
            </View>
          </>
        ) : null}

        <Txt variant="caption" style={styles.lbl}>分类</Txt>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}
        </View>

        <Button label="保存" onPress={save} style={{ marginTop: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  lbl: { marginBottom: 6, marginLeft: 2, marginTop: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
