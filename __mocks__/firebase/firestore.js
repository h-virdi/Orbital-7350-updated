const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

export const collection = mockCollection;
export const doc = mockDoc;
export const getDocs = mockGetDocs;
export const addDoc = mockAddDoc;
export const updateDoc = mockUpdateDoc;
export const deleteDoc = mockDeleteDoc;
export const Timestamp = {
  now: jest.fn(() => ({ seconds: Date.now() / 1000 })),
};