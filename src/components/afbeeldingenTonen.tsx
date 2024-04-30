import {FunctionComponent} from 'react'
import {Image, View} from 'react-native'

interface AfbeeldingenTonenProps {
    source: string
}

const AfbeeldingenTonen: FunctionComponent<AfbeeldingenTonenProps> = ({source}) => {
    return (
        <View>
            <Image
                source={{uri: source}}
                style={{width: 350, height: 200, margin: 20}}
            />
        </View>
    )
}

export default AfbeeldingenTonen
