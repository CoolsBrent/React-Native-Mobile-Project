import React, {FunctionComponent, useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'

interface DetailDagProps {
    selectedDate: string
    onAddDish: () => void
    onCloseModal: () => void
}

const DetailDag: FunctionComponent<DetailDagProps> = ({selectedDate, onAddDish, onCloseModal}) => {
    const [dishName, setDishName] = useState<string>('')

    return (
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
                    onPress={() => {
                        onAddDish()
                        onCloseModal()
                    }}>
                    <Text style={styles.buttonText}>Toevoegen</Text>
                </TouchableOpacity>
            </View>
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

export default DetailDag
