import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
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

export default function ItineraryScreen() {
  const [itinerary, setItinerary] = useState([
    { id: 1, activities: [{ time: '', activity: '' }] } //initalise day 1 with 1 empty time slot (array of tuples: {time, activity})
  ]);
  const [showPicker, setShowPicker] = useState<{  //tracks which time slot of which day is currrently being edited
    dayId: number | null;
    index: number | null;
  }>({ dayId: null, index: null });

  const [selectedTime, setSelectedTime] = useState<Date>(new Date()); //to store the most recently selected time
  
  const onTimeChange = (event: any, date?: Date) => { //when a user selects a time
    if (!date) return;
    const timeString = date.toTimeString().slice(0, 5); //time formatting
    setItinerary(prev =>
      prev.map(day =>
        day.id === showPicker.dayId
          ? {
              ...day,
              slots: day.activities.map((slot: Activity, i: number) =>
                i === showPicker.index ? { ...slot, time: timeString } : slot
              ),
            }
          : day
      )
    ); //updates the time of the specific slot with matching dayId and index
    setShowPicker({ dayId: null, index: null }); // hide time picker
  };

  const addDay = () => { //adds a new day with a single blank time slot
    setItinerary([...itinerary, { id: Date.now(), activities: [] }]);
  };

  const removeDay = (id: number) => { //removes a specific day with the matching dayId
    setItinerary(itinerary.filter(day => day.id !== id)); //only keep the days that do not match the specified dayId
  };

  const addTimeSlot = (dayId: number) => {
    setItinerary(itinerary.map(day =>
      day.id === dayId
        ? { ...day, activities: [...day.activities, { time: '', activity: '' }] } //to the current day. add another element to the array of activity tuples
        : day //do nothing if there is already a slot at the specified dayId and index
    ));
  };

  const updateActivity = (dayId: number, index: number, field: 'activity' | 'time', value: string) => {
    setItinerary(itinerary.map(day =>
      day.id === dayId
        ? {
            ...day,
            activities: day.activities.map((slot, i) =>
              i === index ? { ...slot, [field]: value } : slot //change the activity element of the tuple matching the dayId and index
            )
          }
        : day
    ));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.containerScroll} edges={['top']}>
    <ScrollView className='flex-1 py-12 px-7'>
      {itinerary.map((day, dayIdx) => (
        <View key={day.id} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>Day {dayIdx + 1}</Text>
          {day.activities.map((slot, i) => (
            <View key={i} style={styles.row}>
              <Pressable onPress={() => setShowPicker({ dayId: day.id, index: i })}>
                <Text style={styles.timeBox}>{slot.time || 'Set Time'}</Text>
              </Pressable>
              <TextInput //input the activity
                style={styles.input}
                placeholder="Activity"
                value={slot.activity}
                onChangeText={text => updateActivity(day.id, i, 'activity', text)}
              />
            </View>
          ))}
          <Button title="Add Time Slot" onPress={() => addTimeSlot(day.id)} />
          <Button title="Delete Day" color="red" onPress={() => removeDay(day.id)} />
        </View>
      ))}
      <Button title="Add Day" onPress={addDay} />

      {showPicker.dayId !== null && (
        <DateTimePicker
          mode="time"
          is24Hour={true}
          value={new Date()}
          onChange={(_, selectedTime) => {
            if (selectedTime) {
              updateActivity(showPicker.dayId!, showPicker.index!, 'time', selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            }
            setShowPicker({ dayId: null, index: null });
          }}
        />
      )}
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'white',
    marginBottom:100,
  },
  container: {
    padding: 16,
  },
  dayContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 4,
    marginLeft: 8,
  },
  timeBox: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  scroll: {
    padding: 16,
    flexGrow: 1,
  },
});
