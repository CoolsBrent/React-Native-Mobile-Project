import firestore from '@react-native-firebase/firestore'
import {useEffect, useState} from 'react'

import useUser from './useUser'

import {IGerecht} from '@/models/IGerecht'

const useUserDishes = () => {
    const user = useUser()
    const [dishes, setDishes] = useState<IGerecht[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDishes = async () => {
            if (user) {
                try {
                    // Query voor gerechten van de huidige gebruiker
                    const userSnapshot = await firestore().collection('gerechten').where('userId', '==', user.uid).get()

                    const userDishes = userSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as IGerecht[]

                    // Query voor gerechten van de gemeenschappelijke gebruiker
                    const commonUserSnapshot = await firestore()
                        .collection('gerechten')
                        .where('userId', '==', 'gemeenschappelijke_gebruiker_id') // Vervang 'gemeenschappelijke_gebruiker_id' door de ID van de gemeenschappelijke gebruiker
                        .get()

                    const commonUserDishes = commonUserSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as IGerecht[]

                    // Combineer gerechten van de huidige gebruiker en de gemeenschappelijke gebruiker
                    const combinedDishes = [...userDishes, ...commonUserDishes]

                    setDishes(combinedDishes)
                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching dishes:', error)
                }
            }
        }

        fetchDishes()

        // Cleanup functie
        return () => {
            // Cleanup code, indien nodig
        }
    }, [user])

    return {dishes, loading}
}

export default useUserDishes
