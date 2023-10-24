import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots';

import './home.css';


export default function HomePage () {
    const dispatch = useDispatch();
    const spotState = (useSelector(state => state.spots))
    const spots = Object.values(spotState);


    console.log('spotState home-page', spotState)

    useEffect(() => {
        dispatch(spotActions.fetchSpots())
    },[dispatch])

    if(!spots) return null;

    return(
        <>

          <h1>home page</h1>
          <div className='mainContainer'>
            {spots.map((spot) =>
                <Link to={`/spots/${spot.id}`} className="spotDetailLink">
                    <div key={spot.id} className='spotContainer'>
                        <img className='spotImg' src={spot.previewImage} alt='houses' title={spot.name}/>
                        <div className='spotDetail'>
                            <div className='address'>City, {spot.city}</div>
                            {/* <div className='country'>{spot.country}</div> */}
                            <div className='starsRating'><i class="fa-solid fa-star"></i>{!spot.avgRating ? `New` : spot.avgRating} </div>
                        </div>
                            <div className='price'>${spot.price} night</div>
                    </div>
                </Link>
            )}

           </div>
        </>
    );
}
