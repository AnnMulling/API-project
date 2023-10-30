import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../../store/spots';

import './home.css';


export default function HomePage () {
    // const history = useHistory();
    const dispatch = useDispatch();
    const spotState = (useSelector(state => state.spots))
    const spots = Object.values(spotState);


    console.log('spotState home-page', spotState)

    useEffect(() => {
        dispatch(fetchSpots())
    },[dispatch])

    if(!spots) return null;

    // const price = parseFloat(spot.price)


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
                            <div className='price'>${parseFloat(spot.price).toFixed(2)} night</div>
                    </div>
                </Link>
            )}

           </div>
        </>
    );
}
