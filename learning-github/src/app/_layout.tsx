import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataTooNewError, ensureDatabaseReady } from '../data/db/localMigration';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useHabitsStore } from '../stores/useHabitsStore';
import { useItemsStore } from '../stores/useItemsStore';
import { useDiaryStore } from '../stores/useDiaryStore';
import { useMemosStore } from '../stores/useMemosStore';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { Txt } from '../components/ui/Txt';

function BootScreen({ message, detail }: { message: string; detail?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.bg }]}>
      <Txt variant="title">Learning</Txt>
      <Txt variant="muted" style={styles.centerText}>{message}</Txt>
      {detail ? <Txt variant="caption" style={styles.centerText}>{detail}</Txt> : null}
    </View>
  );
}

function RootNavigator() {
  const { colors, isDark } = useTheme();
  const modalHeader = {
    presentation: 'modal' as const,
    animation: 'slide_from_bottom' as const,
    headerShown: true,
    headerStyle: { backgroundColor: colors.bg },
    headerTintColor: colors.primary,
    headerTitleStyle: { color: colors.text },
    headerShadowVisible: false,
  };
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="item-edit" options={modalHeader} />
        <Stack.Screen name="habit-edit" options={modalHeader} />
        <Stack.Screen name="diary-edit" options={modalHeader} />
        <Stack.Screen name="memo-edit" options={modalHeader} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [fatal, setFatal] = useState<{ message: string; detail?: string } | null>(null);
  const hydrate = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        await ensureDatabaseReady();
        await hydrate();
        await Promise.all([
          useHabitsStore.getState().load(),
          useItemsStore.getState().load(),
          useDiaryStore.getState().load(),
          useMemosStore.getState().load(),
        ]);
        if (!cancelled) setReady(true);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof AppDataTooNewError) {
          setFatal({ message: '本地数据由更新版本的 App 创建，请先升级 App', detail: e.message });
        } else {
          setFatal({ message: '应用启动失败', detail: e instanceof Error ? e.message : String(e) });
        }
      }
    }
    void boot();
    return () => { cancelled = true; };
  }, [hydrate]);

  if (fatal) {
    return (
      <SafeAreaProvider><ThemeProvider><BootScreen message={fatal.message} detail={fatal.detail} /></ThemeProvider></SafeAreaProvider>
    );
  }
  if (!ready) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <View style={{ flex: 1 }}>
            <BootScreen message="正在准备你的记录…" />
            <View style={styles.loadingDot}><ActivityIndicator /></View>
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  centerText: { textAlign: 'center' },
  loadingDot: { position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center' },
});
