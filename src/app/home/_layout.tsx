import {Stack} from 'expo-router'
import {FunctionComponent} from 'react'

const TabLayout: FunctionComponent = () => {
    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{headerTitle: 'Home', headerShown: false}}
            />
        </Stack>
    )
}
export default TabLayout
