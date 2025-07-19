// context/CreateTripContext.js
import { createContext, useState, useContext } from 'react';

// Create the context
export const CreateTripContext = createContext();

// Default trip data structure
const defaultTripData = {
  locationInfo: {
    name: '',
    coordinates: null,
    photoName: null,
    url: null,
    address: ''
  },
  traveller: null,
  dates: null,
  budget: null,
  docId: null,
  isEditing: false
};

// Provider component
export const CreateTripProvider = ({ children }) => {
  const [tripData, setTripData] = useState(defaultTripData);

  const resetTripData = () => {
    setTripData(defaultTripData);
  };

  const updateTripData = (updates) => {
    setTripData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const value = {
    tripData,
    setTripData,
    resetTripData,
    updateTripData
  };

  return (
    <CreateTripContext.Provider value={value}>
      {children}
    </CreateTripContext.Provider>
  );
};

// Custom hook to use the context safely
export const useCreateTripContext = () => {
  const context = useContext(CreateTripContext);
  if (!context) {
    throw new Error('useCreateTripContext must be used within a CreateTripProvider');
  }
  return context;
};