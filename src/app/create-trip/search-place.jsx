// app/create-trip/search-place.jsx
import { Colors } from '@/constants/Colors';
import Constants from 'expo-constants';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import { CreateTripContext } from './../../context/CreateTripContext';
import { ScrollView } from 'react-native';

export default function SearchPlace() {
  const navigation = useNavigation();
  const router = useRouter();
  const inputRef = useRef(null);
  const { tripData, setTripData } = useContext(CreateTripContext);
  const { editDocId, trip } = useLocalSearchParams();

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //     headerTransparent: true,
  //     headerTitle: 'Search',
  //   });
  // }, []);

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
     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Search for a Location</Text>

      {/* <GooglePlacesTextInput
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
      /> */}
      <GooglePlacesTextInput
  ref={inputRef}
  apiKey={Constants.expoConfig.extra.googleMapsApiKey}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 100,
    backgroundColor: Colors.WHITE,
    flexGrow: 1,
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
