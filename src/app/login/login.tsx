import {Redirect} from 'expo-router'
import {FunctionComponent} from 'react'
import {StyleSheet, View} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {Button} from 'react-native-paper'

import {AuthProvider, useSignIn} from '@/api/auth'
import useUser from '@/hooks/useUser'
//import login from '~/images/login.jpg'

const Login: FunctionComponent = () => {
    const {mutate: signInWithSocialAuth} = useSignIn()
    const user = useUser()
    //const [assets] = useAssets([login])
    /*const localUri = assets?.at(0)?.localUri
    if (!localUri) {
        return <></>
    }*/
    if (user) {
        return <Redirect href="/home/" />
    }

    return (
        <LinearGradient
            colors={['#274425', '#30702c']}
            style={styles.gradient}>
            <View style={[styles.loginButtonContainer]}>
                <Button
                    icon="google"
                    mode="outlined"
                    labelStyle={{color: 'white'}}
                    contentStyle={[styles.loginButtonContent]}
                    style={[styles.loginButton]}
                    onPress={() => signInWithSocialAuth({provider: AuthProvider.GOOGLE})}>
                    Login with Google
                </Button>
            </View>
        </LinearGradient>
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
        marginTop: 80,
    },
    loginButtonContent: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    gradient: {
        flex: 1,
    },
})

export default Login
