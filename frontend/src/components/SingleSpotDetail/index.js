import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetail } from '../../store/spots';


import './SingleSpot.css'

import AllReviews from './reviews';

function SpotDetail () {
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots[spotId]);
    const dispatch = useDispatch();
    const [ errors, setErrors ] = useState();

    useEffect(() => {

        dispatch(fetchSpotDetail(spotId));

    }, [dispatch])



    if (!spot) return null;
    console.log('SPOT detail', spot)

    const spotImages = spot.SpotImages;
    console.log('IMAGE', spotImages)

    if (!spotImages) return null;

    let previewImage = spotImages.reverse().find(img => img.preview === true)
    // console.log('PREVIEW', previewImage.url)


    if (spot.SpotImages.length < 5) {
        for (let i = spot.SpotImages.length; i < 5 ; i++) {
            const img = {
                id: i + 1 ,
                url: "https://png.pngtree.com/png-vector/20221108/ourmid/pngtree-cartoon-house-illustration-png-image_6434928.png",
                preview: false
            }
            spot.SpotImages.push(img)
        }
    };


    const handleReserve = (e) => {
        e.preventDefault();

        alert("Feature coming soon");
    };

    return !spot ? 'Page Not Found' : (
        <>
            <div className='spotMainContainer'>
                <div className='spotTitleContainer'>
                    <h1 className='spotTitle'>{spot.name}</h1>
                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                </div>
                <div className='spotImgContainer'>
                <div className="bigImgContainer">{previewImage &&  <img className="bigImg" src={previewImage.url} alt={previewImage.id}/>}</div>
                     <div className='groupImage'>
                        {spotImages.map(img => (
                         img.id !== previewImage.id ? (
                        <div><img className="smallImg" key={img.id} src={img.url} alt={`Spot ${img.id}`} /></div>
                        ) : null
                        ))}
                    </div>
                </div>
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
                            <div style={{paddingLeft: '25px'}}><i class="fa-solid fa-star"></i> {spot.avgRating === 0 ? 'New' : spot.avgRating}</div>
                            <div style={{fontSize:'50px'}}>{!spot.numReviews ? '' : '·'}</div>
                            <span>{spot.numReviews ? spot.numReviews : ''}{!spot.numReviews ?  '' : spot.numReviews > 1 ? 'Reviews' : 'Review'}</span>
                            <button onClick={handleReserve} className='reserveBtn'>reserve</button>
                        </div>
                    </div>
                </div>
                {/* <div className='reviewContainer'>
                    <div style={{paddingLeft: '25px'}}><i class="fa-solid fa-star"></i>{!spot.avgRating ? `New` : spot.avgRating}</div>
                    <div style={{fontSize:'50px'}}>{!spot.numReviews ? '' : '·'}</div>
                    <span>{spot.numReviews ? spot.numReviews : ''}{!spot.numReviews ? '' : spot.numReviews > 1 ? 'Reviews' : 'Review'}</span>

                </div> */}
            </div>

             <AllReviews spotId={spotId} spot={spot}/>
        </>
    );
};


export default SpotDetail;
