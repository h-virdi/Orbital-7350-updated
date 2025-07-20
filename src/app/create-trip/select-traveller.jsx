// app/create-trip/select-traveller.jsx
import { useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ToastAndroid } from 'react-native';

import OptionCard from '../../components/CreateTrip/OptionCard';
import { SelectTravelsList } from './../../../constants/Options';
import { CreateTripContext } from './../../context/CreateTripContext';

export default function SelectTraveller() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedTraveller, setSelectedTraveller] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // hide header
    });
  }, []);

  useEffect(() => {
    setTripData({
      ...tripData,
      traveller: selectedTraveller,
    });
  }, [selectedTraveller]);

  const handleContinue = () => {
    if (!selectedTraveller) {
      Alert.alert('Please select a traveller before continuing');
      ToastAndroid.show('Please select a traveller before continuing', ToastAndroid.SHORT);
      return;
    }

    router.push('/create-trip/select-dates');
  };

  return (
    <ScrollView
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
      }}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontFamily: 'outfit-bold',
          marginTop: 20,
        }}
      >
        Who is travelling
      </Text>

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 23,
          }}
        >
          Choose your travellers
        </Text>

        <FlatList
          data={SelectTravelsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedTraveller(item)}
              style={{
                marginVertical: 10,
              }}
            >
              <OptionCard option={item} selectedOption={selectedTraveller} />
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: Colors.WHITE,
            fontFamily: 'outfit-medium',
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
