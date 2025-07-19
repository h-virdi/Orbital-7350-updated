//app\trip-details\index.jsx
import { useLocalSearchParams, useNavigation } from 'expo-router'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Image, Text, View, ScrollView } from 'react-native'
import FlightInfo from './../../components/TripDetails/FlightInfo'
import { Colors } from '@/constants/Colors';
import HotelList from '../../components/TripDetails/HotelList'
import PlannedTrip from '../../components/TripDetails/PlannedTrip'

export default function TripDetails() {
    const navigation = useNavigation();
    const { trip } = useLocalSearchParams();
    const [tripDetails, setTripDetails] = useState([]);
    const tripData = tripDetails?.tripData ? JSON.parse(tripDetails.tripData) : null;


    const formatData = (data)=> {
        return JSON.parse(data);     
    }

    useEffect(()=> {
        navigation.setOptions({
            headerShown:true,
            headerTransparent:true,
            headerTitle:''
        })
        setTripDetails(JSON.parse(trip))
    },[])

    const photoName = tripDetails?.tripData
    ? JSON.parse(tripDetails.tripData)?.locationInfo?.photoName
    : null;

    const imageUrl = photoName
    ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
    : null;

  return tripDetails&&(
    <ScrollView style={{ padding: 20 }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: 330,
              borderRadius: 15,
              resizeMode: 'cover'
            }}
          />
        ) : (
          <Image
            source={require('./../../../assets/images/placeholder.jpg')}
            style={{
              width: '100%',
              height: 330,
              borderRadius: 15,
              resizeMode: 'cover'
            }}
          />
        )}

        <View style={{
                padding: 15,
                backgroundColor: Colors.WHITE,
                height: "100%",
                marginTop: -30,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
            <Text style={{
                    fontSize: 25,
                    fontFamily: "outfit-bold"
                }}>{tripData?.locationInfo?.name}</Text>
                
            <View style={{
          flexDirection: "row",
          gap: 5,
          marginVertical: 5
        }}>   
            <Text style={{
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.GRAY,
            marginTop:5
          }}>{moment(tripData?.startDate).format("DD MMM yyyy")}</Text>

           <Text style={{
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.GRAY
          }}>- {moment(tripData?.endDate).format("DD MMM yyyy")}</Text>
          </View> 

          {/* TRAVELLER INFO */}
        <Text style={{
          fontFamily: "outfit",
          fontSize: 17,
          color: Colors.GRAY
        }}>🚌 {tripData?.traveller?.title}</Text>

        {/* Flight Info */}
        <FlightInfo flightData={tripDetails?.tripPlan?.travelPlan?.flight_details} />

        {/* Hotels List */}
        <HotelList hotelList={tripDetails?.tripPlan?.travelPlan?.hotel_options} />

        {/* Trip Day Planner Info*/}
        <PlannedTrip details={tripDetails?.tripPlan?.travelPlan?.daily_plan ?? []}
        places={tripDetails?.tripPlan?.travelPlan?.places_to_visit} />

        </View>

        


        
            
      
    </ScrollView>
  )
}