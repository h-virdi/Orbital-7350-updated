// import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
// jest.mock('@react-navigation/native', () => ({
//   ...jest.requireActual('@react-navigation/native'),
//   useNavigation: () => ({
//     navigate: jest.fn(),
//   }),
//   useFocusEffect: jest.fn(),
// }));

// jest.mock('firebase/firestore', () => ({
//   collection: jest.fn(),
//   doc: jest.fn(),
//   getDocs: jest.fn(),
//   setDoc: jest.fn(),
//   query: jest.fn(),
//   where: jest.fn(),
//   Timestamp: { now: jest.fn() }
// }));

// jest.mock('../../../firebaseConfig', () => ({
//   auth: {
//     currentUser: {
//       email: 'test@example.com'
//     }
//   },
//   db: {}
// }));

// jest.mock('@/src/AiModel', () => ({
//   chatSession: {
//     sendMessage: jest.fn().mockResolvedValue({
//       response: {
//         text: jest.fn().mockResolvedValue(JSON.stringify({
//           travelPlan: {
//             location: "Test Location",
//             duration: "1 Day",
//             // ... mock response
//           }
//         }))
//       }
//     })
//   }
// }));
import { jest } from '@jest/globals';

// ✅ Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// ✅ Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn((db, path) => ({ id: path })),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

// ✅ Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'user123' },
  })),
}));

// ✅ Optional: silence alerts in tests
(global as any).alert = jest.fn();
