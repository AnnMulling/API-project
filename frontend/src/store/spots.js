/** Action Type Constants: */
import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spot/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spot/RECEIVE_SPOT'


const loadSpots = (spots) => ({

        type: LOAD_SPOTS,
        payload: spots

})
//get all spot
export const fetchSpots = () => async (dispatch) => {
    console.log('fectching all spots..')
    const response = await csrfFetch ('/api/spots');

    if(response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots))

        return spots;
    }
}

//get spot details


const spotReducer = (state = {}, action) => {
    console.log('spot reducer..')
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsState = {};
            action.payload.Spots.forEach((spot) => {
              spotsState[spot.id] = spot;
            });
            // return { ...state,
            //           allSpots: {
            //             ...spotsState
            //           }
            //         }
            return spotsState

        default:
            return state;
    }
}

export default spotReducer;
