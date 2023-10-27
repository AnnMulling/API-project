import React, { useEffect, useState } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';

import './DeleteReview.css'
import { fetchDeleteReview } from '../../store/reviews';

function DeleteReview ({ review }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    console.log('REVIEW', review)

    const deleteReview = (e) => {
        e.preventDefault();

        dispatch(fetchDeleteReview(review.id)).then(closeModal)

    }


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
