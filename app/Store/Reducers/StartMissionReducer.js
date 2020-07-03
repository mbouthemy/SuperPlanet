// Store/Reducers/StartMissionReducer.js

const initialState = { startMission: undefined }

function addStartMissionInfo(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'ADD_START_MISSION':
            nextState = {
                ...state,
                startMission: action.value
            }
            console.log('[STORE] Update the start mission information.')
            return nextState || state
        default:
            return state
    }}

export default addStartMissionInfo
