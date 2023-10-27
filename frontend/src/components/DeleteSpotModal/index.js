import React, { userEffect } from "react";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchDeleteSpot } from "../../store/spots";


import './DeleteSpot.css'


function DeleteSpot({ spot }) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    console.log('spot to delete', spot)

    const deleteSpot =  async (e) => {
        e.preventDefault();

        await dispatch(fetchDeleteSpot(spot.id)).then(closeModal);

        // await dispatch(fetchSpotDetail(spot.id));


        history.push("/spots/current");
    };

    return (
        <div className="mainDeleteContainer">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listing?</p>
            <button id="deleteBtn" onClick={deleteSpot}>Yes (Delete Spot)</button>
            <button id="keepBtn" onClick={closeModal}>No (Keep Spot)</button>
        </div>
    );
}

export default DeleteSpot;
