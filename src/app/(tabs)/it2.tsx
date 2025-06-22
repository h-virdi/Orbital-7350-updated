import React, { useCallback, useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, WeekCalendar } from 'react-native-calendars';
import AgendaItem from '../mocks/AgendaItem';
import { agendaItems, getMarkedDates } from '../mocks/agendaItems';
import { getTheme, lightThemeColor, themeColor } from '../mocks/theme';
import testIDs from '../testIDs';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const ITEMS: any[] = agendaItems;

interface Props {
  weekView?: boolean;
}

const AgendaInfiniteListScreen = (props: Props) => {
  const {weekView} = props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const renderItem = useCallback(({item}: any) => {
    const isLongItem = item.itemCustomHeightType === 'LongEvent';
    return <View style={{paddingTop: isLongItem ? 40 : 0}}><AgendaItem item={item}/></View>;
  }, []);

  const addEvent = () => {
    console.log("add event pressed")
  }

  return (
    <View className='h-full justify-center py-20'>
    <CalendarProvider
      date={ITEMS[1]?.title || ITEMS[0]?.title || new Date().toISOString().slice(0, 10)}
      showTodayButton
      theme={todayBtnTheme.current}
    >
      {weekView ? (
        <WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current}/>
      ) : (
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          //theme={theme.current}
          firstDay={1}
          markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
        />
      )}
      <AgendaList
        theme={theme.current}
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
        infiniteListProps={
          {
            itemHeight: 80,
            titleHeight: 50,
            itemHeightByType: {
              LongEvent: 120
            }
          }
        }
      />
    </CalendarProvider>
    <View className='my-1 py-1'>
    <Button title = "Add Event" onPress={addEvent}></Button>
    </View>
    </View>
  );
};

export default AgendaInfiniteListScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'white'
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'black',
    fontSize: 20,
    textTransform: 'capitalize'
  }
});