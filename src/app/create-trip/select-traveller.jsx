//app\create-trip\select-traveller.jsx
import { Link, useNavigation } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

import OptionCard from '../../components/CreateTrip/OptionCard';
import { SelectTravelsList } from './../../../constants/Options';
import { CreateTripContext } from './../../context/CreateTripContext';



export default function SelectTraveller() {

  const navigation=useNavigation();
  const [selectedTraveller, setSelectedTraveller]=useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  

  
  useEffect(()=> {
    navigation.setOptions({
      headerShown:true,
      headerTransparent:true,
      headerTitle:''
    })
  }, [])

  useEffect(()=>{
    setTripData({...tripData,
      traveller:selectedTraveller
    })
  }, [selectedTraveller]);

  useEffect(()=> {
    console.log(tripData);
  }, [tripData])
  return (
    <View style ={{
      padding:25,
      paddingTop:75,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <Text style= {{
        fontSize:30,
        fontFamily:'outfit-bold',
        marginTop:20
      }}>Who is travelling</Text>

      <View style={{
        marginTop:20
      }}>
        <Text style = {{
          fontFamily:'outfit-bold', 
          fontSize:23
        }}>Choose your travellers</Text>

        <FlatList
         data = {SelectTravelsList}    
         renderItem={({item, index}) => (
          <TouchableOpacity 
          onPress={()=>setSelectedTraveller(item)}
          style ={{
            marginVertical:10
          }}>
            <OptionCard option={item} selectedOption={selectedTraveller}/>
            </TouchableOpacity>
         )}    
        />
      </View>

      
      <TouchableOpacity
                // activeOpacity={selectedTraveller ? 1 : 0.8}
                // onPress={onTravellerSelection}
                style={{
                    padding: 15,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 15,
                    marginTop: 20,
                }}>

                  <Link href = {'/create-trip/select-dates'}
                  style ={{
                    width:'100%',
                    textAlign:'center'
                  }} > 

                <Text style={{
                    textAlign: "center",
                    color: Colors.WHITE,
                    fontFamily: "outfit-medium",
                    fontSize: 20
                }}>Continue</Text>
                </Link>
            </TouchableOpacity>
            
    </View>
  )
}