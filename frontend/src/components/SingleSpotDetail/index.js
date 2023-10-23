import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';

import './SingleSpot.css'


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
            <div className='spotMainContainer'>
                <div className='spotTitleContainer'>
                    <h1 className='spotTitle'>{spot.name}</h1>
                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                </div>
                {spot.SpotImages.map((img) => (
                <div className='spotImgContainer'>
                    <div><img className="bigImg"src={img.url}/></div>
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
                            <div style={{fontSize:'20px', fontWeight:'bold'}}>${spot.price}</div>
                            <div style={{paddingLeft: '25px'}}><i class="fa-solid fa-star"></i> {spot.avgRating}</div>
                            <div>#{spot.numReviews} reviews</div>
                            <button className='reserveBtn'>reserve</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default SpotDetail;
