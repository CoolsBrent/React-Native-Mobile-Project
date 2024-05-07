import {useLocalSearchParams} from 'expo-router'
import {FunctionComponent} from 'react'

import GerechtDetail from '@/components/gerechtDetail'

const GerechtDetail1: FunctionComponent = () => {
    const {GerechtId} = useLocalSearchParams<{GerechtId: string}>()

    return <GerechtDetail id={GerechtId === '-1' ? undefined : GerechtId} />
}

export default GerechtDetail1
