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

    }, [dispatch]);

    let reviewexists;
    if (user) {
        reviewexists = reviews.find(review => review.userId === user.id)
    };



    return (
        <div className="reviewContainer">
            {reviews.length > 0 ? (
                <div className="reviewTitle" style={{ fontSize: "25px" }}>
                    <i className="fa-solid fa-star "></i>
                    <span style={{ fontSize: "25px" }}>{spot.avgRating}</span>
                    <span style={{ fontSize: "50px"}}>·</span>
                    {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                </div>

            ) : (
                <div style={{ fontSize: "25px" }}>
                    <i className="fa-solid fa-star "></i>
                    New
                </div>
            )}
            {user && user.id !== spot.ownerId && !reviewexists && (
                <div >

                    <OpenModalButton
                        buttonText={"Post Your Review"}
                        modalComponent={<CreateReviewModal spot={spot} />}
                        style={{ backgroundColor: 'red',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '15px',
                            border: 'none',
                            height:'50px',
                            width: '10%',
                            marginBottom: '3%',
                            cursor: 'pointer'}}
                        />
                </div>
            )}

            <span style={{ margin: "15px 0" }}></span>
            {reviews.length > 0 ? (
                <div className="reviews">
                    {reviews.reverse().map((review) => (
                        <div className="individual-review">
                            <span id="review-firstName">{review.User.firstName}</span>
                            <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
                            <p>{review.review}</p>
                            {user && user.id === review.userId && (
                                <OpenModalButton
                                    buttonText={"Delete"}
                                    modalComponent={<DeleteReview review={review} spot={spot} />}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {(!user || user.id === spot.ownerId ?
                        <div style={{fontSize: "25px"}}>No reviews...yet</div>
                        : <div style={{fontSize: "25px"}}>Be the first to post a review!</div>

                    )}
                </>
            )}

        </div>
    )
}



// function button () {
//     return (
//         <div className="mainReviewContainer">
//             <div classsName="reviewsTitle"></div>
//             {reviews.length > 0 ? (
//                 <span style={{ fontSize: "30px" }}>
//                 <i className="fa-solid fa-star "></i>
//                  · {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
//                 </span>
//             ) : (
//                 <span style={{ fontSize: "30px"}}>
//                 <i className="fa-solid fa-star "></i>
//                  New
//                 </span>
//             )}
//             {user && user.id !== spot.ownerId && !reviewexists && (
//                 <>
//                     <span style={{margin: "15px 0"}}></span>
//                     <OpenModalButton
//                         buttonText={"Post Your Review"}
//                         modalComponent={<CreateReviewModal spot={spot} />}
//                      />
//                 </>
//             )}
//             <span style={{margin: "15px 0"}}></span>
//             {reviews.length > 0 ? (
//                 <div className="reviews">
//                  {reviews.map((review) => (
//                     <div className="individual-review">
//                         <span id="review-firstName">{review.User.firstName}</span>
//                         <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
//                         <p>{review.review}</p>
//               {user && user.id === review.userId && (
//                 <OpenModalButton
//                   buttonText={"Delete"}
//                   modalComponent={<DeleteAReviewModal review={review} />}
//                 />
//               )}
//                 </div>
//           ))}
//                </div>
//         ) : (
//             <>
//             {(!user || user.id === spot.ownerId ?
//                 <div className="noReview">No reivews...yet</div>
//                 : <div className="noReview">Be the first to post a review!</div>

//             )}
//             </>
//         )}

//       </div>
//     )
// }



export default AllReviews;
