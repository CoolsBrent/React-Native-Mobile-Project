import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {Animated, StyleSheet, Text, View, Modal, TextInput, Button, TouchableOpacity, Image} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {Button as PaperButton} from 'react-native-paper'

import ScrollView = Animated.ScrollView
import {useAddGerecht, useGetGerechten} from '@/api/gerechten'
import Gerecht from '@/components/gerecht'
import useUser from '@/hooks/useUser'
import {IGerecht} from '@/models/IGerecht'

import storage from '@react-native-firebase/storage'

interface HomeProps extends IGerecht {}

const Home: FunctionComponent<HomeProps> = ({type, id}) => {
    const {data: gerechten, refetch: refetchGerechten} = useGetGerechten()
    const user = useUser()
    const [modalVisible, setModalVisible] = useState(false)
    const [gerechtNaam, setGerechtNaam] = useState('')
    const [gerechtIngredienten, setGerechtIngredienten] = useState('')
    const [gerechtStappenPlan, setGerechtStappenPlan] = useState('')
    const [gerechtType, setGerechtType] = useState('Breakfast')
    const addGerechtMutation = useAddGerecht()
    const [openDropdown, setOpenDropdown] = useState(false)
    const [valueDropDown, setValueDropDown] = useState('Breakfast') // Verander de initiële waarde naar "Ontbijt"
    const [filteredGerechten, setFilteredGerechten] = useState<IGerecht[] | undefined>([])
    const [errorMessages, setErrorMessages] = useState<string[]>([]) // Gebruik een array voor het opslaan van foutmeldingen
    const [image, setImage] = useState('')
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
    }, [valueDropDown, gerechten]) // Verander de afhankelijkheid naar valueDropDown

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = async () => {
        setModalVisible(false)
        await refetchGerechten()
    }

    const handleAddGerecht = async () => {
        try {
            const errors: string[] = []

            if (!gerechtNaam) {
                errors.push('Fill in a name.')
            }

            if (!gerechtIngredienten) {
                errors.push('Fill in ingredients.')
            }
            if (!gerechtStappenPlan) {
                errors.push('Fill in steps.')
            }
            if (!gerechtType) {
                errors.push('Select a type of dish.')
            }

            if (errors.length > 0) {
                setErrorMessages(errors)
                return
            }
            if (!user) {
                // Voer geen acties uit als user null is
                return
            }

            await addGerechtMutation.mutateAsync({
                naam: gerechtNaam,
                ingredienten: gerechtIngredienten.split(',').map(x => x.trim()),
                fotoUrl: image,
                stappenPlan: gerechtStappenPlan.split(',').map(x => x.trim()),
                type: gerechtType,
                userId: user.uid,
            })

            await closeModal()
            setGerechtNaam('')
            setGerechtIngredienten('')
            setGerechtStappenPlan('')
            setGerechtType('')
            setImage('')
        } catch (error) {
            console.error('Fout bij het toevoegen van het gerecht:', error)
        }
    }

    const pickImage = async () => {
        await ImagePicker.requestCameraPermissionsAsync()
        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.front,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (!result.canceled) {
            const uploadedImageUrl = await uploadImage(result.assets[0].uri)
            setImage(uploadedImageUrl)
            console.log('Uploaded Image URL:', uploadedImageUrl)
        }
    }

    const uploadImage = async (imageUri: string) => {
        try {
            if (!imageUri) {
                throw new Error('Image URI is null or undefined.')
            }

            const {uri} = await FileSystem.getInfoAsync(imageUri)
            const storageRef = storage().ref()
            const photoRef = storageRef.child('images/' + Date.now() + '.jpg')

            const response = await fetch(uri)
            const blob = await response.blob()

            await photoRef.put(blob)

            const downloadURL = await photoRef.getDownloadURL()
            console.log('Downloadable Image URL:', downloadURL)
            return downloadURL // Return the download URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error // Propagate the error further up so it can be handled by the calling code
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
                    placeholder="Select type dish"
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
                        <Text style={styles.modalText}>Add Dish</Text>
                        <TextInput
                            placeholder="Name of the dish"
                            value={gerechtNaam}
                            onChangeText={text => setGerechtNaam(text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Ingredients (seperated by commas)"
                            value={gerechtIngredienten}
                            onChangeText={text => setGerechtIngredienten(text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Steps (seperated by commas)"
                            value={gerechtStappenPlan}
                            onChangeText={text => setGerechtStappenPlan(text)}
                            style={styles.input}
                        />
                        <DropDownPicker
                            items={[
                                {label: 'Breakfast', value: 'Breakfast'},
                                {label: 'Lunch', value: 'Lunch'},
                                {label: 'Dinner', value: 'Dinner'},
                            ]}
                            containerStyle={{height: 80}}
                            placeholder="Select type of dish"
                            open={openDropdown}
                            setOpen={setOpenDropdown}
                            value={gerechtType}
                            setValue={setGerechtType}
                        />
                        <Image
                            source={{uri: image}}
                            style={{width: 150, height: 150, borderRadius: 75}}
                        />
                        {errorMessages.map((errorMessage, index) => (
                            <Text
                                key={index}
                                style={styles.errorMessage}>
                                {errorMessage}
                            </Text>
                        ))}
                        <TouchableOpacity
                            onPress={pickImage}
                            style={styles.buttonModalCamera}>
                            <Text style={styles.buttonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonModalToevoegen}
                            onPress={handleAddGerecht}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={closeModal}
                            style={styles.buttonModalAnnuleren}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
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
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        padding: 5,
        fontSize: 16,
        textAlign: 'left',
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
    buttonModalCamera: {
        backgroundColor: '#30702c',
        padding: 10,
        width: '50%',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    buttonModalAnnuleren: {
        backgroundColor: '#af0707',
        padding: 10,
        width: '50%',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    buttonModalToevoegen: {
        backgroundColor: '#007bff',
        padding: 10,
        width: '50%',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropDown: {
        marginTop: 40,
        marginBottom: 10, // Voeg hier de marginTop toe
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
})

export default Home
