import {useAssets} from 'expo-asset'
import {FunctionComponent} from 'react'
import {Image, StyleSheet, Text} from 'react-native'
import {Card} from 'react-native-paper'

import {IGerecht} from '@/models/IGerecht'
//import food from '~images/food.jpg'

interface GerechtProps extends IGerecht {}

const Gerecht: FunctionComponent<GerechtProps> = ({type, naam}) => {
    /* const [assets] = useAssets([food])
   // const localUri = assets?.at(0)?.localUri
   // if (!localUri) {
   //     return <></>
    }*/
    return (
        <Card style={styles.gerecht}>
            <Text style={styles.text}>{naam}</Text>
            <Text style={styles.text}>{type}</Text>
        </Card>
    )
}
const styles = StyleSheet.create({
    gerecht: {
        margin: 10,
        width: 350,
        height: 300,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white', // Witte tekstkleur
        fontSize: 16,
        alignSelf: 'center',
    },
})

export default Gerecht
