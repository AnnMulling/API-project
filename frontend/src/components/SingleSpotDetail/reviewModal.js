import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { useModal } from '../../context/Modal';
import { fetchCreateReview } from '../../store/reviews';


import './createReview.css';
import { fetchSpotDetail } from '../../store/spots';

function CreateReviewModal({ spot }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    const [ message, setMessage ] = useState("");
    const [ starRate, setStarRate ] = useState(null);
    const [ hover, setHover ] = useState(null)
    const [ error, setError ] = useState({});
    const [ disabled, setDisabled ] = useState(true);
    const [ className, setClassName ] = useState("disabled");

    console.log('USER', user);

    useEffect(() => {
        const error = {}

        if (message.length < 10) error.message = "Review must be atleast 10 character"

        if (message.length > 10) {
            setDisabled(false)
            setClassName("submitReviewBtn")
        }
        setError(error)

    },[message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const review = {
            review: message,
            stars: starRate
        }

            console.log('dispatching review....')
        await dispatch(fetchCreateReview({
            ...review
        }, +spot.id, user)
        )

        await dispatch(fetchSpotDetail(spot.id))

        console.log('REVIEW', review)

        closeModal()
    }


    return (
        <form
        className="createReviewContainer"
        onSubmit={(handleSubmit)}
        >
            <h1>How was your stay?</h1>
            <textarea
             className="reviewMessage"
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             placeholder='Leave your review here...'
             required
            ></textarea>
            {error.message && <p className='errors'>{error.message}</p>}
            <div>{[...Array(5)].map((star, i)=> {
                const ratingValue = i + 1
                return <label>
                            <input
                            className="star"
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setStarRate(ratingValue)}
                            />
                            <FaStar
                            className="activeStar"
                            size={30}
                            color={ratingValue <=  (hover || starRate) ? "#e95b5f" : "#d5d5d5"}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                            />
                    </label>
            })}</div>
            <button type="submit" className={` ${className}`} disabled={disabled} >Submit Your Review</button>
        </form>
    );
}

export default CreateReviewModal;
