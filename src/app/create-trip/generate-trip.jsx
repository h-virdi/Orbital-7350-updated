//app\create-trip\generate-trip.jsx
import { Colors } from '@/constants/Colors';
import { AI_PROMPT } from '@/constants/Options';
import { useRouter } from 'expo-router';
import { doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { CreateTripContext } from '../../context/CreateTripContext';
import { auth, db } from './../../../firebaseConfig';
import { chatSession } from './../../../src/AiModel';

export default function GenerateTrip() {
    const {tripData, setTripData} = useContext(CreateTripContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const user = auth.currentUser;

    useEffect(()=> {
       GenerateAiTrip()
    },[])
    const GenerateAiTrip=async()=>{

        setLoading(true);

        const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', tripData?.locationInfo?.name)
        .replace('{totalDay}', tripData?.totalNoOfDays)
        .replace('{totalNight}', tripData?.totalNoOfDays - 1)
        .replace('{traveller}', tripData?.traveller?.title)
        .replace('{budget}', tripData?.budget)
        .replace('{totalDay}', tripData?.totalNoOfDays)
        .replace('{totalNight}', tripData?.totalNoOfDays - 1);

        console.log(FINAL_PROMPT);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        
        // console.log(result.response.text());
        // const tripResp= JSON.parse(result.response.text());
        const responseText = await result.response.text();
console.log("🧠 AI Response Text:", responseText);

const tripResp = JSON.parse(responseText);

        setLoading(false);
        
        const docId = (Date.now()).toString();
        const result_ = await setDoc(doc(db, "UserTrips", docId), {
            userEmail: user.email,
            tripPlan:tripResp, //AI result
            tripData:JSON.stringify(tripData), //User Selection Data
            docId:docId
            //createdAt: Timestamp.now()
             })

            router.push('(tabs)/mytrip');     

    }
  return (
    <View style={{
        padding:25,
        paddingTop:75,
        backgroundColor:Colors.WHITE,
        height:'100%'
    }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:35,
        textAlign:'center'
      }}>Please wait...</Text>

      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:20,
        textAlign:'center',
        marginTop:40
      }}>We are working to generate your dream trip</Text>

      <Image source= {require('./../../../assets/images/plane.gif')}
      style={{
        width:'100%',
        height:200, }}
        resizeMode='contain'
       />

      <Text style={{
        fontFamily:'outfit',
        color:Colors.GRAY,
        fontSize:20,
        textAlign:'center'
      }}>Please do not go back...</Text>


    </View>
  )
}
