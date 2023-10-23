/** Action Type Constants: */
import { useDispatch } from "react-redux";
import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spot/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spot/RECEIVE_SPOT'


const loadSpots = (spots) => ({

        type: LOAD_SPOTS,
        payload: spots

});

const receivesSpot = (spot) => ({

        type: RECEIVE_SPOT,
        payload: spot
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
export const fetchSpotDetail = (spotId) => async (dispatch) => {
    console.log('fetching a spot detail');
    const response = await csrfFetch (`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(receivesSpot(spot));
        console.log('from fetch', spot)
        return spot;
    }
}




const spotReducer = (state = {}, action) => {
    console.log('spot reducer..')
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsState = {};
            action.payload.Spots.forEach((spot) => {
              spotsState[spot.id] = spot;
            });

            return spotsState
        case RECEIVE_SPOT:
            return {...state, requestedSpot: {...action.payload} }
        default:
            return state;
    }
}

export default spotReducer;
