import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


//type annotations
type Activity = { //(tuples)
  time: string;
  activity: string;
};

type Day = {
  id: number; //day number of the trip
  activities: Activity[]; //array of tuples
};

export default function App() {
  const [itinerary, setItinerary] = useState([
      { id: 1, activities: [{ time: '', activity: '' }] } //initalise day 1 with 1 empty time slot (array of tuples: {time, activity})
    ]);
    const [showPicker, setShowPicker] = useState<{  //tracks which time slot of which day is currrently being edited
      dayId: number | null;
      index: number | null;
    }>({ dayId: null, index: null });

    

    return (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginBottom: 70,
  },
  text: {
    fontSize: 42,
    padding: 12,
  },
});