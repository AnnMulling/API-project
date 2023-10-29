/** Action Type Constants: */
import { useDispatch } from "react-redux";
import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const SPOT_DETAIL = 'spots/SPOT_DETAIL'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'


export const loadSpots = (spots) => ({

        type: LOAD_SPOTS,
        payload: spots

});

export const loadSpotDetailt = (spot) => ({

        type: SPOT_DETAIL,
        payload: spot
});


export const createSpot = (spot) => ({

        type: CREATE_SPOT,
        payload: spot
});

export const deleteSpot = (spotId) => ({

        type: DELETE_SPOT,
        payload: spotId
});



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
        dispatch(loadSpotDetailt(spot));
        console.log('from fetch', spot)
        return spot;
    }else {
        const error = await response.json();
        return error;
    }
};

//create a spot
// export const fetchCreateSpot = (spot, spotImages, userId) => async (dispatch) => {
//     console.log('fetch to create spot...');

//     try {

//         const response = await csrfFetch('/api/spots', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(
//              {
//                 ...spot
//              }
//             ),
//             user: {
//                 id: userId
//             }
//         });

//         if (response.ok) {
//             const spot = await response.json();

//             spotImages.forEach( async (img) => {

//                 await csrfFetch (`/api/spots/${spot.id}/images`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         ...img
//                     })
//                 });
//             });

//             dispatch(createSpot(spot))
//             return spot;
//         }

//     }  catch (error){
//         // error = await response.json()
//         console.error(error)
//         return error;
//     }

// };



export const fetchCreateSpot = (spot) => async (dispatch) => {
        console.log('fetch to create spot...');

        try {

            const response = await csrfFetch('/api/spots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(spot)
            });
            if (response.ok) {
                const spot = await response.json();
                dispatch(createSpot(spot));
                return spot;
            }

        }catch(error) {
            console.log(error)
            return error;
        }
}

//add Imgage to spot
export const fetchAddImage = (spotId, spotImages) => async (dispatch) => {

    try {

        spotImages.forEach(async (img) => {
            await csrfFetch(`/api/spots/${spotId}/images`, {
            method: "POST",
            body: JSON.stringify(img),
            });
        });
    }catch (error){
        console.log(error);
        return error;
    }
}

//get current user spot
export const fetchUserSpot = () => async (dispatch) => {
    try {

        const response = await csrfFetch ('/api/spots/current');
        if(response.ok) {
            const spots = await response.json();
            dispatch(loadSpots(spots))

            return spots;
        };

    }catch (error) {
        console.log(error);
        return error;
    }
};


//edit spot
export const fetchEditSpot = (spotId, spotInfo) => async (dispatch) => {

    try {

        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            body: JSON.stringify(spotInfo),
            // user: {
            //     id: userId
            // }

          });

          if (response.ok) {
            const spot = await response.json();
            dispatch(createSpot(spot));
            return spot;
          }

    }catch (error) {
        console.log(error);
        return error;
    }
};

//delete spot
export const fetchDeleteSpot = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch (`/api/spots/${spotId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const message = await response.json();
            dispatch(deleteSpot(spotId));
            return message;
        }

    }catch (error) {
        console.log(error);
        return error
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

        case SPOT_DETAIL:
            return {
                ...state,
                [action.payload.id]: action.payload
            }

        case CREATE_SPOT:
            return {
                ...state,
                [action.payload.id]: action.payload
            }

        case DELETE_SPOT:
            const newState = {...state}
            console.log('ACTION', action)
            delete newState[action.payload]
            return newState

        default:
            return state;
    }
}

export default spotReducer;
