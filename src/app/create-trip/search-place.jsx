// app/create-trip/search-place.jsx
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CreateTripContext } from './../../context/CreateTripContext';
import GooglePlacesTextInput from 'react-native-google-places-textinput';

export default function SearchPlace() {
  const navigation = useNavigation();
  const router = useRouter();
  const inputRef = useRef(null);
  const { tripData, setTripData } = useContext(CreateTripContext);
  const { editDocId, trip } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Search',
    });
  }, []);

  useEffect(() => {
  if (trip) {
    const parsedTrip = JSON.parse(trip);
    setTripData({
      ...parsedTrip.tripData,
      docId: parsedTrip.docId, // 🔁 Save docId to update later
      isEditing: true          // 🔁 Mark that this is an edit
    });
  }
}, [trip]);

  useEffect(() => {
  console.log('✅ Trip data updated:', tripData);
}, [tripData]);




  const handlePlaceSelect = (place) => {
  const details = place.details;

  setTripData({
    ...tripData,
    locationInfo: {
      name: details?.displayName?.text ?? place.description ?? 'Unknown Place', // ✅ Fix here
      coordinates: details?.location,
      photoName: details?.photos?.[0]?.name || null,
      url: details?.googleMapsUri,
    },
  });

  router.push('/create-trip/select-traveller');
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a Location</Text>

      <GooglePlacesTextInput
        ref={inputRef}
        //REMOVE/HIDE API
        apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY} // Replace with @env if needed
        fetchDetails={true}
        detailsFields={[
          'location',
          'formattedAddress',
          'photos',
          'googleMapsUri',
          'displayName',
        ]}
        onPlaceSelect={handlePlaceSelect}
        showClearButton={true}
        showLoadingIndicator={true}
        debounceDelay={300}
        minCharsToFetch={2}
        style={{
          input: styles.input,
          suggestionsContainer: styles.suggestionsContainer,
          suggestionItem: styles.suggestionItem,
        }}
        onError={(error) => console.warn('❌ API error:', error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 100,
    backgroundColor: Colors.WHITE,
    height: '100%',
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
