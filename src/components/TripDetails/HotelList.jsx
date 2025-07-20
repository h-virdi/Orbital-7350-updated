import { View, Text, FlatList, Image } from 'react-native';
import React from 'react';

const GOOGLE_PHOTO_BASE_URL = 'https://places.googleapis.com/v1/places/';
const GOOGLE_API_KEY = 'YOUR_API_KEY'; // Replace with your own key or pass as prop/env

export default function HotelList({ hotelList }) {
  const getHotelImageUri = (photoReference, placeId) => {
    if (!photoReference || !placeId) return null;

    return `${GOOGLE_PHOTO_BASE_URL}${placeId}/photos/${photoReference}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_API_KEY}`;
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20
      }}>🏨 Hotel Recommendation</Text>

      <FlatList
        data={hotelList}
        style={{ marginTop: 8 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.hotel_name + index}
        renderItem={({ item }) => {
          const imageUri = getHotelImageUri(item.photo_reference, item.place_id);
          return (
            <View style={{ marginRight: 20, width: 180 }}>
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require('./../../../assets/images/placeholder.jpg')
                }
                style={{
                  width: 180,
                  height: 120,
                  borderRadius: 15
                }}
              />

              <View style={{ padding: 5 }}>
                <Text style={{
                  fontFamily: 'outfit-medium',
                  fontSize: 17,
                }}>{item.hotel_name}</Text>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <Text style={{ fontFamily: 'outfit' }}>⭐ {item.rating}</Text>
                  <Text style={{ fontFamily: 'outfit' }}>💷 {item.price}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

// import { View, Text, FlatList, Image} from 'react-native'
// import React from 'react'

// export default function HotelList({hotelList}) {
//   return (
//     <View style ={{
//         marginTop:20
//     }}>
//       <Text style ={{
//         fontFamily:'outfit-bold',
//         fontSize:20
//       }}>🏨 Hotel Recommendation</Text>

//       <FlatList
//                 data={hotelList}
//                 style={{
//                     marginTop: 8
//                 }}
//                 horizontal ={true}
//                 showsHorizontalScrollIndicator={false}
    
//                 renderItem={({ item, index }) => (
//                     <View style ={{
//                         marginRight:20,
//                         width:180,
                    
//                     }}>
//                         {/* <Text>{item.hotel_name}</Text> */}
//                         <Image source ={require('./../../../assets/images/placeholder.jpg')}
//                         style ={{
//                             width:180,
//                             height:120,
//                             borderRadius:15
//                         }}/>
//                     <View style = {{
//                         padding:5
//                     }}>
//                         <Text style ={{
//                             fontFamily:'outfit-medium',
//                             fontSize:17,
//                             //flex:1
//                         }}>{item.hotel_name}</Text>

//                         <View style = {{
//                             display:'flex',
//                             flexDirection:'row',
//                             justifyContent:'space-between'
//                         }}>
//                             <Text style ={{
//                                 fontFamily:'outfit'
//                             }}>⭐ {item.rating}</Text>

//                             <Text style ={{
//                                 fontFamily:'outfit'
//                             }}>💷 {item.price}</Text>
//                         </View>
//                     </View>
//                     </View>



//                 )}
//             />
//     </View>
//   )
// }