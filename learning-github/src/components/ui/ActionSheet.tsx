import React from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface ActionOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface Props {
  visible: boolean;
  title?: string;
  options: ActionOption[];
  onClose: () => void;
}

export function ActionSheet({ visible, title, options, onClose }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
          {title ? <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text> : null}
          {options.map((o, i) => (
            <Pressable
              key={i}
              style={[styles.opt, i > 0 ? { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth } : null]}
              onPress={() => { onClose(); o.onPress(); }}
            >
              <Text style={{ color: o.destructive ? colors.danger : colors.text, fontSize: 16, fontWeight: '600' }}>{o.label}</Text>
            </Pressable>
          ))}
          <Pressable style={[styles.opt, styles.cancel, { borderTopColor: colors.border }]} onPress={onClose}>
            <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: '600' }}>取消</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,20,35,0.45)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 24 },
  title: { textAlign: 'center', paddingTop: 16, paddingBottom: 4, fontSize: 12, fontWeight: '600' },
  opt: { paddingVertical: 16, alignItems: 'center' },
  cancel: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 4 },
});
