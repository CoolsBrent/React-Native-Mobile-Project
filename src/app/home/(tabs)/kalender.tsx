import firestore from '@react-native-firebase/firestore'
import {useNavigation} from '@react-navigation/native' // Importeer useNavigation uit @react-navigation/native
import {router} from 'expo-router'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, FlatList, ActivityIndicator} from 'react-native'
import {Calendar, DateData} from 'react-native-calendars'
import RNPickerSelect from 'react-native-picker-select'

import {useGetGerechten} from '@/api/gerechten'
import gerechtId from '@/app/home/gerechtDetail/[gerechtId]'
import {IGerecht} from '@/models/IGerecht'
type MarkedDates = {
    [date: string]: {
        marked: boolean
        dotColor: string
    }
}
interface KalenderProps extends IGerecht {}

const Kalender: FunctionComponent<KalenderProps> = ({userId, type, naam, fotoUrl, id, ingredienten, stappenPlan}) => {
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [selectedDish, setSelectedDish] = useState<string | null>(null)
    const [markedDates, setMarkedDates] = useState<MarkedDates>({})
    const [dishes, setDishes] = useState<{[date: string]: string[]}>({})

    const {data: gerechten, isLoading, error} = useGetGerechten()
    const navigation = useNavigation()

    const handleDayPress = (date: DateData) => {
        const selectedDateString = date.dateString
        setSelectedDate(selectedDateString)
        console.log('Geselecteerde datum:', selectedDateString)
        setModalVisible(true) // Open het modale venster wanneer een dag wordt geselecteerd
    }

    const handleAddDish = async () => {
        if (selectedDish) {
            console.log('Gerecht toegevoegd:', selectedDish, 'op', selectedDate)

            setMarkedDates({...markedDates, [selectedDate]: {marked: true, dotColor: 'blue'}}) // Update de gemarkeerde datums

            setDishes(prevDishes => {
                const updatedDishes = {...prevDishes}
                if (updatedDishes[selectedDate]) {
                    updatedDishes[selectedDate].push(selectedDish)
                } else {
                    updatedDishes[selectedDate] = [selectedDish]
                }
                return updatedDishes
            })
            await firestore()
                .collection('agenda')
                .doc(selectedDate)
                .set({
                    dishes: dishes[selectedDate] ? [...dishes[selectedDate], selectedDish] : [selectedDish],
                })
            setSelectedDish(null) // Reset de geselecteerde dish
            setModalVisible(false) // Sluit het modale venster na het toevoegen van het gerecht
        }
    }

    // Transformeer de gerechten naar het juiste formaat voor RNPickerSelect
    const dishesList = gerechten?.map(dish => ({label: dish.naam, value: dish.naam})) || []
    useEffect(() => {
        // Fetch marked dates and dishes from Firestore on component mount
        const fetchDatesAndDishes = async () => {
            const snapshot = await firestore().collection('agenda').get()
            const datesAndDishes: {[date: string]: string[]} = {}
            snapshot.forEach(doc => {
                datesAndDishes[doc.id] = doc.data().dishes
            })
            setDishes(datesAndDishes)
            const marked = Object.keys(datesAndDishes).reduce((acc: MarkedDates, date: string) => {
                acc[date] = {marked: true, dotColor: 'blue'}
                return acc
            }, {})
            setMarkedDates(marked)
        }
        fetchDatesAndDishes()
    }, [])
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
                markedDates={markedDates} // Gebruik de state voor de gemarkeerde datums
                firstDay={1}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centered}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Gerechten voor {selectedDate}</Text>
                        <FlatList
                            data={dishes[selectedDate] || []}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        router.navigate({
                                            pathname: '[gerechtId]',
                                            // Navigeer naar de detailpagina van het gerecht
                                            params: {
                                                gerechtId: id, // Stuur het gerechtId als parameter
                                                type,
                                                naam,
                                                fotoUrl,
                                                ingredienten,
                                                stappenPlan,
                                                userId,
                                            },
                                        })
                                    }}>
                                    <Text style={styles.listItem}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        {isLoading ? (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                            />
                        ) : (
                            <RNPickerSelect
                                onValueChange={value => setSelectedDish(value)}
                                items={dishesList}
                                style={pickerSelectStyles}
                                value={selectedDish}
                                placeholder={{
                                    label: 'Selecteer een gerecht...',
                                    value: null,
                                }}
                            />
                        )}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddDish}>
                            <Text style={styles.buttonText}>Toevoegen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Sluiten</Text>
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
        width: '100%',
    },
    modalText: {
        marginBottom: 15,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonClose: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
    },
    listItem: {
        fontSize: 16,
        padding: 5,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 15,
        marginLeft: 80,
        width: 200,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 15,
        marginLeft: 80,
        width: 200,
    },
})
export default Kalender
