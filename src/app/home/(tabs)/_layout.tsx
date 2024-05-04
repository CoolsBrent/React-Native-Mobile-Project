import {Tabs} from 'expo-router'
import {FunctionComponent} from 'react'
import {Icon, useTheme} from 'react-native-paper'

const TaskLayout: FunctionComponent = () => {
    const theme = useTheme()

    return (
        // De tabs component kan gebruikt worden om onderaan de pagina een tabbalk toe te voegen.
        // Als je bovenaan de pagina een tabbalk wilt toevoegen, moet je een material-top-tap component van
        // React Native Navigation wrappen zoals beschreven in onderstaande YouTube video.
        // https://www.youtube.com/watch?v=AP08wUBhpKM.
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurface,
                headerShown: true,
            }}>
            <Tabs.Screen
                name="kalender"
                options={{
                    title: 'Kalender',
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            source="calendar-outline"
                            size={size}
                            color={color}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            source="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profiel"
                options={{
                    title: 'Profiel',
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            source="account-outline"
                            size={size}
                            color={color}
                        />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}

export default TaskLayout
