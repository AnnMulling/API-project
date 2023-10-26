/** Action Type Constants: */
import { useDispatch } from "react-redux";
import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'
const CREATE_SPOT = 'spots/CREATE_SPOT'


export const loadSpots = (spots) => ({

        type: LOAD_SPOTS,
        payload: spots

});

export const receivesSpot = (spot) => ({

        type: RECEIVE_SPOT,
        payload: spot
});


export const createSpot = (spot) => ({

        type: CREATE_SPOT,
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
};

//get spot details
export const fetchSpotDetail = (spotId) => async (dispatch) => {
    console.log('fetching a spot detail');
    const response = await csrfFetch (`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(receivesSpot(spot));
        console.log('from fetch', spot)
        return spot;
    }else {
        const error = await response.json();
        return error;
    }
};

//create a spot
export const fetchCreateSpot = (spot, spotImages, userId) => async (dispatch) => {
    console.log('fetch to create spot...');

    try {

        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
             {
                ...spot
             }
            ),
            user: {
                id: userId
            }
        });

        if (response.ok) {
            const spot = await response.json();

            spotImages.forEach( async (img) => {

                await csrfFetch (`/api/spots/${spot.id}/images`, {
                    method: 'POST',
                    // headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...img
                    })
                });
            });

            dispatch(createSpot(spot))
            return spot;
        }


    }  catch (error){
        // error = await response.json()
        console.error(error)
        return error;
    }

};


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

        case CREATE_SPOT:
            return {...state, [action.payload.id]: action.payload }
        default:
            return state;
    }
}

export default spotReducer;
