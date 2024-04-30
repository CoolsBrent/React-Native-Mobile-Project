import {Stack} from 'expo-router'

const GerechtLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{title: 'Gerechten', headerShown: false}}
            />
        </Stack>
    )
}

export default GerechtLayout
