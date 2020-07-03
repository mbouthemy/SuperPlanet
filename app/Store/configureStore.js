// Store/configureStore.js

import {combineReducers, createStore} from 'redux';
import { persistCombineReducers } from 'redux-persist'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import addStartMissionInfo from "./Reducers/StartMissionReducer";
import addEndMissionInfo from "./Reducers/EndMissionReducer";


const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    startMissionReducer: addStartMissionInfo,
    endMissionReducer: addEndMissionInfo
})

export default createStore(persistReducer(rootPersistConfig, rootReducer))
