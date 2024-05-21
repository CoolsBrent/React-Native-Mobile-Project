import storage from '@react-native-firebase/storage'
import {router} from 'expo-router'
import {FunctionComponent, useEffect, useState} from 'react'
import {ImageBackground, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useTheme} from 'react-native-paper'

import {IGerecht} from '@/models/IGerecht'

interface GerechtProps extends IGerecht {}

const Gerecht: FunctionComponent<GerechtProps> = ({userId, type, naam, fotoUrl, id, ingredienten, stappenPlan}) => {
    const [imageUrl, setImageUrl] = useState<string>(fotoUrl)
    const {colors} = useTheme()

    useEffect(() => {
        fetchDownloadUrl()
    }, [fotoUrl])

    const fetchDownloadUrl = async () => {
        try {
            const storageRef = storage().refFromURL(fotoUrl)
            const url = await storageRef.getDownloadURL()
            setImageUrl(url)
            console.log('Downloadbare URL:', url)
        } catch (error) {
            console.error('Fout bij het ophalen van de downloadbare URL:', error)
        }
    }

    return (
        <TouchableOpacity
            style={styles.gerecht}
            onPress={() =>
                router.navigate({
                    pathname: 'home/gerechtDetail/[gerechtId]',
                    params: {
                        type,
                        naam,
                        fotoUrl,
                        gerechtId: id,
                        ingredienten,
                        stappenPlan,
                        userId,
                    },
                })
            }>
            <ImageBackground
                key={fotoUrl}
                source={{uri: imageUrl}}
                style={[styles.gerecht, {borderRadius: 10}]}
                imageStyle={{opacity: 0.6}}
                resizeMode="cover">
                <Text style={[styles.text, {color: colors.onSurface}]}>{type}</Text>
                <Text style={[styles.text, {color: colors.onSurface}]}>{naam}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    gerecht: {
        width: 350,
        height: 150,
        margin: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    text: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
export default Gerecht
