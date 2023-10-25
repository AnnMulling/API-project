import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = '/reviews/LOAD_REVIEWS'
const CLEAR_REVIEWS = '/reviews/CLEAR_REVIEWS'


const loadReviews = (reviews) => ({
        type: LOAD_REVIEWS,
        payload: reviews
});

export const clearReviews = () => ({
        type: CLEAR_REVIEWS
});


export const fetchReviews = (spotId) =>  async (dispatch) => {
    console.log('fetching reviews..')

    try {
         const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

        if (response.ok) {
            const reviews = await response.json();
            dispatch(loadReviews(reviews));
        console.log('reviews from fetch', reviews)
            return reviews;
        }

    }catch (e){
        console.error(e.message);
    }

};


// const initialState = {
//     spot: {}

// };

const reviewReducer = (state={}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS:
            console.log('reducer, LOAD_REVIEWS')
            const reviewsState = {...state};
            action.payload.Reviews.forEach((review) => {
                // console.log('each review', review)
                reviewsState[review.id] = review
            });
            console.log('review state from reducer', reviewsState)
            return reviewsState;
        case CLEAR_REVIEWS:
            return {};
        default:
            return state;
    }

}

export default reviewReducer;
