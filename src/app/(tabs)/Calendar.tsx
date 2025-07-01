import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { auth, db } from '../../../firebaseConfig';


const formatDate = (date: Date) => date.toISOString().split('T')[0];

const Cal = () => {
  const [markedDates, setMarkedDates] = useState({});
  
  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const tripId = await AsyncStorage.getItem('activeTripId');
        if (!tripId) return;

        const snapshot = await getDocs(collection(db, 'trips', 'EuropeTrip', 'trips'));

        const trips = snapshot.docs
        .map(doc => doc.data())
        .filter(trip => trip.departureTime && trip.arrivalTime);

        if (trips.length === 0) return;

        const dates = trips.map(trip => ({
          departure: new Date(trip.departureTime),
          arrival: new Date(trip.arrivalTime),
        }));

        const start = new Date(Math.min(...dates.map(d => d.departure.getTime())));
        const end = new Date(Math.max(...dates.map(d => d.arrival.getTime())));

        const range: Record<string, any> = {};
        let current = new Date(start);

        const startStr = formatDate(start);
        const endStr = formatDate(end);

        while (formatDate(current) <= endStr) {
          const dateStr = formatDate(current);
          range[dateStr] = {
            startingDay: dateStr === startStr,
            endingDay: dateStr === endStr,
            color: '#70d7c7',
            textColor: 'black',
            disableTouchEvent: true
          };
          current.setDate(current.getDate() + 1);
        }
        setMarkedDates(range);
      };
      fetchTrips();
    }, [])
  );
  return (
    <View className='w-full flex-1 justify-center items-center'>
      <CalendarList
        markingType="period"
        disableAllTouchEventsForDisabledDays = {true}
        markedDates={markedDates}
        minDate={new Date().toISOString()}
        hideExtraDays={true}/>
    </View>
  );
};

export default Cal;