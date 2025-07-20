// src\AiModel.js
import Constants from "expo-constants";
const { googleGeminiApiKey } = Constants.expoConfig.extra;

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
const genAI = new GoogleGenerativeAI(googleGeminiApiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Travel Plan for Location: New York USA, for 1 Days and 1 Night for Family with a Luxury budget with a Flight details, Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and Places to visit nearby with placeName, Place Details, Place Image Uri, Geo Coordinates, ticket Pricing, Time to travel each of the location for 1 day and 1 night with each day plan with best time to visit in JSON."
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `{
  "travelPlan": {
    "location": "New York, NY, USA",
    "duration": "1 Day, 1 Night",
    "travellers": "Family",
    "budget": "Luxury",
    "flight_details": {
      "airline": "Delta One",
      "price": "$1500 per person",
      "booking_url": "https://example.com/book-flight"
    },
    "hotel_options": [
      {
        "hotel_name": "The St. Regis New York",
        "address": "Two E 55th St, New York, NY 10022",
        "price": "$2000/night",
        "image_url": "https://example.com/st-regis.jpg",
        "coordinates": {
          "lat": 40.7610,
          "lng": -73.9744
        },
        "rating": 4.8,
        "description": "Luxury hotel in Midtown Manhattan with top-tier amenities and butler service."
      }
    ],
    "places_to_visit": [
      {
        "place_name": "Central Park",
        "details": "Scenic urban park with attractions and playgrounds.",
        "image_url": "https://example.com/central-park.jpg",
        "coordinates": {
          "lat": 40.7829,
          "lng": -73.9654
        },
        "ticket_pricing": "Free",
        "travel_time": "2-3 hours"
      }
    ],
    "daily_plan": [
      {
        "day": 1,
        "activities": [
          {
            "time": "09:00 AM",
            "activity": "Check-in and Breakfast"
          },
          {
            "time": "10:30 AM",
            "activity": "Visit Central Park"
          },
          {
            "time": "01:00 PM",
            "activity": "Lunch at The Modern"
          },
          {
            "time": "03:00 PM",
            "activity": "Shopping at Fifth Avenue"
          },
          {
            "time": "07:00 PM",
            "activity": "Dinner and Broadway Show"
          }
        ]
      }
    ]
  }
}`
        }
      ]
    }
  ]
});


// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());