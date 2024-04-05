import {FunctionComponent} from 'react'
import {View, StyleSheet, Text} from 'react-native'

const Index: FunctionComponent = () => {
    return (
        <View style={[styles.centered]}>
            <Text>Project Mobile Development</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Index
