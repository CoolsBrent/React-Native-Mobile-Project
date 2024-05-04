import auth from '@react-native-firebase/auth'
import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'
import {useEffect, useState} from 'react'

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

const getGerechten = async (): Promise<IGerecht[]> => {
    const querySnapshot = await getCollectionRef<IGerecht>('gerechten').get()
    return getDataFromQuerySnapshot(querySnapshot, 'id')
}
