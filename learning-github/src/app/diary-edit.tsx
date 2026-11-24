import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { useTheme } from '../theme/ThemeProvider';
import { useDiaryStore } from '../stores/useDiaryStore';
import { todayKey, friendlyDate } from '../utils/date';

export default function DiaryEditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const entries = useDiaryStore((s) => s.entries);
  const saveEntry = useDiaryStore((s) => s.saveEntry);
  const deleteEntry = useDiaryStore((s) => s.deleteEntry);

  const date = typeof params.date === 'string' ? params.date : todayKey();
  const existing = entries.find((e) => e.date === date);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (existing) { setTitle(existing.title); setBody(existing.body); }
    else { setTitle(''); setBody(''); }
  }, [date, existing]);

  async function save() {
    if (!body.trim() && !title.trim()) { router.back(); return; }
    await saveEntry(date, title.trim(), body);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: friendlyDate(date) + ' 的日记' }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <TextField label="标题（可选）" value={title} onChangeText={setTitle} placeholder="给今天起个标题" />
        <TextField label="正文" value={body} onChangeText={setBody} placeholder="今天学了什么？想了什么？" multiline style={{ minHeight: 200, textAlignVertical: 'top' }} autoFocus={!existing} />
        <Button label="保存" onPress={save} style={{ marginTop: 16 }} />
        {existing ? <Button label="删除这篇日记" variant="danger" onPress={() => setConfirmDelete(true)} style={{ marginTop: 12 }} /> : null}
      </ScrollView>
      <Dialog
        visible={confirmDelete}
        title="删除这篇日记？"
        confirmLabel="删除"
        destructive
        onConfirm={async () => { await deleteEntry(date); router.back(); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
