import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';


function SpotDetail () {
    const history = useHistory();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.requestedSpot)
    const dispatch = useDispatch();

    console.log('detail', spot)
//    console.log('spotimg', spot.SpotImages)

    useEffect(() => {
        dispatch(spotActions.fetchSpotDetail(spotId))
    }, [dispatch])


    return !spot ? 'Page Not Found' : (
        <>
            <div className='spotTitleContainer'>
                <h1 className='spotTitle'>{spot.name}</h1>
                <p>{spot.city}, {spot.state}, {spot.country}</p>
                <img src={spot.SpotImages.url} />
            </div>
            <div className='spotImgContainer'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </>
    );
};


export default SpotDetail;
