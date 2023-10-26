import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/reviews';
import * as sessionActions from "../../store/session";



function AllReviews({ spotId, spot }) {

    const dispatch = useDispatch();
    const reviewState = useSelector((state) => state.reviews);
    const user = useSelector((state) => state.session.user);
    const reviews = Object.values(reviewState)

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }

    console.log('current review state',  reviews)
    console.log('user', user)
    console.log('spot info', spot)

    useEffect(() => {
        console.log('send action')
        dispatch(reviewActions.fetchReviews(spotId));

        // dispatch(sessionActions.login())

        return (() => {
            console.log('clear action')
            dispatch(reviewActions.clearReviews())
        });

    },[dispatch]);


   return reviews.length > 0 ? (
        <>
            <div>
                {reviews.reverse().map((review) => (
                    <div key={review.id} className="reviewBelowContainer">
                        <h3>{review.User.firstName}</h3>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
                        <p>{review.review}</p>
                    </div>
               ))}
            </div>
        </>
    ): (
        <>
            {(!user || user.id === spot.ownerId ?
                <div className="noReview">No reivews...yet</div>
                : <>
                    <div className="noReview">Be the first to post a review!</div>
                    <button className="reviewBtn"></button>
                 </>
            )}
        </>

    )
}


export default AllReviews;
