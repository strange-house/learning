import React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Txt } from './Txt';

interface Props extends TextInputProps {
  label?: string;
}

export function TextField({ label, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? <Txt variant="caption" style={styles.label}>{label}</Txt> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6, marginLeft: 2 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
});
