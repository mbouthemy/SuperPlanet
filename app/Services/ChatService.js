import firestore from "@react-native-firebase/firestore";


export async function createChatUserProfileInFirebase(userID: string, chatID: string, infoToCreate) {
    const ref = firestore().collection('people').doc(userID).collection('chats').doc(chatID);
    await ref.set(
        infoToCreate
    );
}

/**
 * Update the chat on the user profile (for example to switch between fan and chat (contactType).
 * @param userID
 * @param chatID
 * @param infoToUpdate
 * @returns {Promise<void>}
 */
export async function updateChatUserProfileInFirebase(userID: string, chatID: string, infoToUpdate) {
    const ref = firestore().collection('people').doc(userID).collection('chats').doc(chatID);
    await ref.update(
        infoToUpdate
    );
}

export async function deleteChatUserProfileInFirebase(userID: string, chatID: string) {
    const ref = firestore().collection('people').doc(userID).collection('chats').doc(chatID);
    await ref.delete();
}


export async function createChatInFirebase(chatToCreate) {
    const ref = firestore().collection('chats').doc(chatToCreate.chatName);
    await ref.set(
        chatToCreate
    );
}

export async function deleteChatInFirebase(chatID) {
    const ref = firestore().collection('chats').doc(chatID);
    await ref.delete();
}


export async function updateChatInformationInFirebase(chatID: string, chatInformationToUpdate) {
    const ref = firestore().collection('chats').doc(chatID);
    await ref.update(
        chatInformationToUpdate
    );
}

export async function addMessageOnChatInFirestore(chatID: string, messageID: string, messageInformationToAdd) {
    const ref = firestore().collection('chats').doc(chatID).collection('messages').doc(messageID)
    await ref.set(
        messageInformationToAdd
    );
}

