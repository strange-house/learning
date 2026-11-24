import React from 'react';
import { StyleSheet, Text, type ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';

function TabGlyph({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={[styles.glyph, { color }]}>{glyph}</Text>;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62, paddingTop: 6, paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '今天', tabBarIcon: ({ color }) => <TabGlyph glyph="◎" color={color} /> }} />
      <Tabs.Screen name="plan" options={{ title: '计划', tabBarIcon: ({ color }) => <TabGlyph glyph="▤" color={color} /> }} />
      <Tabs.Screen name="diary" options={{ title: '日记', tabBarIcon: ({ color }) => <TabGlyph glyph="✎" color={color} /> }} />
      <Tabs.Screen name="memo" options={{ title: '备忘', tabBarIcon: ({ color }) => <TabGlyph glyph="◉" color={color} /> }} />
      <Tabs.Screen name="me" options={{ title: '我的', tabBarIcon: ({ color }) => <TabGlyph glyph="⚙" color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({ glyph: { fontSize: 20, lineHeight: 24 } });
