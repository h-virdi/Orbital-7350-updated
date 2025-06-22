import React, { useState } from 'react';
import { View } from 'react-native';
import { CalendarList } from 'react-native-calendars';

const App = () => {
  const [selected, setSelected] = useState('');

  return (
    <View className='w-full flex-1 justify-center items-center'>
    <CalendarList
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
      }}
      minDate={(new Date()).toISOString()}
    />
    </View>
  );
};

export default App;