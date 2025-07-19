import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, Button, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebaseConfig';
import AgendaItem from '../mocks/AgendaItem';
import { getTheme, lightThemeColor, themeColor } from '../mocks/theme';
import testIDs from '../testIDs';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');

interface Props {
  weekView?: boolean;
}

interface EventData {
  id: string;
  date: string;
  activity: string;
  hour: string;
  duration: string;
  address: string;
}

const AgendaInfiniteListScreen = (props: Props) => {
  const [items, setItems] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [fVisible, setFVisible] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [currentlyEditingEventId, setCurrentlyEditingEventId] = useState<string | null>(null);

  const fetchEvents = async () => {
    const tripId = await AsyncStorage.getItem('activeTripId');
    if (!tripId) {
      Alert.alert("Error", "Trip ID not found.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const snapshot = await getDocs(collection(db, 'trips', tripId, 'events'));
      const docs: EventData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<EventData, 'id'>)
      }));
      const grouped: Record<string, any[]> = {};
      docs.forEach(event => {
        if (!event.date) return;
        if (!grouped[event.date]) grouped[event.date] = [];

        grouped[event.date].push({
          title: event.activity,
          hour: event.hour,
          duration: event.duration,
          address: event.address,
          id: event.id,
        });

        Object.values(grouped).forEach(eventsArray => {
          eventsArray.sort((a, b) => {
          const timeA = a.hour?.split(':').map(Number) || [0, 0];
          const timeB = b.hour?.split(':').map(Number) || [0, 0];
          return timeA[0] - timeB[0] || timeA[1] - timeB[1];
          });
        });
      });

      const structured = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => {
          const sortedData = [...data].sort((a, b) => {
            const toMinutes = (time: string) => {
              const match = time.match(/(\d+):(\d+)?(am|pm)/);
              if (!match) return 0;
              let [ , hourStr, minuteStr = '0', period ] = match;
              let hour = parseInt(hourStr, 10);
              const minute = parseInt(minuteStr, 10);
              if (period === 'pm' && hour !== 12) hour += 12;
              if (period === 'am' && hour === 12) hour = 0;
              return hour * 60 + minute;
            };
            return toMinutes(a.hour) - toMinutes(b.hour);
          });
          return {
            title: date,
            data: sortedData,
          };
        });

      setItems(structured);
      const newMarked: Record<string, any> = {};
      structured.forEach(item => {
        if (item.data.length > 0) {
          newMarked[item.title] = { marked: true };
        }
      });
      setMarkedDates(newMarked);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (auth.currentUser) {
        fetchEvents();
      }
    }, [])
  );

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    hour: '',
    durationHours: '',
    durationMinutes: '',
    activity: '',
    address: ''
  });


  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };
  const {weekView} = props;
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity onPress={() => setSelectedEvent(item)}>
        <AgendaItem item={item} />
      </TouchableOpacity>
    );
  };

  const addEvent = async () => {
    const tripId = await AsyncStorage.getItem('activeTripId');
    if (!tripId) {
      Alert.alert("Error", "Trip ID not found.");
      return;
    }

    const user = auth.currentUser;
    if(!user) {
      console.warn("user not signed in");
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const newEvent = {
        date: today,
        hour: '12pm',
        duration: '1h',
        title: 'New Trip Activity',
        createdBy: user.uid,
        itemCustomHeightType: 'LongEvent',
      };
      await addDoc(collection(db, 'trips', tripId, 'events'), newEvent);
      console.log('event added');
  } catch (error) {
    console.error('failed to add event:', error);
  }
};

