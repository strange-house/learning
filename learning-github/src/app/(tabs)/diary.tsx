import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Txt';
import { EmptyState } from '../../components/ui/EmptyState';
import { Fab } from '../../components/ui/Fab';
import { useTheme } from '../../theme/ThemeProvider';
import { useDiaryStore } from '../../stores/useDiaryStore';
import { todayKey, friendlyDate } from '../../utils/date';

export default function DiaryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const entries = useDiaryStore((s) => s.entries);
  const today = todayKey();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Txt variant="title">日记</Txt>
        <Txt variant="muted" style={{ marginTop: 4, marginBottom: 16 }}>一天一篇，自由记录</Txt>
        {entries.length === 0 ? (
          <EmptyState icon="📔" title="还没有日记" subtitle="记录今天学了什么、想了什么" />
        ) : (
          entries.map((e) => (
            <Pressable key={e.date} onPress={() => router.push('/diary-edit?date=' + e.date)} style={[styles.item, { backgroundColor: colors.surface }]}>
              <View style={styles.head}>
                <Txt variant="subtitle" bold>{e.title || '无标题'}</Txt>
                <Txt variant="caption">{friendlyDate(e.date)}</Txt>
              </View>
              <Txt variant="muted" numberOfLines={2} style={{ marginTop: 4 }}>{e.body || '（空）'}</Txt>
            </Pressable>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push('/diary-edit?date=' + today)} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { borderRadius: 16, padding: 15, marginBottom: 10 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
