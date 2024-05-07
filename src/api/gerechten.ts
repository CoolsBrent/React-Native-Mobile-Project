import auth from '@react-native-firebase/auth'
import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'

import {
    documentData,
    getCollectionRef,
    getDataFromDocumentSnapshot,
    getDataFromQuerySnapshot,
    getDocumentRef,
} from '@/api/firestoreUtils'
import {IGerecht} from '@/models/IGerecht'

//region Mutations & queries

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          MUTATIONS & QUERIES
 * ---------------------------------------------------------------------------------------------------------------------
 */

export const useGetGerechten = (): UseQueryResult<IGerecht[], Error> => {
    return useQuery({
        queryKey: ['gerechten'],
        queryFn: getGerechten,
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
export const getGerechtById = async (gerechtId: string): Promise<IGerecht | null> => {
    try {
        const docRef = getDocumentRef<IGerecht>('gerechten', gerechtId)
        const docSnapshot = await docRef.get()

        if (docSnapshot.exists) {
            return documentData<IGerecht>(docSnapshot)
        } else {
            return null // Gerecht niet gevonden
        }
    } catch (error) {
        console.error('Fout bij het ophalen van het gerecht:', error)
        return null
    }
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
}

const addGerecht = async ({naam, ingredienten, fotoUrl, stappenPlan, type}: AddGerechtParams): Promise<IGerecht> => {
    const ref = getCollectionRef<IGerecht>('gerechten')
    const user = auth().currentUser

    if (user === null) {
        throw new Error('User not found')
    }

    const newDocReference = await ref.add({
        naam,
        ingredienten: ingredienten.join(','),
        fotoUrl,
        stappenPlan: stappenPlan.join(','),
        type,
    })

    const querySnapshot = await newDocReference.get()

    const newDoc = await getDataFromDocumentSnapshot<IGerecht>(querySnapshot, 'id')
    return newDoc as IGerecht
}

const deleteGerecht = async (gerechtId: string): Promise<void> => {
    const ref = getCollectionRef<IGerecht>('gerechten')
    await ref.doc(gerechtId).delete()
}
interface UpdateGerechtParams {
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
