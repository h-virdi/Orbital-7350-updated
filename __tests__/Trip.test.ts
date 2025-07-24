//__tests__\Trip.test.ts
import { getDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from 'react-test-renderer';

// Mock dependencies
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe("Trip Join Logic", () => {
  const mockTripId = "tripToSingapore";
  const mockPassword = "1234";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("joins a trip with valid trip ID and password", async () => {
    const mockDocSnap = {
      exists: () => true,
      data: () => ({ password: "1234" }),
    };

    const mockDocRef = { id: "mockDocRef" };

    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

    await act(async () => {
      const docRef = doc({} as any, 'trips', mockTripId); // still mocked
      const docSnap = await getDoc(docRef);
      const data = docSnap.data?.();
      
      expect(docSnap.exists()).toBe(true);
      expect(data?.password).toBe(mockPassword);

      await AsyncStorage.setItem('activeTripId', mockTripId);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("activeTripId", mockTripId);
  });

  it("fails to join trip with incorrect password", async () => {
    const mockDocSnap = {
      exists: () => true,
      data: () => ({ password: "wrong-pass" }),
    };

    const mockDocRef = { id: "mockDocRef" };

    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

    await act(async () => {
      const docRef = doc({} as any, 'trips', mockTripId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data?.();

      expect(docSnap.exists()).toBe(true);
      expect(data?.password).not.toBe(mockPassword);
    });
  });
});




// import { getDoc, doc, DocumentSnapshot } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { act } from 'react-test-renderer';
// import { expect, jest, describe, it, beforeEach } from '@jest/globals';


// // 1. Fix the MockDocument type definition
// interface MockDocument {
//   exists: () => boolean;
//   data: () => { password: string } | undefined; // Add undefined to match real behavior
// }

// // 2. Properly type the mock functions
// jest.mock('firebase/firestore', () => ({
//   getDoc: jest.fn(),
//   doc: jest.fn((_: unknown, path: string) => ({ 
//     id: path,
//     path: `trips/${path}`
//   })),
// }));

// jest.mock('@react-native-async-storage/async-storage', () => ({
//   setItem: jest.fn(),
// }));

// describe("Trip Join Logic", () => {
//   const mockTripId = "tripToSingapore";
//   const mockPassword = "1234";
  
//   // 3. Helper function with proper typing
//   // const createMockDoc = (password: string): MockDocument => ({
//   //   exists: () => true,
//   //   data: () => ({ password }),
//   // });
//   const createMockDoc = (password: string): Partial<DocumentSnapshot> => ({
//   // exists: () => true,
//   data: () => ({ password }),
//   id: "mockId",
//   ref: {} as any,
//   metadata: {} as any,
//   get: () => undefined,
// });

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // 4. Add async/await properly
// it("joins with valid credentials", async () => {
//   const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
//   // mockedGetDoc.mockResolvedValue(createMockDoc(mockPassword));
//   mockedGetDoc.mockResolvedValue(createMockDoc(mockPassword) as DocumentSnapshot);

//   await act(async () => {
//     const docRef = doc(null as any, 'trips', mockTripId);
//     const docSnap = await getDoc(docRef);

//     expect(docSnap.exists()).toBe(true);
//     expect(docSnap.data()?.password).toBe(mockPassword);

//     await AsyncStorage.setItem('activeTripId', mockTripId);
//   });

//   expect(AsyncStorage.setItem).toHaveBeenCalledWith("activeTripId", mockTripId);
// });

// });