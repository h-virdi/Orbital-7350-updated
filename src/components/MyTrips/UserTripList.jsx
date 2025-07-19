import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import moment from "moment";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import UserTripCard from './UserTripCard';

export default function UserTripList({ userTrips, onDelete }) {
  const router = useRouter();

  return (
    <View>
      {userTrips.map((trip, index) => {
        if (!trip || !trip.tripData) return null;
        let parsedTripData;
        try {
          parsedTripData = JSON.parse(trip.tripData);
        } catch {
          return null;
        }
        return (
          <View key={index} style={{ marginTop: 20 }}>
            <Image
              source={
                parsedTripData?.locationInfo?.photoName
                  ? {
                      uri:
                        'https://places.googleapis.com/v1/' +
                        parsedTripData.locationInfo.photoName +
                        '/media?maxHeightPx=400&maxWidthPx=400&key=' +
                        process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
                    }
                  : require('./../../../assets/images/placeholder.jpg')
              }
              style={{
                width: '100%',
                height: 240,
                borderRadius: 15,
              }}
            />

            <View style={{ marginTop: 10 }}>
              <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 24,
              }}>{parsedTripData.locationInfo?.name}</Text>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
                <Text style={{
                  fontFamily: 'outfit',
                  fontSize: 17,
                  color: Colors.GRAY
                }}>
                  {moment(parsedTripData.startDate).format('DD MMM yyyy')}
                </Text>

                <Text style={{
                  fontFamily: 'outfit',
                  fontSize: 17,
                  color: Colors.GRAY
                }}>🚌 {parsedTripData.traveller?.title}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/trip-details',
                    params: { trip: JSON.stringify(trip) },
                  });
                }}
                style={{
                  backgroundColor: Colors.PRIMARY,
                  padding: 15,
                  borderRadius: 15,
                  marginTop: 10,
                }}>
                <Text style={{
                  color: Colors.WHITE,
                  textAlign: 'center',
                  fontFamily: 'outfit-medium',
                  fontSize: 18,
                }}>See your plan</Text>
              </TouchableOpacity>
            </View>

            {/* ➕ ADD THE DELETE/EDIT CARD */}
            <UserTripCard trip={trip} onDelete={onDelete} />
          </View>
        );
      })}
    </View>
  );
}
