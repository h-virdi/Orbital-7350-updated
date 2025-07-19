import { View, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

export default function PlannedTrip({ details = [], places = [] }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20,
        marginBottom: 10
      }}>
        🏕️ Plan Details
      </Text>

      {details.map((dayItem, dayIndex) => (
        <View key={dayIndex} style={{ marginBottom: 20 }}>
          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 18,
            marginBottom: 10
          }}>
            Day {dayItem.day}
          </Text>

          {dayItem.activities.map((activity, index) => (
            <View key={index} style={{
              backgroundColor: Colors.LIGHT_GRAY || "#f0f0f0",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10
            }}>
              <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 16,
                marginBottom: 5
              }}>
                🕒 {activity.time}
              </Text>

              <Text style={{
                fontFamily: 'outfit',
                fontSize: 15
              }}>
                {activity.activity}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20,
        marginTop: 30,
        marginBottom: 10
      }}>
        📍 Places to Visit
      </Text>

      {places.map((place, index) => (
        <View key={index} style={{
          backgroundColor: Colors.LIGHT_GRAY || "#f8f8f8",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15
        }}>
          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 16
          }}>{place.place_name}</Text>

          <Text style={{
            fontFamily: 'outfit',
            fontSize: 14,
            color: Colors.GRAY,
            marginTop: 5
          }}>{place.details}</Text>

          <Text style={{
            fontFamily: 'outfit',
            fontSize: 14,
            marginTop: 5
          }}>🎫 Ticket Price: {place.ticket_pricing}</Text>

          <Text style={{
            fontFamily: 'outfit',
            fontSize: 14,
            marginTop: 3
          }}>🚗 Travel Time: {place.travel_time}</Text>
        </View>
      ))}
    </View>
  );
}
