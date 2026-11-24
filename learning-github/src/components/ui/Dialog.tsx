import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Dialog({ visible, title, message, confirmLabel = '确定', cancelLabel = '取消', destructive, onConfirm, onCancel }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message ? <Text style={[styles.msg, { color: colors.textSecondary }]}>{message}</Text> : null}
          <View style={styles.row}>
            <Pressable style={[styles.btn, { backgroundColor: colors.surfaceAlt }]} onPress={onCancel}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{cancelLabel}</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: destructive ? colors.danger : colors.primary }]} onPress={onConfirm}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,20,35,0.45)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: { width: '100%', borderRadius: 18, padding: 20 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  msg: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});
