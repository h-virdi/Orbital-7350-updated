import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePickerComponent from '../.././components/DateTimePickerComponent';

import ParallaxScrollView from '../.././components/ParallaxScrollView';
import { ThemedText } from '../.././components/ThemedText';
import { ThemedView } from '../.././components/ThemedView';

export default function travel_summary() {
  const [form, setForm] = useState(false); //to handle form display status
  
  const [name, setName] = useState(''); //name input
  const [type, setType] = useState('flight'); //travel type input
  const [departure, setDeparture] = useState(''); //departure location input
  const [arrival, setArrival] = useState(''); //arrival location input
  //store the selected datetime in React state variables which can hold either a date object or null:
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);


  //print departure and arrival input to console
  const handleDepartChange = (date: Date) => {
    setDepartureTime(date); //save selected datetime in state
    console.log('Departure: ', date.toISOString());
  };

  const handleArrivalChange = (date: Date) => {
    setArrivalTime(date); //save selected datetime in state
    console.log('Arrival:', date.toISOString());
  };
  

  function addTripFrom() {
    return (
      <View style = {styles.stepContainer}>
        <Text>Member:</Text>
        <TextInput value={name} onChangeText = {setName} style = {styles.stepContainer} />

        <Text>Mode of Travel:</Text>
        <Picker selectedValue={type} onValueChange={setType} style={styles.stepContainer}>
          <Picker.Item label = "Flight" value = "flight" />
          <Picker.Item label = "Train" value = "train" />
          <Picker.Item label = "Bus" value = "bus" />
          <Picker.Item label = "Drive" value = "drive" />
          <Picker.Item label = "Ferry" value = "ferry" />
          <Picker.Item label = "Bicycle" value = "bicycle" />
          <Picker.Item label = "Walk" value = "walk" />
        </Picker>

        <Text> Departing from:</Text>
        <TextInput value={departure} onChangeText={setDeparture} style = {styles.stepContainer} />

        <Text> Arriving at:</Text>
        <TextInput value={arrival} onChangeText={setArrival} style = {styles.stepContainer} />

        <DateTimePickerComponent label = "Departure" onChange = {handleDepartChange} />
        <DateTimePickerComponent label = "Arrival" onChange={handleArrivalChange} />
        
        <Button title = "Submit" onPress = {handleSubmit} />

      </View>
    )
  }
  
  const handlePress = () => {
    console.log('Button pressed');
    setForm(true); //display the form
  };

  const handleSubmit = () => {
    console.log({
      name,
      type,
      departure,
      arrival,
      departureTime,
      arrivalTime,
    }); //display the input info
    setForm(false); //close form after submission
  };
  
  return (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#FFEAD1', dark: '#F28350' }}
          headerImage={
            <Image
              source={require('@/assets/images/airplane.png')}
              style={styles.airplane}
            />
          }>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Travel Summary</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <Button title="Add Trip" onPress = {handlePress} />
            {form && addTripFrom()}
          </ThemedView>
        </ParallaxScrollView>
      );
    }
    
    const styles = StyleSheet.create({
      titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      stepContainer: {
        gap: 8,
        marginBottom: 8,
      },
      reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
      },
      airplane: {
        height: 200,
        width: 600,
        bottom: 0,
        left: -200,
        position: 'absolute'
    }
    });