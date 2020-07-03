// Store/Reducers/EndMissionReducer.js

const initialState = { endMission: undefined }

function addEndMissionInfo(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'ADD_END_MISSION':
            nextState = {
                ...state,
                endMission: action.value
            }
            console.log('[STORE] Update the end mission information.')
            return nextState || state
        default:
            return state
    }}

export default addEndMissionInfo
