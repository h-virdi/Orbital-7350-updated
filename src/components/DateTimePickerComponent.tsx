import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, Modal, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

type Props = {
    label: string; //button label
    initialDate?: Date; //intial date (defaults to current date)
    onChange: (date: Date) => void; //function to notify parent when user picks a date
};

const DateTimePickerComponent = ({ label, initialDate = new Date(), onChange }: Props) => { //set default value for initialDate
  const [date, setDate] = useState(initialDate); //stores selected date
  const [showPicker, setShowPicker] = useState(false); //controls visibility of data picker

  const handleChange = (event?: any, selectedDate?: Date) => { //function called when a user selects a date
    if (Platform.OS === 'android') {
        setShowPicker(false);
    } else if (Platform.OS === 'ios' && event.type === 'set') {
        setShowPicker(false); 
    }
    if (selectedDate) { //if new date is selected,
      setDate(selectedDate); //update to new date selected
      onChange(selectedDate); //inform parent component
    }
  };

  const closeModal = () => setShowPicker(false); //hide datetime picker only after user is done adding in the full date

return (
    <View style={{ marginBottom: 10 }}>
      <Button title={`Select ${label} Time`} onPress={() => setShowPicker(true)} /> 
      <Text>Time of {label}: {date.toLocaleString()}</Text>

      <Modal
        visible = {showPicker}
        transparent = {true}
        animationType = "slide"
        onRequestClose = {closeModal}>
        <TouchableWithoutFeedback onPress = {closeModal}>
            <View style = {styles.overlay} />
        </TouchableWithoutFeedback>

        <View style = {styles.modalContent}>
            {Platform.OS === 'ios' ? (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="inline"
                    onChange={handleChange}
                />
            ) : (
                <DateTimePicker
                    value = {date}
                    mode = "datetime"
                    display="default"
                    onChange={(e, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            setDate(selectedDate);
                            onChange(selectedDate);
                        }
                    }}
                />
            )}
            {Platform.OS === 'ios' && (
                <Button title="Done" onPress={closeModal} />
            )}
        </View>
    </Modal>
</View>
);
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default DateTimePickerComponent;