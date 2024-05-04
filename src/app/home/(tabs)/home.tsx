import {useAssets} from 'expo-asset'
import {FunctionComponent, useEffect} from 'react'
import {StyleSheet, Text, View} from 'react-native'

import {useGetGerechten} from '@/api/gerechten'
import Gerecht from '@/components/gerecht'
import {IGerecht} from '@/models/IGerecht'

interface HomeProps extends IGerecht {}

const Home: FunctionComponent<HomeProps> = type => {
    const {data: gerechten} = useGetGerechten()
    const ontbijtGerechten = gerechten?.filter(gerecht => gerecht.type === 'Ontbijt')
    const lunchGerechten = gerechten?.filter(gerecht => gerecht.type === 'Lunch')
    const dinerGerechten = gerechten?.filter(gerecht => gerecht.type === 'Diner')

    return (
        <>
            <View style={styles.centered}>
                <Text style={styles.text}>Ontbijt</Text>
                {ontbijtGerechten?.map(g => (
                    <Gerecht
                        {...g}
                        key={g.id}
                    />
                ))}
            </View>
            <View style={styles.centered}>
                <Text style={styles.text}>Lunch</Text>
                {lunchGerechten?.map(g => (
                    <Gerecht
                        {...g}
                        key={g.id}
                    />
                ))}
            </View>
            <View style={styles.centered}>
                <Text style={styles.text}>Diner</Text>
                {dinerGerechten?.map(g => (
                    <Gerecht
                        {...g}
                        key={g.id}
                    />
                ))}
            </View>
        </>
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
        margin: 30,
    },
})
export default Home
