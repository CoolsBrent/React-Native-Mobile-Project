import {FunctionComponent} from 'react'
import {View, StyleSheet, Text} from 'react-native'

const Login: FunctionComponent = () => {
    return (
        <View style={[styles.centered]}>
            <Text>Home</Text>
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

export default Login
