//src\app\(tabs)\index.tsx
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../../firebaseConfig';


import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:"588400482522-kcgrvigtu8cm5lvrhoufrl3s6taodq37.apps.googleusercontent.com",
  iosClientId:"588400482522-50ecannqhcsacsfrs8rls9jmr03l97gp.apps.googleusercontent.com"
});


const Index = () => {
  const [tripIdModalVisible, setTripIdModalVisible] = useState(false);
  const [tripIdInput, setTripIdInput] = useState('');

  const [createTripModalVisible, setCreateTripModalVisible] = useState(false);
  const [tripPasswordInput, setTripPasswordInput] = useState('');

  const [newTripIdInput, setNewTripIdInput] = useState('');
  const [newTripPasswordInput, setNewTripPasswordInput] = useState('');

  const [userInfo, setUserInfo] = useState<any>(null);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        throw new Error("no id token");
      }
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
        setTripIdModalVisible(true);
      } else {
          console.log("sign in was cancelled by user");
        }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign in is in progress")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("play services not available")
            // Android only, play services not available or outdated
            break;
          default:
        // some other error happened
        }
      } else {
        Alert.alert("an error that is not related to Google Sign-in has occurred")
      }
    }
  }

  const handleTripIdSubmit = async () => {
    const tripId = tripIdInput.trim();
    const password = tripPasswordInput.trim();

    if (!tripId || !password) {
      Alert.alert("Error", "Trip ID and password are required.");
      return;
    }

    try {
      const docRef = doc(db, 'trips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.password === password) {
          await AsyncStorage.setItem('activeTripId', tripId);
          setTripIdModalVisible(false);
          Alert.alert("Success", "Trip joined successfully!");
        } else {
          Alert.alert("Error", "Incorrect password for this Trip ID.");
        }
      } else {
        Alert.alert("Error", "No trip found with that Trip ID.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to check Trip ID.");
    }
  };

  const handleCreateTripSubmit = async () => {
    const tripId = newTripIdInput.trim();
    const password = newTripPasswordInput.trim();

    if (!tripId || !password) {
      Alert.alert("Error", "Trip ID and password are required.");
      return;
    }

    try {
      const docRef = doc(db, 'trips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Alert.alert("Error", "Trip ID already exists. Please choose a different ID.");
        return;
      }

      await setDoc(docRef, {
        password: password,
        createdAt: new Date()
      });

      await AsyncStorage.setItem('activeTripId', tripId);
      setCreateTripModalVisible(false);
      Alert.alert("Success", "Trip created successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create Trip.");
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Alert.alert("Logged Out", "You have been signed out.");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View className="flex-1 items-center justify-center bg-transparent px-4">
            <Text className="text-xl font-bold text-center mb-4">Welcome to SyncOurTrip!</Text>  
            <Button title='Sign out' onPress = {handleGoogleSignOut}/>
            <View style={{ height: 16 }} />
              <Button title="Enter Trip ID" onPress={() => setTripIdModalVisible(true)}/>
            </View>
      ) : ( 
            <GoogleSigninButton
              style={{ width:212, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleSignIn}/>
          )
      }
    <Modal visible={tripIdModalVisible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Enter Trip ID</Text>
        <TextInput placeholder="Enter your Trip ID" value={tripIdInput} onChangeText={setTripIdInput} style={styles.input}/>
        <TextInput placeholder="Enter Trip Password" value={tripPasswordInput} secureTextEntry onChangeText={setTripPasswordInput} style={styles.input}/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Cancel" onPress={() => setTripIdModalVisible(false)} />
          <Button title="Submit" onPress={handleTripIdSubmit} />
        </View>
        <Button
          title="Create a new trip"
          onPress={() => {
            setTripIdModalVisible(false);
            setCreateTripModalVisible(true);
          }}/>
      </View>
    </View>
    </Modal>
    <Modal visible={createTripModalVisible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Trip</Text>
          <TextInput placeholder="Trip ID" value={newTripIdInput} onChangeText={setNewTripIdInput} style={styles.input}/>
          <TextInput placeholder="Password" value={newTripPasswordInput} secureTextEntry onChangeText={setNewTripPasswordInput} style={styles.input}/>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Cancel" onPress={() => setCreateTripModalVisible(false)} />
            <Button title="Create Trip" onPress={handleCreateTripSubmit} />
          </View>
          <Button
            title="Enter existing Trip ID"
            onPress={() => {
              setCreateTripModalVisible(false);
              setTripIdModalVisible(true);
            }}
          />
        </View>
      </View>
    </Modal>
    </View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
});