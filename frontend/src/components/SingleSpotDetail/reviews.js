import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from '../../store/reviews';
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "./reviewModal";
import DeleteReview from "../DeleteReviewModal";



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

    console.log('SPOT', spot)


    useEffect(() => {
        console.log('send action')
        dispatch(fetchReviews(+spotId));

        // dispatch(sessionActions.login())

        // return (() => {
        //     console.log('clear action')
        //     dispatch(reviewActions.clearReviews())
        // });

    },[dispatch]);

    let reviewexists;
    if (user) {
        reviewexists = reviews.find(review => review.userId === user.id)
    };

    let isOwner;
    if (user) {
        isOwner =  spot.ownerId === user.id
    };

   return reviews.length  > 0  ? (
        <>
            <div>
                {reviews.reverse().map((review) => (
                    <div key={review.id} className="reviewBelowContainer">
                    {(user && !(isOwner) && !(reviewexists)  && (
                        <>
                            <span style={{ marginTop:"15px"}}></span>
                            <OpenModalButton
                            buttonText={"Post Your Review"}
                            modalComponent={<CreateReviewModal spot={spot} />}
                            />
                        </>
                    ))}
                        <h3>{review.User.firstName}</h3>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
                        <p>{review.review}</p>
                    {(user && user.id === review.userId && (
                        <>
                            <span style={{ marginTop:"15px"}}></span>
                            <OpenModalButton
                            buttonText={"Delete Review"}
                            modalComponent={<DeleteReview review={review} spot={spot} />}
                            />
                        </>
                    ))}
                    </div>
               ))}
            </div>

        </>
    ): (
        <>
            {(!user || user.id === spot.ownerId ?
                    <div className="noReview">No reivews...yet</div> : <div className="noReview">Be the first to post a review!</div>

            )}
        </>

    )
}


export default AllReviews;
