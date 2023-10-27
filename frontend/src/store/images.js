import { csrfFetch } from "./csrf";


const ADD_IMAGE = '/images/ADD_IMAGE'
const REMOVE_IMAGE = '/images/REMOVE_IMAGE'


// const addImage = (img) => ({
//     type: ADD_IMAGE,
//     payload: img
// });

// export const fetchAddImage = (spotId, spotImages) => async (dispatch) => {

//     try {
//         const response = await csrfFetch (`/api/spots/${spotId}/images`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 url: spotImages[0],
//                 preview: true
//             })
//         });

//         if (response.ok) {
//             const previewImg = await response.json();
//             dispatch(addImage(previewImg));
//             return previewImg;
//         };


//         if (spotImages.length > 1) {
//             spotImages.splice(1).map(async (url) => {
//                 const response = await csrfFetch (`/api/spots/${spotId}/images`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         url,
//                         preview: false
//                     })
//                 });
//                 if (response.ok) {
//                     const img = response.json();
//                     dispatch(addImage(img))
//                     return img;
//                 }
//             });
//         }


//     }catch(error) {
//         console.log(error)
//         // return error;
//     }

// }





function imgReducer (state={}, action) {
    switch(action.type){
        case ADD_IMAGE:
            const imgState = {...state}
            action.payload.forEach((img) => {
                imgState[img.id] = img
            });
            return imgState
        default:
            return state;
    }

}

export default imgReducer;
