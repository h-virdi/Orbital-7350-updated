import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AgendaItem = ({item}: any) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 4,
    borderRadius: 5,
  }
});

export default AgendaItem;