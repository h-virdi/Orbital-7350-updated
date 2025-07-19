//app\create-trip\select-budget.jsx
import { useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import OptionCard from '../../components/CreateTrip/OptionCard';
import { Colors } from '@/constants/Colors';
import { SelectBudgetOptions } from './../../../constants/Options';
import { CreateTripContext } from '../../context/CreateTripContext';



export default function SelectBudget() {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState();
    const { tripData, setTripData } = useContext(CreateTripContext);
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: ""
        })
    }, []);

    useEffect(() => {
        selectedOption && setTripData({
            ...tripData,
            budget: selectedOption?.title
        })
    }, [selectedOption])

    const onClickContinue = () => {
        if (!selectedOption) {
            const message = "Select your budget";
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert("Missing Info", message);
        }
        return;
  }
  router.push("/create-trip/review-trip");
};

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
                marginTop: 25
            }}>Budget</Text>
            <View style={{
                marginTop: 20
            }}>
                <Text style={{
                    fontFamily: "outfit-bold",
                    fontSize: 20
                }}>Choose spending habits for your trip</Text>

                <FlatList
                    data={SelectBudgetOptions}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedOption(item)}
                            style={{
                                marginVertical: 10
                            }}>
                            <OptionCard option={item} selectedOption={selectedOption} />
                        </TouchableOpacity>

                    )}
                />
            </View>

            <TouchableOpacity
                            // activeOpacity={selectedTraveller ? 1 : 0.8}
                            // onPress={onTravellerSelection}
                            onPress={()=>onClickContinue()}
                            style={{
                                padding: 15,
                                backgroundColor: Colors.PRIMARY,
                                borderRadius: 15,
                                marginTop: 20,
                            }}>
            
                              {/* <Link href = {'/create-trip/select-dates'}
                              style ={{
                                width:'100%',
                                textAlign:'center'
                              }} >  */}
            
                            <Text style={{
                                textAlign: "center",
                                color: Colors.WHITE,
                                fontFamily: "outfit-medium",
                                fontSize: 20
                            }}>Continue</Text>
                            {/* </Link> */}
                        </TouchableOpacity>

    </View>
  )
}