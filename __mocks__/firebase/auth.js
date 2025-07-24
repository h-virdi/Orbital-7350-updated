export const getAuth = jest.fn(() => ({
  currentUser: {
    uid: 'test-user-123',
    email: 'test@example.com',
  },
}));