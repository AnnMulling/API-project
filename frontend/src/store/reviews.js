import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = '/reviews/LOAD_REVIEWS'
const CLEAR_REVIEWS = '/reviews/CLEAR_REVIEWS'
const CREATE_REVIEW = './reviews/CREATE_REVIEWS'
const DELETE_REVIEWS = './reviews/DELETE_REVIEWS'


const loadReviews = (reviews) => ({
        type: LOAD_REVIEWS,
        payload: reviews
});

// export const clearReviews = () => ({
//         type: CLEAR_REVIEWS
// });

const postReview = (review) => ({
       type: CREATE_REVIEW,
       payload: review
});

const deleteReview = (reviewId) => ({
        type: DELETE_REVIEWS,
        payload: reviewId
});

//get all review
export const fetchReviews = (spotId) =>  async (dispatch) => {
    // console.log('fetching reviews..')

    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

        if (response.ok) {
            const reviews = await response.json();
            dispatch(loadReviews(reviews));
        // console.log('reviews from fetch', reviews)
            return reviews;
        }

    }catch(error) {
        console.log(error);
        return error;
    }
};

//create review
export const fetchCreateReview = (review, spotId, user) => async (dispatch) => {

    try {
        console.log('fetching to create review...')
        const response = await csrfFetch( `/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(review),
        });

        if (response.ok) {
            const review = await response.json();
            // console.log('created review', review)
            review.User = user
            dispatch(postReview(review));
            return review;
        }
    }catch (error){
        console.log(error);
        return error;
    }
};

//delete review
export const fetchDeleteReview = (reviewId) => async (dispatch) => {
    try {

        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const confirm = await response.json()
            dispatch(deleteReview(reviewId));
            return confirm;
        }

    }catch (error) {
        console.log(error);
        return error;
    }
};



const reviewReducer = (state={}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS:{
            const reviewsState = {};
            action.payload.Reviews.forEach((review) => {
                reviewsState[review.id] = review
            });
            return reviewsState;
        }

        case CREATE_REVIEW: {
            const newState = {...state}
            newState[action.payload.id] = action.payload
            return newState;
        }


            // return {...state, [action.payload.id]: action.payload}
        // case CLEAR_REVIEWS:
        //     return {};

        case DELETE_REVIEWS: {
            const newState = {...state}
            delete newState[action.payload]
            return newState;
        }

        default:
            return state;
    }

}

export default reviewReducer;
