import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';


import './SingleSpot.css'
import AllReviews from './reviews';


function SpotDetail () {
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots.requestedSpot);
    const dispatch = useDispatch();

    console.log('detail', spot)


    useEffect(() => {
        console.log('dispatch spot')
        dispatch(spotActions.fetchSpotDetail(spotId));

    }, [dispatch])



    const handleReserve = (e) => {
        e.preventDefault();

        alert("Feature coming soon");
    }

    return !spot ? 'Page Not Found' : (
        <>
            <div className='spotMainContainer'>
                <div className='spotTitleContainer'>
                    <h1 className='spotTitle'>{spot.name}</h1>
                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                </div>
                {spot.SpotImages.map((img) => (
                <div className='spotImgContainer'>
                    <div className="bigImgContainer"><img className="bigImg"src={img.url}/></div>
                    <div className='groupImage'>
                        <div><img className="smallImg" src={img.url}/></div>
                        <div><img className="smallImg" src={img.url}/></div>
                        <div><img className="smallImg" src={img.url}/></div>
                        <div><img className="smallImg" src={img.url}/></div>
                    </div>
                </div>
                ))}
                <div className='descriptionContainer'>
                    <div className='descriptionDown'>
                        <h2>Host By {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                        <p>{spot.description}</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida pulvinar
                            orci eget semper. In hac habitasse platea dictumst. Vestibulum eget varius est.
                            Phasellus luctus in quam in finibus. Mauris tincidunt, libero nec condimentum pulvinar,
                            arcu erat commodo mi, ac sodales tellus leo quis nulla. Donec molestie eros non pharetra dapibus.
                            Phasellus in metus hendrerit, pulvinar mauris sit amet, aliquet justo.
                        </p>
                    </div>
                    <div className='reserveContainer'>
                        <div className='reserveBox'>
                            <div style={{fontSize:'20px', fontWeight:'bold'}}>${spot.price} night</div>
                            <div style={{paddingLeft: '25px'}}><i class="fa-solid fa-star"></i> {spot.avgRating === 0 ? '' : spot.avgRating}</div>
                            <div style={{fontSize:'20px'}}>{!spot.numReviews ? '' : '·'}</div>
                            <span>#{spot.numReviews ? spot.numReviews : ''}{!spot.numReviews ? '' : spot.numReviews > 1 ? 'Reviews' : 'Review'}</span>
                            <button onClick={handleReserve} className='reserveBtn'>reserve</button>
                        </div>
                    </div>
                </div>
                <div className='reviewContainer'>
                    <div style={{paddingLeft: '25px'}}><i class="fa-solid fa-star"></i>{!spot.avgRating ? `New` : spot.avgRating}</div>
                    <div style={{fontSize:'20px'}}>·</div>
                    <span>#{spot.numReviews ? spot.numReviews : ''}{!spot.numReviews ? '' : spot.numReviews > 1 ? 'Reviews' : 'Review'}</span>

                </div>
            </div>
             <AllReviews spotId={spotId} spot={spot}/>
        </>
    );
};


export default SpotDetail;