const handleSubmit = async () => {
  const tripId = await AsyncStorage.getItem('activeTripId');
  if (!tripId) {
    Alert.alert("Error", "Trip ID not found.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "User not signed in");
    return;
  }

  try {
    const isEditing = !!currentlyEditingEventId;

    const eventData = {
      date: form.date,
      hour: form.hour,
      duration: `${form.durationHours || 0}h ${form.durationMinutes || 0}m`,
      address: form.address,
      activity: form.activity,
      createdBy: user.uid,
      timestamp: Timestamp.now()
    };

    if (isEditing) {
      const tripId = await AsyncStorage.getItem('activeTripId');
      if (!tripId) return;
        const eventRef = doc(db, 'trips', tripId, 'events', currentlyEditingEventId!);
        await updateDoc(eventRef, eventData);
    } else {
        await addDoc(collection(db, 'trips', tripId, 'events'), eventData);
      }
    await fetchEvents();
    Alert.alert("Success", isEditing ? "Event updated!" : "Event saved!");

    setFVisible(false);
    setSelectedEvent(null);
    setForm({
      date: new Date().toISOString().split('T')[0],
      hour: '',
      durationHours: '',
      durationMinutes: '',
      activity: '',
      address: ''
    });
    setCurrentlyEditingEventId(null);

  } catch (err) {
    console.error('Error saving event:', err);
    Alert.alert("Error", "Failed to save event.");
  }
};


const marked = useMemo(() => {
  const result: Record<string, any> = {};
  items.forEach(item => {
    if (item.data && item.data.length > 0) {
      result[item.title] = { marked: true };
    }
  });
  return result;
}, [items]);


  return (
    <SafeAreaView style = {{ flex: 1 }}>
      <View className='h-full justify-center py-1'>
        <CalendarProvider
          date={items[0]?.title || new Date().toISOString().split('T')[0]}
          showTodayButton
          theme={todayBtnTheme.current}>
        {weekView ? (
          <WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={markedDates}/>
        ) : (
          <ExpandableCalendar
            testID={testIDs.expandableCalendar.CONTAINER}
            firstDay={1}
            markedDates={markedDates}
            leftArrowImageSource={leftArrowIcon}
            rightArrowImageSource={rightArrowIcon}/>
        )}
        <AgendaList
          theme={theme.current}
          sections={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          sectionStyle={styles.section}
          infiniteListProps={{
            itemHeight: 80,
            titleHeight: 50,
            itemHeightByType: {
              LongEvent: 120
            }
          }}/>
        <Modal visible={fVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.pickerInput}>
              <Text>{form.date}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(form.date)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setForm({ ...form, date: selectedDate.toISOString().split('T')[0] });
                  }
                }}/>
            )}
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.pickerInput}>
              <Text>{form.hour || 'Select time'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  if (Platform.OS === 'android') {
                    setShowTimePicker(false);
                  }
                  if (selectedTime) {
                    const hour = selectedTime.getHours();
                    const minute = selectedTime.getMinutes();
                    const formatted = `${hour.toString().padStart(2, '0')}:${minute
                      .toString()
                      .padStart(2, '0')}`;
                    setForm({ ...form, hour: formatted });
                    if (Platform.OS === 'ios') {
                      setShowTimePicker(false);
                    }
                  }
                }}/>
            )}
            <Text style={styles.label}>Duration</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                placeholder="Hrs"
                keyboardType="numeric"
                style={[styles.input, { width: 60 }]}
                value={form.durationHours}
                onChangeText={t => setForm({ ...form, durationHours: t })}/>
              <TextInput
                placeholder="Min"
                keyboardType="numeric"
                style={[styles.input, { width: 60 }]}
                value={form.durationMinutes}
                onChangeText={t => setForm({ ...form, durationMinutes: t })}/>
            </View>
            <TextInput placeholder="Activity Name" style={styles.input} value={form.activity} onChangeText={t => handleChange('activity', t)} />
            <TextInput placeholder="Location" style={styles.input} value={form.address} onChangeText={t => handleChange('address', t)} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancel" onPress={() => setFVisible(false)} />
              <Button title="Save" onPress={handleSubmit} />
            </View>
          </View>
        </View>
        </Modal>

        <Modal visible={!!selectedEvent} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Event Details</Text>
            <Text style={styles.label}>Activity: {selectedEvent?.title}</Text>
            <Text style={styles.label}>Time: {selectedEvent?.hour}</Text>
            <Text style={styles.label}>Duration: {selectedEvent?.duration}</Text>
            <Text style={styles.label}>Address: {selectedEvent?.address}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button
                title="Edit"
                onPress={() => {
                  setForm({
                    date: items.find(i => i.data.includes(selectedEvent))?.title || new Date().toISOString().split('T')[0],
                    hour: selectedEvent?.hour,
                    durationHours: selectedEvent?.duration?.split('h')[0]?.trim() || '',
                    durationMinutes: selectedEvent?.duration?.split('h')[1]?.replace('m', '')?.trim() || '',
                    activity: selectedEvent?.title,
                    address: selectedEvent?.address,
                  });
                  setCurrentlyEditingEventId(selectedEvent?.id)
                  setFVisible(true);
                  setSelectedEvent(null);
                }}/>
              <Button
                title="Delete"
                color="red"
                onPress={async () => {
                  const tripId = await AsyncStorage.getItem('activeTripId');
                  if (!tripId) {
                    Alert.alert("Error", "Trip ID not found.");
                    return;
                  }
                  try {
                    const user = auth.currentUser;
                    if (!user || !selectedEvent?.id) return;

                    const docRef = doc(db, 'trips', tripId, 'events', selectedEvent.id);
                    await deleteDoc(docRef);

                    Alert.alert("Deleted", "Event removed.");
                    await fetchEvents();
                    setSelectedEvent(null);
                  } catch (err) {
                      console.error('Error deleting event:', err);
                      Alert.alert("Error", "Failed to delete event.");
                    }
                }}/>
            </View>
          <View style={{ marginTop: 10 }}>
            <Button title="Close" onPress={() => setSelectedEvent(null)} />
          </View>
          </View>
        </View>
        </Modal>


        </CalendarProvider>
        <View className='my-10 py-10'>
          <Button title = "Add Event" onPress={() => setFVisible(true)}></Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AgendaInfiniteListScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'white'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'black',
    fontSize: 20,
    textTransform: 'capitalize'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
});