import React from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Txt';
import { SectionTitle } from '../../components/bits';
import { useTheme } from '../../theme/ThemeProvider';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useHabitsStore } from '../../stores/useHabitsStore';
import { useItemsStore } from '../../stores/useItemsStore';
import { useDiaryStore } from '../../stores/useDiaryStore';
import { useMemosStore } from '../../stores/useMemosStore';
import { exportBackup, importBackup } from '../../services/backupService';

export default function MeScreen() {
  const { colors } = useTheme();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);
  const habits = useHabitsStore((s) => s.habits);
  const completedDays = useHabitsStore((s) => s.completedDays);

  async function reloadAll() {
    await useSettingsStore.getState().hydrate();
    await Promise.all([
      useHabitsStore.getState().load(),
      useItemsStore.getState().load(),
      useDiaryStore.getState().load(),
      useMemosStore.getState().load(),
    ]);
  }

  async function handleExport() {
    try {
      await exportBackup();
    } catch (e) {
      Alert.alert('导出失败', e instanceof Error ? e.message : String(e));
    }
  }

  async function handleImport() {
    try {
      const ok = await importBackup();
      if (ok) {
        await reloadAll();
        Alert.alert('导入成功', '数据已恢复');
      }
    } catch (e) {
      Alert.alert('导入失败', e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <Screen>
      <Txt variant="title">我的</Txt>

      <SectionTitle title="习惯完成" />
      {habits.length === 0 ? (
        <Txt variant="muted" style={{ paddingVertical: 8 }}>还没有习惯，去「今天」页添加吧</Txt>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {habits.map((h, i) => (
            <View key={h.id} style={[styles.habitStat, i > 0 ? { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth } : null]}>
              <Txt>{h.title}</Txt>
              <Txt color={colors.primary} bold>完成 {completedDays(h.id)} 天</Txt>
            </View>
          ))}
        </View>
      )}

      <SectionTitle title="设置" />
      <Pressable style={[styles.setting, { backgroundColor: colors.surface }]} onPress={() => setDarkMode(!darkMode)}>
        <Txt>🌙 深色模式</Txt>
        <Switch value={darkMode} onValueChange={(v) => setDarkMode(v)} trackColor={{ true: colors.primary, false: colors.border }} />
      </Pressable>
      <Pressable style={[styles.setting, { backgroundColor: colors.surface }]} onPress={handleExport}>
        <Txt>📤 导出备份</Txt>
        <Txt variant="muted">JSON ›</Txt>
      </Pressable>
      <Pressable style={[styles.setting, { backgroundColor: colors.surface }]} onPress={handleImport}>
        <Txt>📥 导入备份</Txt>
        <Txt variant="muted">›</Txt>
      </Pressable>

      <Txt variant="caption" style={{ textAlign: 'center', marginTop: 28, lineHeight: 18 }}>
        Learning v1.0.0
      </Txt>
      <Txt variant="caption" style={{ textAlign: 'center', marginTop: 4 }}>
        完全离线 · 数据只在本机
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 4 },
  habitStat: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, padding: 15, marginBottom: 10 },
});
