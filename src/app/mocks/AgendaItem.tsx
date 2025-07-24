// src\app\mocks\AgendaItem.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AgendaItem = ({ item }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.hour}</Text>
    </View>
  );
};

export default AgendaItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
});