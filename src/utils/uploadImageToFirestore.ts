// uploadImageToFirestore.ts
import {firebase} from '@react-native-firebase/firestore'

const firestore = firebase.firestore()
const imagesCollection = firestore.collection('gerechten')

export async function uploadImageToFirestore(localUri: string): Promise<string> {
    try {
        const response = await fetch(localUri)
        const blob = await response.blob()

        // Upload de afbeelding naar Firestore
        const ref = await imagesCollection.add({image: blob})
        console.log('Afbeelding succesvol geüpload naar Firestore:', ref.id)

        // Haal de download-URL van de afbeelding op
        const snapshot = await ref.get()
        const downloadUrl = snapshot.get('fotoUrl') // Veronderstel dat 'image' de naam is van het veld dat de download-URL bevat
        console.log('Downloadbare URL van de afbeelding:', downloadUrl)
        return downloadUrl
    } catch (error) {
        console.error('Fout bij het uploaden van de afbeelding naar Firestore:', error)
        throw error
    }
}
