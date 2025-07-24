import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalorieProgressBar({ consumed, goal }) {
  const percentage = Math.min(consumed / goal, 1);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.fill, { width: `${percentage * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
});
