import React, {FunctionComponent, useEffect, useState} from 'react'
import {Animated, StyleSheet, Text, View, Modal, TextInput, Button} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {Button as PaperButton} from 'react-native-paper'

import {useAddGerecht, useGetGerechten} from '@/api/gerechten'
import Gerecht from '@/components/gerecht'
import {IGerecht} from '@/models/IGerecht'
import ScrollView = Animated.ScrollView

interface HomeProps extends IGerecht {}

const Home: FunctionComponent<HomeProps> = ({type, id}) => {
    const {data: gerechten} = useGetGerechten()
    const [modalVisible, setModalVisible] = useState(false)
    const [gerechtNaam, setGerechtNaam] = useState('')
    const [gerechtIngredienten, setGerechtIngredienten] = useState('')
    const [gerechtStappenPlan, setGerechtStappenPlan] = useState('')
    const [gerechtType, setGerechtType] = useState('')
    const addGerechtMutation = useAddGerecht()
    const [openDropdown, setOpenDropdown] = useState(false)
    const [valueDropDown, setValueDropDown] = useState('Breakfast') // Verander de initiële waarde naar "Ontbijt"
    const [filteredGerechten, setFilteredGerechten] = useState<IGerecht[] | undefined>([])

    const ontbijtGerechten = gerechten?.filter(gerecht => gerecht.type.toLowerCase() === 'breakfast')
    const lunchGerechten = gerechten?.filter(gerecht => gerecht.type.toLowerCase() === 'lunch')
    const dinerGerechten = gerechten?.filter(gerecht => gerecht.type.toLowerCase() === 'dinner')

    useEffect(() => {
        if (valueDropDown === 'Breakfast') {
            setFilteredGerechten(ontbijtGerechten)
        } else if (valueDropDown === 'Lunch') {
            setFilteredGerechten(lunchGerechten)
        } else if (valueDropDown === 'Dinner') {
            setFilteredGerechten(dinerGerechten)
        }
    }, [valueDropDown]) // Verander de afhankelijkheid naar valueDropDown

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    const handleAddGerecht = () => {
        try {
            addGerechtMutation.mutateAsync({
                naam: gerechtNaam,
                ingredienten: gerechtIngredienten.split(' ,'),
                fotoUrl: 'url_van_de_afbeelding',
                stappenPlan: gerechtStappenPlan.split(' ,'),
                type: gerechtType,
            })
            closeModal()
            setGerechtNaam('')
            setGerechtIngredienten('')
            setGerechtStappenPlan('')
            setGerechtType('')
        } catch (error) {
            console.error('Fout bij het toevoegen van het gerecht:', error)
        }
    }

    return (
        <View>
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    style={styles.dropDown}
                    items={[
                        {label: 'Breakfast', value: 'Breakfast'},
                        {label: 'Lunch', value: 'Lunch'},
                        {label: 'Dinner', value: 'Dinner'},
                    ]}
                    containerStyle={{height: 40}}
                    placeholder="Selecteer type gerecht"
                    open={openDropdown}
                    setOpen={setOpenDropdown}
                    value={valueDropDown}
                    setValue={setValueDropDown}
                />
                <PaperButton
                    style={styles.button}
                    labelStyle={{color: 'white', fontWeight: 'bold', fontSize: 16, width: 100}}
                    onPress={openModal}
                    mode="text">
                    Add Dish
                </PaperButton>
            </View>
            <ScrollView>
                <View style={styles.centered}>
                    <Text style={styles.text}>{valueDropDown}</Text>
                    {filteredGerechten?.map(g => (
                        <Gerecht
                            {...g}
                            key={g.id}
                        />
                    ))}
                </View>

                <Modal
                    animationType="slide"
                    transparent
                    visible={modalVisible}
                    onRequestClose={closeModal}>
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="Naam van het gerecht"
                            value={gerechtNaam}
                            onChangeText={text => setGerechtNaam(text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Ingredienten (gescheiden door komma's)"
                            value={gerechtIngredienten}
                            onChangeText={text => setGerechtIngredienten(text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Stappenplan (gescheiden door komma's)"
                            value={gerechtStappenPlan}
                            onChangeText={text => setGerechtStappenPlan(text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Type van het gerecht"
                            value={gerechtType}
                            onChangeText={text => setGerechtType(text)}
                            style={styles.input}
                        />
                        <Button
                            title="Toevoegen"
                            onPress={handleAddGerecht}
                        />
                        <Button
                            title="Annuleren"
                            onPress={closeModal}
                        />
                    </View>
                </Modal>
            </ScrollView>
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
        color: 'white',
        fontSize: 20,
        marginTop: 50,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 10,
        backgroundColor: '#2e702b',
        borderRadius: 5,
        width: 100,
        height: 50,
        textAlign: 'center',
        lineHeight: 50,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    dropdownContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    button: {
        marginTop: 60,
        alignSelf: 'flex-start',
        backgroundColor: '#30702c',
    },
    dropDown: {
        marginTop: 40,
        marginBottom: 10, // Voeg hier de marginTop toe
    },
})

export default Home
