import firestore from '@react-native-firebase/firestore'

import {
    CollectionReference,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    QuerySnapshot,
} from '@/models/firebaseTypes'

const firestoreInstance = firestore()

/**
 * Haal een referentie op die verwijst naar een specifieke collectie.
 * Deze referentie kan gebruikt worden om documenten toe te voegen of uit te lezen uit de collectie.
 *
 * @param collection De naam van de collectie.
 */
export function getCollectionRef<T extends DocumentData>(collection: string): CollectionReference<T> {
    return firestoreInstance.collection<T>(collection)
}

/**
 * Haal een referentie op die verwijst naar een specifiek document in een collectie.
 * Deze referentie kan gebruikt worden om het document te updaten, te verwijderen of te lezen.
 *
 * @param collection De naam van de collectie.
 * @param documentId Het id van het document.
 */
export function getDocumentRef<T extends DocumentData>(collection: string, documentId: string): DocumentReference<T> {
    return getCollectionRef<T>(collection).doc(documentId)
}

/**
 * Lees alle gegevens uit een collectie uit.
 *
 * @param collection De naam van de collectie.
 * @param idField Het veld, in de interface T, waarin het id van het document wordt opgeslagen.
 */
export async function collectionData<T extends DocumentData>(collection: string, idField: Extract<keyof T, string>) {
    const collectionSnapshot = await getCollectionRef<T>(collection).get()
    return getDataFromQuerySnapshot<T>(collectionSnapshot, idField)
}

/**
 * Lees de gegevens van een specifiek document uit.
 *
 * @param collection De naam van de collectie.
 * @param documentId Het id van het document.
 * @param idField Het veld, in de interface T, waarin het id van het document wordt opgeslagen.
 */
export async function documentData<T extends DocumentData>(
    collection: string,
    documentId: string,
    // Haal alle properties van T op die van het type string zijn.
    // De keyof operator kan alle properties van een interface ophalen, via Extract kan een subset van deze properties
    // opgehaald worden die van het type string zijn.
    idField: Extract<keyof T, string>,
) {
    const documentSnapshot = await getDocumentRef<T>(collection, documentId).get()
    return getDataFromDocumentSnapshot<T>(documentSnapshot, idField)
}

/**
 * Converteer een QuerySnapshot (het resultaat van een read operatie op een collectie) naar een array van documenten.
 *
 * @param snapshot Het QuerySnapshot die geconverteerd moet worden.
 * @param idField Het veld, in de interface T, waarin het id van het document wordt opgeslagen.
 */
export async function getDataFromQuerySnapshot<T extends DocumentData>(
    snapshot: QuerySnapshot<T>,
    idField: Extract<keyof T, string>,
): Promise<T[]> {
    return snapshot.docs.map(doc => {
        return {
            ...doc.data(),
            // Via de vierkante haken kunnen we een property toevoegen aan een object.
            [idField]: doc.id,
        }
    })
}

export async function getDataFromDocumentSnapshot<T extends DocumentData>(
    snapshot: DocumentSnapshot<T>,
    idField: Extract<keyof T, string>,
): Promise<T | undefined> {
    const data: T | undefined = snapshot.data()

    if (data) {
        return {
            ...data,
            [idField]: snapshot.id,
        }
    }

    return undefined
}
