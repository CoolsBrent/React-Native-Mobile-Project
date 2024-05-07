import {Link, Stack} from 'expo-router'
import {FunctionComponent} from 'react'

const TabLayout: FunctionComponent = () => {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="(tabs)"
                options={{headerTitle: 'Home', headerShown: false}}
            />
            <Stack.Screen
                name="gerechtDetail/[gerechtId]"
                options={{headerTitle: 'Detail', headerShown: false}}
            />
        </Stack>
    )
}
export default TabLayout
