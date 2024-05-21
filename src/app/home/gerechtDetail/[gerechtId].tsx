import {useLocalSearchParams} from 'expo-router'
import {FunctionComponent} from 'react'

import GerechtDetail from '@/components/gerechtDetail'

const GerechtDetail1: FunctionComponent = () => {
    const {gerechtId} = useLocalSearchParams<{gerechtId: string}>()

    return <GerechtDetail id={gerechtId === '-1' ? undefined : gerechtId} />
}

export default GerechtDetail1
