import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots';

import './home.css';


export default function HomePage () {
    const dispatch = useDispatch();
    const spotState = Object.values(useSelector(state => state.spots.allSpots))
    console.log('spotState===>', spotState)

    useEffect(() => {
        dispatch(spotActions.fetchSpots())
    },[dispatch])

    return(
        <>
          <h1>home page</h1>
          <div className='mainContainer'>
            {spotState.map((spot) =>
                <div key={spot.id} className='spotContainer'>
                    <img className='spotImg' src={spot.previewImage} alt='houses'/>
                    <div className='spotDetail'>
                        <div className='address'>{spot.city}</div>
                        {/* <div className='country'>{spot.country}</div> */}
                        <span className='starsRating'><i class="fa-solid fa-star"></i>{spot.avgRating}</span>
                        <div className='price'>${spot.price}</div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}
