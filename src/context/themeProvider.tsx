import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationLightTheme,
    ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native'
import {FunctionComponent, PropsWithChildren} from 'react'
import {useColorScheme, View} from 'react-native'
import {adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper'

// De navigatie componenten worden opgemaakt via de React Native Navigation library.
// Deze stijlregels moeten natuurlijk wel overeenkomen met het thema van de React Native Paper bibliotheek.
// Via onderstaande functies wordt een licht en donker thema voor React Native Navigation gebouwd op basis van het
// default thema uit React Native Paper of eventueel een custom theme.
const {LightTheme} = adaptNavigationTheme({reactNavigationLight: NavigationLightTheme, materialLight: MD3LightTheme})
const {DarkTheme} = adaptNavigationTheme({reactNavigationDark: NavigationDarkTheme})

const ThemeProvider: FunctionComponent<PropsWithChildren> = ({children}) => {
    const colorScheme = useColorScheme()

    const isDark = colorScheme === 'dark'
    const navigationTheme = isDark ? DarkTheme : LightTheme
    const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme

    return (
        // De PaperProvider wordt gebruikt om het thema van React Native Paper te configureren.
        <PaperProvider theme={paperTheme}>
            {/* De NavigationThemeProvider configureert het thema voor de React Native Paper library. */}
            <NavigationThemeProvider value={navigationTheme}>
                {/* Deze View wrapper is nodig om de witte flashes tijdens het navigeren te vermijden. */}
                <View style={[{backgroundColor: navigationTheme.colors.background, flex: 1}]}>{children}</View>
            </NavigationThemeProvider>
        </PaperProvider>
    )
}

export default ThemeProvider
