import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:"588400482522-kcgrvigtu8cm5lvrhoufrl3s6taodq37.apps.googleusercontent.com",
  iosClientId:"588400482522-50ecannqhcsacsfrs8rls9jmr03l97gp.apps.googleusercontent.com"
});


const Index = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
          if (isSuccessResponse(response)) {
            setUserInfo(response.data);
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

  const getCurrentUser = async () => {
    try {
      const response = await GoogleSignin.signInSilently();
      if (isSuccessResponse(response)) {
        console.log("Current User:", response);
        setUserInfo(response.data.user);
      } else if (isNoSavedCredentialFoundResponse(response)) {
        Alert.alert("No User", "No saved credentials found.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch current user.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Index</Text>
      {
        userInfo ? (
          <View>
          <Button title='Get Current User' onPress = {getCurrentUser}/>
          <Text>{JSON.stringify(userInfo, null, 2)}</Text>
          <Button title='Sign out' onPress = {handleGoogleSignOut}/>
          </View>
        ) : ( 
      <GoogleSigninButton
        style={{ width:212, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
      )}
    </View>
  );
}

export default Index;
//function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

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
});
