import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/reviews';

function AllReviews({ spotId }) {
  
    const dispatch = useDispatch();
    const reviews = useSelector((state) => Object.values(state.reviews.spot));


    console.log('Review State', reviews)

    useEffect(() => {

             dispatch(reviewActions.fetchReviews(spotId));

        return (() => {
            dispatch(reviewActions.clearReviews())
        });

    },[dispatch]);


   return reviews.length > 0 ? (
        <>
            <div>
                {reviews.map((review) => (
                    <div className="reviewBelowContainer">
                        <h3>{review.User.firstName}</h3>
                        <p>{review.createdAt}</p>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>
        </>
    ): null;
}


export default AllReviews;
