import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerComponent from '../.././components/DateTimePickerComponent';

import ParallaxScrollView from '../.././components/ParallaxScrollView';
import { ThemedText } from '../.././components/ThemedText';
import { ThemedView } from '../.././components/ThemedView';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';


export default function travel_summary() {
  const [form, setForm] = useState(false); //to handle form display status
  
  const [name, setName] = useState(''); //name input
  const [type, setType] = useState('Flight'); //travel type input
  const [departure, setDeparture] = useState(''); //departure location input
  const [arrival, setArrival] = useState(''); //arrival location input
  //store the selected datetime in React state variables which can hold either a date object or null:
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);

  const [trips, setTrips] = useState<any[]>([]);

  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentlyEditingTripId, setCurrentlyEditingTripId] = useState<string | null>(null);



  //print departure and arrival input to console
  const handleDepartChange = (date: Date) => {
    setDepartureTime(date); //save selected datetime in state
    console.log('Departure: ', date.toISOString());
  };

  const handleArrivalChange = (date: Date) => {
    setArrivalTime(date); //save selected datetime in state
    console.log('Arrival:', date.toISOString());
  };

  const fetchTrips = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'trips', 'EuropeTrip', 'trips'));
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    docs.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
    setTrips(docs);
  } catch (err) {
    console.error('Error fetching trips:', err);
  }
};

  useEffect(() => {
    fetchTrips();
  }, []);

  const handlePress = () => {
    console.log('Add Trip button pressed');
    setName('');
    setType('Flight');
    setDeparture('');
    setArrival('');
    setDepartureTime(null);
    setArrivalTime(null);
    setForm(true);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not signed in");
      return;
    }

    if (!departureTime || !arrivalTime) {
      Alert.alert("Missing info", "Please select both departure and arrival times.");
      return;
    }

    try {
    const tripData = {
      name,
      type,
      departure,
      arrival,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      createdAt: Timestamp.now(),
      createdBy: user.uid
    };

    const tripDocRef = doc(db, 'trips', 'EuropeTrip'); 
    const tripsCollectionRef = collection(tripDocRef, 'trips'); 

    if (currentlyEditingTripId) {
      await updateDoc(doc(tripsCollectionRef, currentlyEditingTripId), tripData);
      console.log('Trip updated:', tripData);
      await AsyncStorage.setItem('activeTripId', currentlyEditingTripId);
    } else {
      const tripRef = await addDoc(tripsCollectionRef, tripData);
      console.log('Trip created:', tripData);

      await AsyncStorage.setItem('activeTripId', tripRef.id);

      await addDoc(collection(tripDocRef, 'members'), {
        uid: user.uid,
        name: user.displayName,
        email: user.email
      });
    }
    setForm(false);
    setCurrentlyEditingTripId(null);
    fetchTrips();
    } catch (err) {
      console.error('Error saving trip:', err);
      Alert.alert("Error", "Failed to save trip.");
    }
  };

  function addTripFrom() {
    return (
      <View style = {styles.stepContainer}>
        <Text>Member:</Text>
        <TextInput value={name} onChangeText = {setName} style = {styles.stepContainer} />

        <Text>Mode of Travel:</Text>
        <Picker selectedValue={type} onValueChange={setType} style={styles.stepContainer}>
          <Picker.Item label = "Flight" value = "Flight" />
          <Picker.Item label = "Train" value = "Train" />
          <Picker.Item label = "Bus" value = "Bus" />
          <Picker.Item label = "Drive" value = "Drive" />
          <Picker.Item label = "Ferry" value = "Ferry" />
          <Picker.Item label = "Bicycle" value = "Bicycle" />
          <Picker.Item label = "Walk" value = "Walk" />
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
          {trips.length > 0 && (
          <ScrollView horizontal>
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={styles.cell}>Name</Text>
                <Text style={styles.cell}>Type</Text>
                <Text style={styles.cell}>Departure</Text>
                <Text style={styles.cell}>Arrival</Text>
              </View>
              {trips.map(trip => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => {
                      setSelectedTrip(trip);
                      setEditModalVisible(true);
                    }}>
                  <View style={styles.row}>
                    <Text style={styles.cell}>{trip.name}</Text>
                    <Text style={styles.cell}>{trip.type}</Text>
                    <Text style={styles.cell}>{new Date(trip.departureTime).toLocaleString()}</Text>
                    <Text style={styles.cell}>{new Date(trip.arrivalTime).toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
          )}
          <ThemedView style={styles.stepContainer}>
            <Button title="Add Trip" onPress = {handlePress} />
            <Modal visible={form} animationType="slide" transparent={true}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ScrollView contentContainerStyle={styles.stepContainer}>
                    {addTripFrom()}
                      <Button title="Cancel" onPress={() => setForm(false)} />
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </ThemedView>

          <Modal visible={editModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedTrip && (<>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Trip Details</Text>
                  <Text>Name: {selectedTrip.name}</Text>
                  <Text>Type: {selectedTrip.type}</Text>
                  <Text>From: {selectedTrip.departure}</Text>
                  <Text>To: {selectedTrip.arrival}</Text>
                  <Text>Departs: {new Date(selectedTrip.departureTime).toLocaleString()}</Text>
                  <Text>Arrives: {new Date(selectedTrip.arrivalTime).toLocaleString()}</Text>
              <View style={{ marginTop: 20 }}>        
                <Button title="Edit" onPress={() => {
                  setName(selectedTrip.name);
                  setType(selectedTrip.type);
                  setDeparture(selectedTrip.departure);
                  setArrival(selectedTrip.arrival);
                  setDepartureTime(new Date(selectedTrip.departureTime));
                  setArrivalTime(new Date(selectedTrip.arrivalTime));
                  setCurrentlyEditingTripId(selectedTrip.id); 
                  setForm(true);
                  setEditModalVisible(false);
                }}/>
              <View style={{ marginVertical: 5 }} />
                <Button
                  title="Delete"
                  color="red"
                  onPress={async () => {
                    try {
                      await deleteDoc(doc(db, 'trips', 'EuropeTrip', 'trips', selectedTrip.id));
                      setEditModalVisible(false);
                      setSelectedTrip(null);
                      fetchTrips();
                    } catch (err) {
                      console.error('Error deleting trip:', err);
                      Alert.alert("Error", "Failed to delete trip.");
                    }
                  }}/>
                <View style={{ marginVertical: 5 }} />
                  <Button title="Close" onPress={() => setEditModalVisible(false)} />
                </View>
              </>
              )}
              </View>
            </View>
          </Modal>
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
  },
  table: {
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  cell: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    minWidth: 120
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
});