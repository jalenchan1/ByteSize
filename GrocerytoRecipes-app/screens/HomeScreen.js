import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Dimensions
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CalorieProgressBar from '../components/CalorieProgressBar';
import NutritionPie from '../components/NutritionPie';
import NutritionProgressBar from '../components/NutritionProgressBar';

const screenHeight = Dimensions.get('window').height;
const nutrientTargets = {
  calories: { goal: 2200, consumed: 1350 },
  protein: { goal: 140, consumed: 80 },
  carbs: { goal: 250, consumed: 150 },
  fat: { goal: 70, consumed: 40 },
};

export default function HomeScreen() {
  const { protein, carbs, fat, calories } = nutrientTargets;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Macros', title: 'Macros' },
    { key: 'Vitamins', title: 'Vitamins' },
    { key: 'Minerals', title: 'Minerals' },
  ]);

  const MacrosRoute = () => (
  <ScrollView
    contentContainerStyle={styles.page}
    showsVerticalScrollIndicator={true}
  >
    <View style={styles.sectionBox}>
      <Text style={styles.pageTitle}>Macronutrients</Text>
      <NutritionProgressBar name="Protein" consumed={80} goal={140} unit="g" color="#4CAF50" />
      <NutritionProgressBar name="Carbs" consumed={150} goal={250} unit="g" color="#2196F3" />
      <NutritionProgressBar name="Fat" consumed={40} goal={70} unit="g" color="#F44336" />
    </View>
  </ScrollView>
);


  const VitaminsRoute = () => (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={true}>      
      <View style={styles.sectionBox}>
      <Text style={styles.pageTitle}>Vitamins</Text>
      <NutritionProgressBar
        name="Vitamin A"
        consumed={700}
        goal={900}
        unit="mcg"
        color="#FF7043"
      />
      <NutritionProgressBar
        name="Vitamin B6"
        consumed={1.2}
        goal={1.7}
        unit="mg"
        color="#FFB74D"
      />
      <NutritionProgressBar
        name="Vitamin B12"
        consumed={1.6}
        goal={2.4}
        unit="mcg"
        color="#9575CD"
      />
      <NutritionProgressBar
        name="Vitamin C"
        consumed={60}
        goal={90}
        unit="mg"
        color="#4DB6AC"
      />
      <NutritionProgressBar
        name="Vitamin D"
        consumed={10}
        goal={20}
        unit="mcg"
        color="#90CAF9"
      />
      <NutritionProgressBar
        name="Vitamin E"
        consumed={10}
        goal={15}
        unit="mg"
        color="#AED581"
      />
      <NutritionProgressBar
        name="Vitamin K"
        consumed={90}
        goal={120}
        unit="mcg"
        color="#BA68C8"
      />
      <NutritionProgressBar
        name="Folate"
        consumed={250}
        goal={400}
        unit="mcg DFE"
        color="#F06292"
      />
      <NutritionProgressBar
        name="Biotin"
        consumed={20}
        goal={30}
        unit="mcg"
        color="#7986CB"
      />
      <NutritionProgressBar
        name="Niacin"
        consumed={12}
        goal={16}
        unit="mg"
        color="#FFD54F"
      />
    </View>
    </ScrollView>
  );

  const MineralsRoute = () => (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={true}>
      <View style={styles.sectionBox}>
        <Text style={styles.pageTitle}>Minerals</Text>
        <NutritionProgressBar
          name="Calcium"
          consumed={1000}
          goal={1300}
          unit="mg"
          color="#81D4FA"
        />
        <NutritionProgressBar
          name="Iron"
          consumed={14}
          goal={18}
          unit="mg"
          color="#F48FB1"
        />
        <NutritionProgressBar
          name="Magnesium"
          consumed={300}
          goal={420}
          unit="mg"
          color="#B39DDB"
        />
        <NutritionProgressBar
          name="Zinc"
          consumed={8}
          goal={11}
          unit="mg"
          color="#FFCC80"
        />
        <NutritionProgressBar
          name="Potassium"
          consumed={3500}
          goal={4700}
          unit="mg"
          color="#A5D6A7"
        />
        <NutritionProgressBar
          name="Phosphorus"
          consumed={1000}
          goal={1250}
          unit="mg"
          color="#E6EE9C"
        />
        <NutritionProgressBar
          name="Iodine"
          consumed={120}
          goal={150}
          unit="mcg"
          color="#CE93D8"
        />
        <NutritionProgressBar
          name="Selenium"
          consumed={40}
          goal={55}
          unit="mcg"
          color="#FFAB91"
        />
        <NutritionProgressBar
          name="Copper"
          consumed={0.6}
          goal={0.9}
          unit="mg"
          color="#80CBC4"
        />
        <NutritionProgressBar
          name="Manganese"
          consumed={1.5}
          goal={2.3}
          unit="mg"
          color="#FFF176"
        />
    </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    Macros: MacrosRoute,
    Vitamins: VitaminsRoute,
    Minerals: MineralsRoute,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainTitle}>Today's Nutrition Log</Text>

        {/* Calories */}
        <Text style={styles.subtitle}>Calories: {calories.consumed} / {calories.goal}</Text>
        <CalorieProgressBar consumed={calories.consumed} goal={calories.goal} />

        {/* Pie Chart */}
        <Text style={styles.subtitle}>Macronutrient Breakdown</Text>
        <NutritionPie
          macros={{
            protein: { value: protein.consumed, goal: protein.goal },
            carbs: { value: carbs.consumed, goal: carbs.goal },
            fat: { value: fat.consumed, goal: fat.goal },
          }}
        />

        {/* Tabs for nutrient groups */}
        <View style={{ height: 500 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={props => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#4CAF50' }}
                style={{ backgroundColor: 'white' }}
                activeColor="#000"
                inactiveColor="#888"
                labelStyle={{ fontWeight: 'bold' }}
              />
            )}
          />
          <Text style={styles.sectionTitle}>Exercise</Text>
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseText}>Workout: Morning Run 🏃‍♂️</Text>
              <Text style={styles.exerciseText}>Duration: 30 min</Text>
              <Text style={styles.exerciseText}>Calories Burned: 280 kcal</Text>
            </View>

            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseText}>Workout: Upper Body Strength 🏋️‍♀️</Text>
              <Text style={styles.exerciseText}>Duration: 45 min</Text>
              <Text style={styles.exerciseText}>Calories Burned: 400 kcal</Text>
            </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#222',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  page: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  marginTop: 30,
  marginBottom: 10,
  color: '#333',
  },
  exerciseCard: {
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionBox: {
  backgroundColor: '#f9f9f9',
  borderRadius: 12,
  padding: 25,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
  marginBottom: 20,
},
});
