import firestore from "@react-native-firebase/firestore";
import {Platform} from "react-native";
import storage from "@react-native-firebase/storage";

export async function addInformationUserFirebase(userID: string, informationToAdd) {
    const ref = firestore().collection('people').doc(userID);
    await ref.set(
        informationToAdd
    );
}


export async function updateInformationUserFirebase(userID: string, informationToUpdate) {
    const ref = firestore().collection('people').doc(userID);
    await ref.update(
        informationToUpdate
    );
}


export const getFileLocalPath = (response) => {
    const { path, uri } = response;
    return Platform.OS === 'android' ? path : uri;
}

export const createStorageReferenceToFile = (pathFirestore: string) => {
    const FireBaseStorage = storage();
    return FireBaseStorage.ref(pathFirestore);
};


