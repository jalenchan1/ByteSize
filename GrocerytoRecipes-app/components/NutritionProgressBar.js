import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NutritionProgressBar({ name, consumed, goal, color }) {
  const percent = Math.min(consumed / goal, 1);
  const percentageLabel = Math.round((consumed / goal) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color }]}>{name}</Text>
        <Text style={styles.amount}>{consumed}g / {goal}g ({percentageLabel}%)</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${percent * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontWeight: 'bold', fontSize: 16 },
  amount: { fontSize: 14, color: '#444' },
  bar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});