import {Redirect} from 'expo-router'
import {FunctionComponent} from 'react'
import {StyleSheet, View} from 'react-native'
import {Button} from 'react-native-paper'

import {AuthProvider, useSignIn} from '@/api/auth'
import useUser from '@/hooks/useUser'

const Login: FunctionComponent = () => {
    const {mutate: signInWithSocialAuth} = useSignIn()
    const user = useUser()

    if (user) {
        return <Redirect href="/home/" />
    }

    return (
        <View style={[styles.loginButtonContainer]}>
            <Button
                icon="google"
                mode="outlined"
                contentStyle={[styles.loginButtonContent]}
                style={[styles.loginButton]}
                onPress={() => signInWithSocialAuth({provider: AuthProvider.GOOGLE})}>
                Login with Google
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    loginButtonContainer: {
        flex: 1,
        margin: 20,
    },
    loginButton: {
        width: '100%',
        marginVertical: 10,
        borderRadius: 0,
    },
    loginButtonContent: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
})

export default Login
