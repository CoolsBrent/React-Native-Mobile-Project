import storage from '@react-native-firebase/storage'
import {useRoute, RouteProp, ParamListBase} from '@react-navigation/core'
import {useNavigation} from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, TextInput, Animated} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {PanGestureHandler, PanGestureHandlerGestureEvent, State} from 'react-native-gesture-handler'
import {useTheme} from 'react-native-paper'

import ScrollView = Animated.ScrollView
import {UpdateGerechtParams, useDeleteGerecht, useGetGerechtById, useUpdateGerecht} from '@/api/gerechten'

interface GerechtDetailProps {
    id?: string
}

const GerechtDetail: FunctionComponent<GerechtDetailProps> = ({id: gerechtId}) => {
    const navigation = useNavigation()
    const {mutate: deleteGerecht} = useDeleteGerecht()
    const {mutate: updateGerecht} = useUpdateGerecht() // Gebruik de update hook
    const {colors} = useTheme()
    const {data} = useGetGerechtById(gerechtId!)

    type GerechtDetailRouteParams = {
        type: string
        naam: string
        fotoUrl: string
        gerechtId: string
        ingredienten: string
        stappenPlan: string
        userId: string
    }
    const route = useRoute<RouteProp<ParamListBase, 'GerechtDetail'>>()

    const {
        type: gerechtType,
        naam: gerechtNaam,
        fotoUrl: gerechtUrl,
        ingredienten = '',
        stappenPlan = '',
        userId = '',
    } = route.params as GerechtDetailRouteParams
    const [imageUrl, setImageUrl] = useState<string>(gerechtUrl)
    const [modalVisible, setModalVisible] = useState(false)
    const [newNaam, setNewNaam] = useState<string>(gerechtNaam)
    const [newType, setNewType] = useState<string>(gerechtType)
    const [newIngredienten, setNewIngredienten] = useState<string>(ingredienten)
    const [newStappenPlan, setNewStappenPlan] = useState<string>(stappenPlan)
    const [newFotoUrl, setNewFotoUrl] = useState<string>(gerechtUrl)
    const [errorMessages, setErrorMessages] = useState<string[]>([]) // Gebruik een array voor het opslaan van foutmeldingen
    const [openDropdown, setOpenDropdown] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

    const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(stappenPlan.split(',').length).fill(false))

    useEffect(() => {
        fetchDownloadUrl()
    }, [])

    const fetchDownloadUrl = async () => {
        try {
            const storageRef = storage().refFromURL(gerechtUrl)
            const url = await storageRef.getDownloadURL()
            setImageUrl(url)
        } catch (error) {
            console.error('Fout bij het ophalen van de downloadbare URL:', error)
        }
    }
    const pickNewImage = async () => {
        await ImagePicker.requestCameraPermissionsAsync()
        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.front,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (!result.canceled) {
            const uploadedImageUrl = await uploadImage(result.assets[0].uri)
            setNewFotoUrl(uploadedImageUrl)
            console.log('Uploaded Image URL:', uploadedImageUrl)
        } else {
            // Als de gebruiker geen nieuwe foto heeft geselecteerd,
            // behoud de oude foto-URL
            setNewFotoUrl(imageUrl)
            console.log('No new image selected. Keeping the old one.')
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
    const handleSave = () => {
        if (!gerechtId) {
            console.error('gerechtId is undefined')
            return // stop de functie als gerechtId undefined is
        }
        const errors: string[] = []

        if (!newNaam) {
            errors.push('Fill in a name.')
        }

        if (!newIngredienten) {
            errors.push('Fill in ingredients.')
        }
        if (!newStappenPlan) {
            errors.push('Fill in steps.')
        }
        if (!newType) {
            errors.push('Select a type of dish.')
        }

        if (errors.length > 0) {
            setErrorMessages(errors)
            return
        }
        const updateParams: UpdateGerechtParams = {
            gerechtId,
            data: {
                fotoUrl: newFotoUrl,
                type: newType,
                naam: newNaam,
                ingredienten: newIngredienten.split(',').map(x => x.trim()),
                stappenPlan: newStappenPlan.split(',').map(x => x.trim()),
            },
        }
        updateGerecht(updateParams, {
            onSuccess: () => {
                console.log('Gerecht succesvol geüpdatet')
                setModalVisible(false)
                navigation.goBack()
            },
            onError: error => {
                console.error('Fout bij het updaten van het gerecht:', error)
                Alert.alert('Error', 'Er is iets misgegaan bij het updaten van het gerecht.')
            },
        })
    }
    const {data: gerecht, isLoading, error} = useGetGerechtById(gerechtId || '')
    const commonUserId = 'SYoVinlb44TMM6zrjtryDJZSkRa2'

    const handleDelete = () => {
        Alert.alert(
            'Gerecht verwijderen',
            'Weet je zeker dat je dit gerecht wilt verwijderen?',
            [
                {
                    text: 'Annuleren',
                    style: 'cancel',
                },
                {
                    text: 'Verwijderen',
                    style: 'destructive',
                    onPress: async () => {
                        deleteGerecht(gerechtId || '')
                        navigation.goBack()
                    },
                },
            ],
            {cancelable: true},
        )
    }
    const completeStep = (index: number) => {
        const updatedCompletedSteps = [...completedSteps]
        updatedCompletedSteps[index] = true
        setCompletedSteps(updatedCompletedSteps)
        setCurrentStepIndex(index + 1) // Ga naar de volgende stap
    }
    const gestureHandler = (event: PanGestureHandlerGestureEvent) => {
        const {nativeEvent} = event
        if (nativeEvent.state === State.END) {
            const translationX = nativeEvent.translationX

            if (translationX < -100) {
                // Als de swipe naar links groter is dan 100 pixels
                // Voer actie uit voor het voltooien van de stap
                completeStep(currentStepIndex)
            }
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={[styles.text, {color: colors.onSurface, marginTop: 50}]}>{gerechtType}</Text>

                <Image
                    source={{uri: imageUrl}}
                    style={styles.image}
                />
                <Text style={[styles.text, {color: colors.onSurface}]}>{gerechtNaam}</Text>

                <View style={styles.rowContainer}>
                    <View style={styles.column}>
                        <Text style={[styles.text, {color: colors.onSurface}]}>Ingredients:</Text>
                        {ingredienten.split(',').map((item, index) => (
                            <Text
                                key={index}
                                style={[styles.text, {color: colors.onSurface}]}>
                                {item}
                            </Text>
                        ))}
                    </View>
                    <PanGestureHandler
                        onGestureEvent={gestureHandler}
                        onHandlerStateChange={gestureHandler}>
                        <Animated.View style={styles.column}>
                            <Text style={[styles.text, {color: colors.onSurface}]}>Steps:</Text>
                            {stappenPlan.split(',').map((item, index) => (
                                <Text
                                    key={index}
                                    style={[
                                        styles.text,
                                        completedSteps[index] && styles.completedStep,
                                        {color: colors.onSurface},
                                    ]}>
                                    {item}
                                </Text>
                            ))}
                        </Animated.View>
                    </PanGestureHandler>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '80%'}}>
                    {userId !== commonUserId && (
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity
                                style={styles.buttonUpdate}
                                onPress={() => setModalVisible(true)}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {userId !== commonUserId && (
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity
                                style={styles.buttonVerwijderen}
                                onPress={handleDelete}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.buttonTerug}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Edit Dish</Text>
                            <TextInput
                                placeholder="Name of the dish"
                                style={styles.input}
                                value={newNaam}
                                onChangeText={setNewNaam}
                            />

                            <TextInput
                                placeholder="Ingredients (seperated by commas)"
                                style={styles.input}
                                value={newIngredienten}
                                onChangeText={setNewIngredienten}
                            />
                            <TextInput
                                placeholder="Steps (seperated by commas)"
                                style={styles.input}
                                value={newStappenPlan}
                                onChangeText={setNewStappenPlan}
                            />
                            <DropDownPicker
                                items={[
                                    {label: 'Breakfast', value: 'Breakfast'},
                                    {label: 'Lunch', value: 'Lunch'},
                                    {label: 'Dinner', value: 'Dinner'},
                                ]}
                                containerStyle={{height: 80}}
                                placeholder="Select type dish"
                                open={openDropdown}
                                setOpen={setOpenDropdown}
                                value={gerechtType}
                                setValue={setNewType}
                            />
                            <Image
                                source={{uri: newFotoUrl}}
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
                                style={styles.buttonTerug}
                                onPress={pickNewImage}>
                                <Text style={styles.buttonText}>New Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonSave}
                                onPress={handleSave}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonCancel}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    buttonTerug: {
        backgroundColor: '#30702c',
        padding: 10,
        width: 150,
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    buttonVerwijderen: {
        backgroundColor: '#af0707',
        padding: 10,
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#4CAF50' /* Green */,
        color: 'white',
        textAlign: 'center',
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 150,
        margin: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    column: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    buttonUpdate: {
        backgroundColor: '#007bff',
        padding: 10,
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
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
    buttonSave: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 5,
        width: 150,
    },
    buttonCancel: {
        backgroundColor: '#af0707',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 5,
        width: 150,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
    completedStep: {
        color: 'green', // Kleur van de voltooide stap
        // Doorstrepen van de tekst
        // Andere stijlen die je wilt toepassen op voltooide stappen
    },
})

export default GerechtDetail
