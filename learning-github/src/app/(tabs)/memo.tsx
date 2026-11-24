import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Txt';
import { ActionSheet } from '../../components/ui/ActionSheet';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Fab } from '../../components/ui/Fab';
import { MoreButton } from '../../components/bits';
import { useTheme } from '../../theme/ThemeProvider';
import { useMemosStore } from '../../stores/useMemosStore';
import { formatCreatedAt } from '../../utils/format';
import type { Memo } from '../../domain/types';

export default function MemoScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const memos = useMemosStore((s) => s.memos);
  const togglePin = useMemosStore((s) => s.togglePin);
  const deleteMemo = useMemosStore((s) => s.deleteMemo);

  const [menuMemo, setMenuMemo] = useState<Memo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Memo | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Txt variant="title">备忘</Txt>
        <Txt variant="muted" style={{ marginTop: 4, marginBottom: 16 }}>奇思妙想随手记，可置顶提醒</Txt>
        {memos.length === 0 ? (
          <EmptyState icon="💡" title="还没有备忘" subtitle="记下此刻的想法，别让它溜走" />
        ) : (
          memos.map((m) => (
            <View key={m.id} style={[styles.card, { backgroundColor: m.pinned ? colors.warningSoft : colors.surface }]}>
              <Pressable onPress={() => togglePin(m.id)} hitSlop={8} style={styles.pin}>
                <Txt style={{ opacity: m.pinned ? 1 : 0.3 }}>📌</Txt>
              </Pressable>
              <Txt style={{ paddingRight: 28 }}>{m.content}</Txt>
              <View style={styles.metaRow}>
                <Txt variant="caption">创建于 {formatCreatedAt(m.createdAt)}</Txt>
                <MoreButton onPress={() => setMenuMemo(m)} />
              </View>
            </View>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push('/memo-edit')} />

      <ActionSheet
        visible={menuMemo !== null}
        options={menuMemo ? [
          { label: '再编辑', onPress: () => router.push('/memo-edit?id=' + menuMemo.id) },
          { label: '删除', destructive: true, onPress: () => { setMenuMemo(null); setConfirmDelete(menuMemo); } },
        ] : []}
        onClose={() => setMenuMemo(null)}
      />

      <Dialog
        visible={confirmDelete !== null}
        title="删除这条备忘？"
        confirmLabel="删除"
        destructive
        onConfirm={async () => { if (confirmDelete) await deleteMemo(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 15, marginBottom: 10 },
  pin: { position: 'absolute', top: 10, right: 12, zIndex: 2, padding: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
});
