import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import { fetchCreateSpot, fetchEditSpot } from '../../store/spots';
// import { fetchAddImage } from '../../store/images';

import './CreateSpot.css';

function CreateSpot({  spot, formType }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [lat, setLat] = useState(spot?.lat);
    const [lng, setLng] = useState(spot?.lng);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [previewImg, setPreviewImg] = useState(spot?.previewImage);
    const [url1, setUrl1] = useState("");
    const [url2, setUrl2] = useState("");
    const [url3, setUrl3] = useState("");
    const [url4, setUrl4] = useState("");
    const [errors, setError] = useState({});
    const [disabled, setDisabled] = useState(true);
    const [className, setClassName ] = useState("disabled")



    // console.log('USER====>', user)
    console.log('SPOT PROP', spot)


    if(!user) {
       history.replace('/')
    }


    useEffect(() => {

        const error = {};

        if(!previewImg.length) {
            error.previewImageUrl = "Preview Image is required"
        }

        if(!previewImg.includes(".png") &&
           !previewImg.includes(".jpg") &&
           !previewImg.includes(".jpeg")
           ) {
            error.previewImg = "Image URL must end in .png .jpg or .jpeg"
        }

        if (!country.length) error.country = "Country is required";
        if (!address.length) error.address = "Address is required";
        if (!city.length) error.city = "City is required";
        if (!state.length) error.state = "State is required";
        if (!lat) error.lat = "Lat is requrired";
        if (!lng) error.lng = "Longtitude is required";
        if (description.length < 30) error.description = "Description needs a minimum of 30 or more characters";
        if (!name.length) error.name = "Name of spot is required";
        if (!price) error.price = "Price is required";

        if (isNaN(price)) error.price = "Price is invalid";
        if (lat > 90 || lat < -90) error.lat = "Latitude must be between 90 and -90";
        if (isNaN(lat)) error.lat = "Latitude is invalid"
        if (lng > 180 || lng < -180) error.lng = "Longitude must be between 180 and -180";
        if (isNaN(lng)) error.lng = "Longtitude is invalid"

        setError(error);


        if (!Object.keys(errors).length) {
            setDisabled(false)
            setClassName("createFormBtn")
         }

    }, [country, address, city, state, lat, lng, description, name, price, previewImg])


    const handleSubmit = async (e) => {
        e.preventDefault();

    const spotImages = [
        {
            url: previewImg,
            preview: true
        }

    ];

    [url1, url2, url3, url4].forEach((url) => {
            if (url) {
                spotImages.push({
                    url: url,
                    preview: false
                })
            }else {
                spotImages.push({
                    url: "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=",
                    preview: false
                })
            }
    });
    console.log('spotImages', spotImages)

    spot = {
        ...spot,
            ownerId: user.id,
            address,
            country,
            city,
            lat,
            lng,
            state,
            description,
            name,
            price,
            previewImg,
    }

    console.log('AFTER SPREAD', spot)


        if (!(Object.values(errors).length) && formType === "Create Form") {

            const res =  await dispatch(fetchCreateSpot(spot, spotImages, user.id));
            // await dispatch(fetchAddImage(newSpot.id, spotImages));
            history.push(`/spots/${res.id}`)
        }
        if (!(Object.values(errors).length) && formType === "Update Form") {

            const res = await dispatch(fetchEditSpot(spot.id, spot))
            history.push(`/spots/${res.id}`)
        }

        setError({});

    };

    return (
        <>
            <div className="mainCreateSpotContianer">
                <div id="mainTitle">
                    <h1>Create a new Spot</h1>
                    <h2>Where's your place located?</h2>
                    <p className='descriptionText'>Guests will only get your exact address once they booked a reservation</p>
                </div>
                <form onSubmit={handleSubmit} className="createSpotForm">
                     <div className='addressContainer'>
                        <label className="createFormLabel">Country</label>
                        <input
                        className="createFormInput"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)} />
                        {errors.country && <p className="errors">{errors.country}</p>}

                        <label className="createFormLabel">Stree Address</label>
                        <input
                        className="createFormInput"
                        placeholder="Address"
                        value={address} onChange={(e) => setAddress(e.target.value)} />
                        {errors.address && <p className="errors">{errors.address}</p>}

                        <label className="createFormLabel">City</label>
                        <input
                        className="createFormInput"
                        placeholder="City"
                        value={city} onChange={(e) => setCity(e.target.value)} />
                        {errors.city && <p className="errors">{errors.city}</p>}

                        <label className="createFormLabel">State</label>
                        <input
                        className="createFormInput"
                        placeholder="STATE"
                        value={state} onChange={(e) => setState(e.target.value)} />
                        {errors.state && <p className="errors">{errors.state}</p>}

                        <label className="createFormLabel">Lat</label>
                        <input
                        className="createFormInput"
                        placeholder="Lat"
                        value={lat} onChange={(e) => setLat(e.target.value)} />
                        {errors.lat && <p className="errors">{errors.lat}</p>}


                        <label className="createFormLabel">Lng</label>
                        <input
                        className="createFormInput"
                        placeholder="Longtitude"
                        value={lng} onChange={(e) => setLng(e.target.value)} />
                        {errors.lng && <p className="errors">{errors.lng}</p>}

                     </div>

                    <div className='groupInput'>
                        <label className="setDescription createFormLabel">Describe your place to guests</label>
                        <p className='descriptionText'>Mention the best features of your space, any special amentities like fast wifi
                            or parking, and what you love about the neighborhood.
                        </p>
                        <textarea
                         id="textCreate"
                         className="createFormInput"
                         placeholder="Please write at least 30 characters"
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}>
                         </textarea>
                         {errors.description && <p className="errors">{errors.description}</p>}
                    </div>

                    <div className='groupInput'>
                        <label className="createTitle createFormLabel">Create a title for your spot</label>
                        <p className='descriptionText'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        <input
                         className="createFormInput"
                         type="text"
                         placeholder='Name of your spot'
                         value={name}
                         onChange={(e) => setName(e.target.value)}/>
                          {errors.name && <p className="errors">{errors.name}</p>}
                    </div>

                    <div className='groupInput'>
                        <label className="setPrice createFormLabel">Set a base price for your spot</label>
                        <p className='descriptionText'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <span style={{marginRight:'5px'}}>$</span>
                        <input
                        className="createFormInput"
                        id="priceInput"
                        type="text"
                        placeholder='Price per night(USD)'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                         {errors.price && <p className="errors">{errors.price}</p>}

                    </div>

                    <div className='groupInput'>
                        <label className="setUrl createFormLabel">Liven up your spot with photos</label>
                        <p className='descriptionText'>Catch guests attention with a spot title that highlights what makes your place special</p>
                        <input className="createFormInput"
                        type="text"
                        placeholder='Preview Image URL'
                        value={previewImg}
                        onChange={(e) => setPreviewImg(e.target.value)}/>
                        {errors.previewImg && <p className="errors">{errors.previewImg}</p>}

                        <input
                        className="createFormInput"
                        type="text"
                        placeholder='Image URL'
                        value={url1} onChange={(e) => setUrl1(e.target.value)}/>

                        <input
                        className="createFormInput"
                        type="text"
                        placeholder='Image URL'
                        value={url2} onChange={(e) => setUrl2(e.target.value)}/>

                        <input
                        className="createFormInput" type="text"
                        placeholder='Image URL'
                        value={url3} onChange={(e) => setUrl3(e.target.value)}/>

                        <input
                        className="createFormInput"
                        type="text"
                        placeholder='Image URL'
                        value={url4} onChange={(e) => setUrl4(e.target.value)}/>

                    </div>

                     <button className={`${className}`} type="submit" disabled={disabled}>{formType}</button>
                </form>
            </div>
        </>
    );
}

export default CreateSpot;
