//src\app\create-trip\review-trip.jsx
//import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRouter } from 'expo-router';
import moment from "moment";
import { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
//import { generateTripPrompt } from "./../../components/CreateTrip/generate-prompt";

export default function ReviewTrip() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     headerTransparent: true,
  //     headerTitle: ""
  //   })
  // }, [])

  return (
    <View style={{
      padding: 25,
      paddingTop: 75,
      backgroundColor: Colors.WHITE,
      height: "100%"
    }}>
      <Text style={{
        fontFamily: "outfit-bold",
        fontSize: 35,
        marginTop: 20
      }}>Review your trip</Text>

      <View style={{
        marginTop: 20,
        // marginHorizontal: 15,
        // display: "flex",
        // flexDirection: "column",
      }}>
        <Text style={{
          fontFamily: "outfit-bold",
          fontSize: 20
        }}>
          Before generating your trip, please review your selection
        </Text>

        {/* Destination Info */}
        <View style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "row",
          marginHorizontal: 15,
          gap: 20
        }}>
          <Ionicons name="location-sharp" size={34} color="black" />
          <View>
            <Text style={{
              fontFamily: "outfit",
              fontSize: 20,
              color: Colors.GRAY
            }}>Destination</Text>
            <Text style={{
              fontFamily: "outfit-medium",
              fontSize: 20
            }}>{tripData?.locationInfo?.name}</Text>
          </View>
        </View>

        {/* Travel Date Info */}
        <View style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          marginHorizontal: 15,
          gap: 20
        }}>
          <MaterialIcons name="date-range" size={34} color="black" />
          <View>
            <Text style={{
              fontFamily: "outfit",
              fontSize: 20,
              color: Colors.GRAY
            }}>Travel Date</Text>
            <Text style={{
              fontFamily: "outfit-medium",
              fontSize: 20
            }}>{moment(tripData?.startDate).format("DD MMM") +
              " To " + moment(tripData?.endDate).format("DD MMM") + " "}
              ( {tripData?.totalNoOfDays} days )
            </Text>
          </View>
        </View>

        {/* Traveller Info */}
        <View style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          marginHorizontal: 15,
          gap: 20
        }}>
          <Ionicons name="bus" size={34} color="black" />
          <View>
            <Text style={{
              fontFamily: "outfit",
              fontSize: 20,
              color: Colors.GRAY
            }}>Who is Travelling</Text>
            <Text style={{
              fontFamily: "outfit-medium",
              fontSize: 20
            }}>{tripData?.traveller?.title}
            </Text>
          </View>
        </View>

        {/* Budget Info */}
        <View style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          marginHorizontal: 15,
          gap: 20
        }}>
          <FontAwesome name="money" size={34} color="black" />
          <View>
            <Text style={{
              fontFamily: "outfit",
              fontSize: 20,
              color: Colors.GRAY
            }}>Budget</Text>
            <Text style={{
              fontFamily: "outfit-medium",
              fontSize: 20
            }}>{tripData?.budget}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            // console.log(generateTripPrompt(tripData));

            router.replace("create-trip/generate-trip");
          }}
          style={{
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 15,
            marginTop: 80,
          }}>
          <Text style={{
            textAlign: "center",
            color: Colors.WHITE,
            fontFamily: "outfit-medium",
            fontSize: 20
          }}>Build My Trip</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}