import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';

import './DeleteReview.css'
import { fetchDeleteReview } from '../../store/reviews';
import { fetchSpotDetail } from '../../store/spots';

function DeleteReview ({ review, spot }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    console.log('REVIEW', review)

    const deleteReview =  async (e) => {
        e.preventDefault();

        await dispatch(fetchDeleteReview(review.id)).then(closeModal);

        await dispatch(fetchSpotDetail(spot.id))
    };


    return (
        <>
            <div className="mainDeleteContainer">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review?</p>
                <button id="deleteBtn" onClick={deleteReview}>Yes (Delete Review)</button>
                <button id="keepBtn" onClick={closeModal}>No (Keep Review)</button>
            </div>
        </>
    );

}

export default DeleteReview;
