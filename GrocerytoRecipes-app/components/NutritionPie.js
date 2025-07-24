import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as d3Shape from 'd3-shape';

const colors = {
  protein: '#4CAF50',
  carbs: '#2196F3',
  fat: '#FFC107',
};

export default function NutritionPie({ macros, radius = 100 }) {
  const total = macros.protein.value + macros.carbs.value + macros.fat.value;

  const data = [
    { key: 'Protein', value: macros.protein.value, color: colors.protein },
    { key: 'Carbs', value: macros.carbs.value, color: colors.carbs },
    { key: 'Fat', value: macros.fat.value, color: colors.fat },
  ];

  const arcs = d3Shape.pie().value(d => d.value)(data);
  const arcGen = d3Shape.arc()
    .outerRadius(radius)
    .innerRadius(radius * 0.6);

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        <G x={radius} y={radius}>
          {arcs.map((arc, i) => {
            const path = arcGen(arc);
            const midAngle = (arc.startAngle + arc.endAngle) / 2;
            const labelX = Math.cos(midAngle) * (radius * 0.75);
            const labelY = Math.sin(midAngle) * (radius * 0.75);
            const percent = total ? Math.round((arc.data.value / total) * 100) : 0;

            return (
              <G key={i}>
                <Path d={path} fill={arc.data.color} />
              </G>
            );
          })}
        </G>
      </Svg>

      <View style={styles.centerLabel}>
        <Text style={[styles.centerText, { color: colors.protein }]}>Protein: {Math.round(macros.protein.value / total * 100)}%</Text>
        <Text style={[styles.centerText, { color: colors.carbs }]}>Carbs: {Math.round(macros.carbs.value / total * 100)}%</Text>
        <Text style={[styles.centerText, { color: colors.fat }]}>Fat: {Math.round(macros.fat.value / total * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  centerLabel: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
