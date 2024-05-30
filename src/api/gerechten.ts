import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'
import id from 'ajv/lib/vocabularies/core/id'

import {
    documentData,
    getCollectionRef,
    getDataFromDocumentSnapshot,
    getDataFromQuerySnapshot,
    getDocumentRef,
} from '@/api/firestoreUtils'
import gerecht from '@/components/gerecht'
import useUser from '@/hooks/useUser'
import {IGerecht} from '@/models/IGerecht'

//region Mutations & queries

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          MUTATIONS & QUERIES
 * ---------------------------------------------------------------------------------------------------------------------
 */

export const useGetGerechten = (): UseQueryResult<IGerecht[], Error> => {
    const user = useUser()

    return useQuery({
        queryKey: ['gerechten', user?.uid], // Maak de gebruikers-ID onderdeel van de queryKey
        queryFn: async () => {
            if (user) {
                try {
                    // Query voor gerechten van de ingelogde gebruiker
                    const userSnapshot = await firestore().collection('gerechten').where('userId', '==', user.uid).get()

                    const userDishes = userSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as IGerecht[]

                    // Query voor standaardgerechten van de common user
                    const commonUserSnapshot = await firestore()
                        .collection('gerechten')
                        .where('userId', '==', 'SYoVinlb44TMM6zrjtryDJZSkRa2') // Vervang 'commonUserId' door de ID van de common user
                        .get()

                    const commonUserDishes = commonUserSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as IGerecht[]

                    // Combineer gerechten van de ingelogde gebruiker en de standaardgerechten van de common user
                    const combinedDishes = [...userDishes, ...commonUserDishes]

                    return combinedDishes
                } catch (error) {
                    console.error('Error fetching dishes:', error)
                    throw new Error('Error fetching dishes')
                }
            } else {
                return []
            }
        },
    })
}

export const useAddGerecht = (): UseMutationResult<IGerecht, Error, AddGerechtParams, void> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addGerecht,
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['gerechten']})
        },
    })
}
export const useDeleteGerecht = (): UseMutationResult<void, Error, string, void> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteGerecht,
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['gerechten']})
        },
    })
}
export const useUpdateGerecht = (): UseMutationResult<IGerecht, Error, UpdateGerechtParams, void> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateGerecht,
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['gerechten']})
        },
    })
}
export const useGetGerechtById = (gerechtId: string | undefined): UseQueryResult<IGerecht | undefined> => {
    return useQuery({
        queryKey: ['gerecht', gerechtId], // Definieer een unieke queryKey voor het gerecht
        queryFn: getGerechten,
        select: gerecht => gerecht.find(gerecht => gerecht.id === gerechtId),
    })
}

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          API functions
 * ---------------------------------------------------------------------------------------------------------------------
 */

const getGerechten = async (): Promise<IGerecht[]> => {
    const querySnapshot = await getCollectionRef<IGerecht>('gerechten').get()
    return getDataFromQuerySnapshot(querySnapshot, 'id')
}
interface AddGerechtParams {
    naam: string
    ingredienten: string[]
    fotoUrl: string
    stappenPlan: string[]
    type: string
    userId: string
}

const addGerecht = async ({
    naam,
    ingredienten,
    fotoUrl,
    stappenPlan,
    type,
    userId,
}: AddGerechtParams): Promise<IGerecht> => {
    const ref = getCollectionRef<IGerecht>('gerechten')
    const user = auth().currentUser

    if (user === null) {
        throw new Error('User not found')
    }

    const newDocReference = await ref.add({
        naam,
        ingredienten,
        fotoUrl,
        stappenPlan,
        type,
        userId,
    })

    const querySnapshot = await newDocReference.get()

    const newDoc = await getDataFromDocumentSnapshot<IGerecht>(querySnapshot, 'id')
    return newDoc as IGerecht
}

const deleteGerecht = async (gerechtId: string): Promise<void> => {
    const ref = getCollectionRef<IGerecht>('gerechten')
    await ref.doc(gerechtId).delete()
}
export interface UpdateGerechtParams {
    gerechtId: string
    data: Partial<IGerecht>
}

const updateGerecht = async ({gerechtId, data}: UpdateGerechtParams): Promise<IGerecht> => {
    const ref = getCollectionRef<IGerecht>('gerechten')
    await ref.doc(gerechtId).update(data)

    // Haal het bijgewerkte gerecht op
    const updatedDoc = await ref.doc(gerechtId).get()
    return {
        id: gerechtId,
        ...updatedDoc.data(),
    } as IGerecht
}
const getGerechtById = async (gerechtId: string): Promise<IGerecht | null> => {
    try {
        const docRef = getDocumentRef<IGerecht>('gerechten', gerechtId)
        const docSnapshot = await docRef.get()

        if (docSnapshot.exists) {
            return {
                id: gerechtId,
                ...docSnapshot.data(),
            } as IGerecht
        } else {
            return null // Gerecht niet gevonden
        }
    } catch (error) {
        console.error('Fout bij het ophalen van het gerecht:', error)
        return null
    }
}
