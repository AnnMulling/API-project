import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpot } from "../../store/spots";
import DeleteSpot from "../DeleteSpotModal";

import './ManageSpot.css';
import OpenModalButton from "../OpenModalButton";


function ManageSpot() {
    const history = useHistory();
    const dispatch = useDispatch();
    const spotState = useSelector((state) => state.spots);
    const spots = Object.values(spotState);
    const user = useSelector((state) => state.session.user);

    console.log('spot state', spots)
    console.log('user', user)

    useEffect(() => {
        if (user) dispatch(fetchUserSpot())
    }, [dispatch]);

    if (!user) {
        history.push("/")
    }

    const createSpot = (e) => {
        e.preventDefault();
        history.push("/spots/new")
    };

    const updateSpot = (e, spot) => {
        e.preventDefault();
        history.push(`/spots/${spot.id}/edit`)
    }

    return (
        <>
            <div className="titleContainer">
                <h1>Mange Spots</h1>
                <button
                id="createSpotBtn"
                onClick={createSpot}
                >
                    Create a New Spot
                </button>
            </div>

            <div className="spotsContainer">
            {spots.length > 0 && (
                <div>
                    {spots.map((spot) =>
                        <div className="spotContainer">
                            <Link to={`/spots/${spot.id}`} className="spotDetailLink">
                                <div key={spot.id} className='spotContainer'>
                                    <img className='spotImg' src={spot.previewImage} alt='houses' title={spot.name} />
                                    <div className='manageSpotDetail'>
                                        <div className='address'>City, {spot.city}</div>
                                            {/* <div className='country'>{spot.country}</div> */}
                                        <div className='starsRating'><i class="fa-solid fa-star"></i>{!spot.avgRating ? `New` : spot.avgRating} </div>
                                        <div className='price'>${spot.price} night</div>
                                    </div>
                                </div>
                            </Link>
                            <button
                            id="updateSpotBtn"
                            onClick={(e) => updateSpot(e, spot)}
                            >
                            Update Spot
                            </button>
                            <OpenModalButton
                            buttonText={"Delete"}
                            modalComponent={<DeleteSpot spot={spot}/>}
                             />
                        </div>
                    )}
                 </div>
             )}
             </div>
        </>
    );
}


export default ManageSpot;
