import {Redirect} from 'expo-router'
import {FunctionComponent} from 'react'
import {StyleSheet, View} from 'react-native'
import {Avatar, Button, TextInput, useTheme} from 'react-native-paper'

import {useSignOut} from '@/api/auth'
import useUser from '@/hooks/useUser'

const Profiel: FunctionComponent = () => {
    const user = useUser()
    const theme = useTheme()
    const {mutate: signOut} = useSignOut()
    if (!user) {
        return <Redirect href="/login/login" />
    }
    return (
        <View style={[styles.container]}>
            <Avatar.Image
                size={80}
                source={{uri: user?.photoURL as string}}
            />

            <View style={[styles.userInfoContainer]}>
                <TextInput
                    mode="outlined"
                    disabled
                    style={[styles.userInfo]}
                    value={user?.displayName ?? 'Anonymous'}
                    label="Name"
                />
                <TextInput
                    mode="outlined"
                    disabled
                    style={[styles.userInfo]}
                    value={user?.email as string}
                    label="Email"
                />

                <Button
                    icon="logout"
                    onPress={() => signOut()}
                    style={[styles.userInfo, styles.squareButton]}
                    buttonColor={theme.colors.error}
                    textColor={theme.colors.onError}>
                    Logout
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 200,
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },
    userInfoContainer: {
        alignSelf: 'flex-start',
        flexGrow: 1,
        width: '100%',
    },
    userInfo: {
        margin: 10,
    },
    squareButton: {
        borderRadius: 0,
    },
})

export default Profiel
