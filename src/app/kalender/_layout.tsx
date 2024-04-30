import {Redirect, Stack} from 'expo-router'

import useUser from '@/hooks/useUser'

const KalenderLayout = () => {
    const user = useUser()

    if (!user) {
        return <Redirect href="../login/login" />
    }
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{title: 'Kalender', headerShown: false}}
            />
        </Stack>
    )
}

export default KalenderLayout
