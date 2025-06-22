import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Avatar, Card } from 'react-native-paper';

const items = {
  '2024-03-26': [{name: 'Meeting 1', data:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '}],
  '2024-03-28': [{name: 'Meeting 2', data:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '}],
  '2024-03-29': [{name: 'Meeting 3', data:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '}],
  '2024-03-30': [{name: 'Meeting 4', data:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '}],
  '2024-03-31': [{name: 'Meeting 5', data:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '}],
  '2024-03-25': [{name: 'Meeting 6', data:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '}]
}

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={items}
        renderItem={(item) => {
          return (
          <TouchableOpacity style={styles.item}>
            <Card>
              <Card.Content>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography>{item.time}</Typography>
                  <Avatar.Text label="H" />
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );
        }}
        renderEmptyDate={() => (
          <View>
            <Typography>This is empty date</Typography>
          </View>
        )}
        />
        </SafeAreaView>
  );
};
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'lightblue',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom:20
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  }
});

export default App;