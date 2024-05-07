import storage from '@react-native-firebase/storage'
import {ParamListBase, RouteProp, useRoute} from '@react-navigation/core'
import {useNavigation} from '@react-navigation/native'
import id from 'ajv/lib/vocabularies/core/id'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native'

import {useDeleteGerecht} from '@/api/gerechten'
import gerechtId from '@/app/home/gerechtDetail/[gerechtId]'
import {IGerecht} from '@/models/IGerecht'

interface GerechtDetailProps extends IGerecht {}

const GerechtDetail: FunctionComponent<GerechtDetailProps> = ({type, naam, fotoUrl, id: gerechtId}) => {
    const navigation = useNavigation() // Gebruik de hook om de addGerecht functie en status te krijgen
    const {mutate: deleteGerecht} = useDeleteGerecht()
    type GerechtDetailRouteParams = {
        type: string
        naam: string
        fotoUrl: string
        gerechtId: string
        ingredienten: string // Define the type for ingredienten
        stappenPlan: string // Define the type for stappenPlan
    }

    const route = useRoute<RouteProp<ParamListBase, 'GerechtDetail'>>()
    const [imageUrl, setImageUrl] = useState<string>('')
    const {
        type: gerechtType,
        naam: gerechtNaam,
        fotoUrl: gerechtUrl,
        ingredienten,
        stappenPlan,
    } = route.params as GerechtDetailRouteParams
    const stappenPlanArray = stappenPlan.split(',')
    const ingredientenArray = ingredienten.split(',')
    useEffect(() => {
        fetchDownloadUrl()
    }, [])

    const fetchDownloadUrl = async () => {
        try {
            const storageRef = storage().refFromURL(gerechtUrl)
            const url = await storageRef.getDownloadURL()
            setImageUrl(url)
            console.log('Downloadbare URL:', url)
        } catch (error) {
            console.error('Fout bij het ophalen van de downloadbare URL:', error)
        }
    }

    useEffect(() => {
        console.log('Ontvangen parameters op detailpagina:', route.params)
    }, [route.params])

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
                    onPress: () => deleteGerecht(gerechtId),
                },
            ],
            {cancelable: true},
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{gerechtType}</Text>
            <Image
                source={{uri: imageUrl}}
                style={styles.image}
            />
            <Text style={styles.text}>{gerechtNaam}</Text>

            <View style={styles.rowContainer}>
                <View style={styles.column}>
                    <Text style={styles.text}>Ingrediënten:</Text>
                    {ingredientenArray.map((step, index) => (
                        <Text
                            key={index}
                            style={styles.text}>
                            {step}
                        </Text>
                    ))}
                </View>
                <View style={styles.column}>
                    <Text style={styles.text}>Stappen Plan:</Text>

                    {stappenPlanArray.map((step, index) => (
                        <Text
                            key={index}
                            style={styles.text}>
                            {step}
                        </Text>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleDelete}>
                <Text style={styles.buttonText}>Verwijderen</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Terug</Text>
            </TouchableOpacity>
        </View>
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
    button: {
        backgroundColor: '#30702c',
        padding: 10,
        width: '50%',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
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
})

export default GerechtDetail
