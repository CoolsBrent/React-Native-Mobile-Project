import {MaterialCommunityIcons} from '@expo/vector-icons'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useFonts} from 'expo-font'
import {SplashScreen, Stack} from 'expo-router'
import {Drawer} from 'expo-router/drawer'
import {FunctionComponent, useEffect} from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

import {useGetCurrentUser} from '@/api/auth'
import ThemeProvider from '@/context/themeProvider'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // __DEV__ is een globale variabele die beschikbaar is in elk Expo project.
            // Net zoals import.meta.env.PROD in een Vite project kunnen we deze variable gebruiken om te bepalen of we
            // in een development of productieomgeving zitten.
            refetchOnWindowFocus: !__DEV__,
        },
    },
})

// Verberg het splashscreen tot alle nodige fonts geladen zijn.
SplashScreen.preventAutoHideAsync()

// Zorg ervoor dat de useTheme hook werkt in de RootLayout component.
const Providers: FunctionComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{flex: 1}}>
                <ThemeProvider>
                    <LoadResources />
                </ThemeProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    )
}

const LoadResources: FunctionComponent = () => {
    const {isFetched: userLoaded} = useGetCurrentUser()

    // Laad de MaterialCommunityIcons fonts in.
    const [fontsLoaded, fontsError] = useFonts({
        ...MaterialCommunityIcons.font,
    })

    useEffect(() => {
        if (fontsError) throw fontsError
    }, [fontsError])

    useEffect(() => {
        if (fontsLoaded && userLoaded) {
            // Verberg het splashscreen als alle fonts geladen zijn.
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded, userLoaded])

    if (!fontsLoaded) {
        return <></>
    }

    return (
        <>
            <RootLayout />
        </>
    )
}

const RootLayout: FunctionComponent = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{title: 'Login'}}
            />
            <Stack.Screen
                name="home/index"
                options={{title: 'Home'}}
            />
            <Stack.Screen
                name="gerecht"
                options={{title: 'Gerechten'}}
            />
            <Stack.Screen
                name="kalender"
                options={{title: 'Kalender'}}
            />
            <Stack.Screen
                name="profiel/index"
                options={{title: 'Profiel'}}
            />
        </Stack>
    )
}
export default Providers
