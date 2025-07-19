//components\MyTrips\UserTripCard.jsx
import moment from "moment";
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { deleteDoc, doc } from "firebase/firestore";
import Ionicons from '@expo/vector-icons/Ionicons';
import { db } from './../../../firebaseConfig';
import { useRouter } from 'expo-router'; 


export default function UserTripCard({ trip, onDelete }) {
  
  const formatData = (data) => {
    return JSON.parse(data);
  };

  const router = useRouter();

const handleEdit = () => {
  router.push({
    pathname: '/create-trip/search-place',
    params: {
      trip: JSON.stringify(trip)
    },
  });
};


  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "UserTrips", trip.docId));
      onDelete(); // trigger refresh
    } catch (error) {
      console.error("❌ Failed to delete trip:", error);
    }
  };

  return (
    <View style={{
      marginTop: 20,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center'
    }}>
      <Image source={{
        uri: 'https://places.googleapis.com/v1/' +
          JSON.parse(trip.tripData).locationInfo?.photoName +
          '/media?maxHeightPx=400&maxWidthPx=400&key=' +
          process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
      }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15
        }} />

      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
          {trip.tripPlan?.travelPlan?.location || 'Untitled Trip'}
        </Text>

        <Text style={{ fontFamily: "outfit", fontSize: 14, color: Colors.GRAY }}>
          {moment(formatData(trip.tripData).startDate).format("DD MMM yyyy")}
        </Text>

        <Text style={{ fontFamily: "outfit", fontSize: 14, color: Colors.GRAY }}>
          Travelling: {formatData(trip.tripData)?.traveller?.title ?? "Unknown"}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
          {/* Edit placeholder */}
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="create" size={22} color={Colors.GRAY} />
          </TouchableOpacity>

          {/* Delete logic */}
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
