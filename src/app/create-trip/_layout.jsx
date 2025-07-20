//src\app\create-trip\_layout.jsx
// // app/create-trip/_layout.jsx
import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { CreateTripProvider } from '../../context/CreateTripContext';

// // Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CreateTripLayout Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Something went wrong with the trip creation
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            Please try restarting the app
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function CreateTripLayout() {
  return (
    <ErrorBoundary>
      <CreateTripProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CreateTripProvider>
    </ErrorBoundary>
  );
}