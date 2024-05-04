import {FunctionComponent, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Calendar, DateData} from 'react-native-calendars'

interface KalenderProps {}

const Kalender: FunctionComponent<KalenderProps> = () => {
    const [selectedDate, setSelectedDate] = useState<string>('')

    const handleDayPress = (date: DateData) => {
        // Hier kun je de geselecteerde datum verwerken
        // Bijvoorbeeld: navigeer naar een nieuw scherm met informatie over de geselecteerde datum
        const selectedDateString = date.dateString
        setSelectedDate(selectedDateString)
        console.log('Geselecteerde datum:', selectedDateString)
    }
    return (
        <View style={{flex: 1}}>
            <Calendar
                onDayPress={handleDayPress}
                // Aanpassen van de stijl van de kalender is optioneel
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 350,
                    margin: 10,
                    marginTop: 50,
                }}
                // Opties voor de kalender (zie documentatie voor alle beschikbare opties)
                // Hier is een voorbeeld van het markeren van bepaalde data
                markedDates={{
                    [selectedDate]: {selected: true, selectedColor: 'blue'},
                    '2024-05-01': {marked: true, dotColor: 'red'},
                    '2024-05-05': {marked: true, dotColor: 'blue'},
                    '2024-05-10': {marked: true, dotColor: 'green'},
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white', // Witte tekstkleur
        fontSize: 20,
    },
})

export default Kalender
