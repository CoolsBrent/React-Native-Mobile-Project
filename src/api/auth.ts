import auth from '@react-native-firebase/auth'
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin'
import {useMutation, UseMutationResult, useQuery, useQueryClient} from '@tanstack/react-query'

import {AuthCredential, User} from '@/models/firebaseTypes'

//region Mutations & queries

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          MUTATIONS & QUERIES
 * ---------------------------------------------------------------------------------------------------------------------
 */

export function useSignOut(): UseMutationResult<void, Error, void, void> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: signOut,
        onSettled: () => queryClient.invalidateQueries({queryKey: ['currentUser']}),
    })
}

export function useSignIn(): UseMutationResult<User | null, Error, SignInParams, void> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: signIn,
        onSettled: () => queryClient.invalidateQueries({queryKey: ['currentUser']}),
    })
}

export function useGetCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        // Aangezien de gebruiker nooit kan wijzigen tenzij de gebruiker uitlogt, kunnen we de staleTime en cacheTime op
        // Infinity zetten.
        gcTime: Infinity,
        staleTime: Infinity,
    })
}

//endregion

//region API functions

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          API functions
 * ---------------------------------------------------------------------------------------------------------------------
 */

// Een opsomming van de verschillende providers die gebruikt kunnen worden om in te loggen.
// De waarde van de provider wordt teruggegeven door Firebase, de mogelijke waarden zijn:
// "apple.com", "facebook.com", "gc.apple.com", "github.com", "google.com", "microsoft.com", "playgames.google.com",
// "twitter.com", "yahoo.com" en "phone".
// Daarnaast kunnen ook Open ID Connect providers gebruikt worden, maar deze vereisen wat meer configuratie.
export enum AuthProvider {
    GOOGLE = 'google.com',
}

interface SignInParams {
    provider: AuthProvider
}

async function signIn({provider}: SignInParams): Promise<User | null> {
    let credential: AuthCredential | null

    switch (provider) {
        // De onderstaande werkwijze kan uitgebreid worden naar andere providers.
        // De manier waarop de credential aangemaakt wordt, is afhankelijk van de provider.
        case AuthProvider.GOOGLE:
            credential = await createGoogleCredential()
            break
    }

    if (!credential) return null

    const result = await auth().signInWithCredential(credential)
    return result.user
}

async function signOut(): Promise<void> {
    const user = auth().currentUser

    if (!user) {
        return
    }

    // Log uit bij Firebase.
    await auth().signOut()

    // Gebruik de provider informatie die uit Firebase teruggegeven wordt om de juiste providers te selecteren en uit
    // te loggen bij de identity provider.
    const provider = user.providerData[0].providerId

    switch (provider) {
        case AuthProvider.GOOGLE:
            await GoogleSignin.signOut()
            break
    }
}

// Configureer de Google sign-in plugin, hiervoor is het webclient ID uit google-services.json nodig.
GoogleSignin.configure({webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID})

async function createGoogleCredential(): Promise<AuthCredential | null> {
    try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()
        return auth.GoogleAuthProvider.credential(userInfo.idToken)
    } catch (err) {
        const error = err as {code: string}

        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // De gebruiker heeft de inlogprocedure geannuleerd. Deze call kan genegeerd worden.
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // Er is al een inlogproces bezig. Deze call kan genegeerd worden.
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // Er is een probleem met het toestel van de gebruiker dat niet opgelost kan worden in onze code.
            throw new Error('Play services are not available')
        } else {
            // Dit zou nooit mogen gebeuren.
            throw new Error('Something went wrong.')
        }
    }
    return null
}

async function getCurrentUser(): Promise<User | null> {
    return auth().currentUser
}

//endregion
