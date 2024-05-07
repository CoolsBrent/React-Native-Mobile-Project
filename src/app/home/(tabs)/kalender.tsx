import {useNavigation} from 'expo-router'
import React, {FunctionComponent, useState} from 'react'
import {StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, Dimensions} from 'react-native'
import {Calendar, DateData} from 'react-native-calendars'

import home from '@/app/home/(tabs)/home'

interface KalenderProps {}

const Kalender: FunctionComponent<KalenderProps> = () => {
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [dishName, setDishName] = useState<string>('')
    const navigation = useNavigation()

    const handleDayPress = (date: DateData) => {
        const selectedDateString = date.dateString
        setSelectedDate(selectedDateString)
        console.log('Geselecteerde datum:', selectedDateString)
        setModalVisible(true) // Open het modale venster wanneer een dag wordt geselecteerd
    }

    const handleAddDish = () => {
        // Hier kun je de geselecteerde datum en het toegevoegde gerecht verwerken
        console.log('Gerecht toegevoegd:', dishName, 'op', selectedDate)
        setModalVisible(false) // Sluit het modale venster na het toevoegen van het gerecht
    }

    return (
        <View style={{flex: 1}}>
            <Calendar
                onDayPress={handleDayPress}
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: Dimensions.get('window').height * 0.8,
                    margin: 10,
                    marginTop: 50,
                }}
                markedDates={{
                    [selectedDate]: {selected: true, selectedColor: 'blue'},
                    '2024-05-01': {marked: true, dotColor: 'red'},
                    '2024-05-05': {marked: true, dotColor: 'blue'},
                    '2024-05-10': {marked: true, dotColor: 'green'},
                }}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centered}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Voeg een gerecht toe voor {selectedDate}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setDishName}
                            value={dishName}
                            placeholder="Gerechtnaam"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddDish}>
                            <Text style={styles.buttonText}>Toevoegen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 15,
        width: 200,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
})

export default Kalender
