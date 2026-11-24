import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useMemosStore } from '../stores/useMemosStore';

export default function MemoEditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const memos = useMemosStore((s) => s.memos);
  const createMemo = useMemosStore((s) => s.createMemo);
  const updateMemo = useMemosStore((s) => s.updateMemo);

  const id = typeof params.id === 'string' ? params.id : undefined;
  const existing = id ? memos.find((m) => m.id === id) : undefined;

  const [content, setContent] = useState('');

  useEffect(() => { if (existing) setContent(existing.content); }, [existing]);

  async function save() {
    const c = content.trim();
    if (!c) { router.back(); return; }
    if (existing) await updateMemo(existing.id, c);
    else await createMemo(c, false);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: existing ? '编辑备忘' : '新建备忘' }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <TextField label="内容" value={content} onChangeText={setContent} placeholder="记下此刻的想法…" multiline style={{ minHeight: 180, textAlignVertical: 'top' }} autoFocus={!existing} />
        <Button label="保存" onPress={save} style={{ marginTop: 16 }} />
      </ScrollView>
    </View>
  );
}
