import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import { fetchCreateSpot, fetchEditSpot, fetchAddImage } from '../../store/spots';


import './CreateSpot.css';


function CreateSpot({ formType = "Create Spot", spot }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    const [country, setCountry] = useState(formType === "Update Spot" ? spot.country : "");
    const [address, setAddress] = useState(formType === "Update Spot" ? spot.address: "");
    const [city, setCity] = useState(formType === "Update Spot" ? spot.city : "");
    const [state, setState] = useState(formType === "Update Spot" ? spot.state : "");
    const [lat, setLat] = useState(formType === "Update Spot" ? spot.lat : "");
    const [lng, setLng] = useState(formType === "Update Spot" ? spot.lng : "");
    const [description, setDescription] = useState(formType === "Update Spot" ? spot.description : "");
    const [name, setName] = useState(formType === "Update Spot" ? spot.name : "");
    const [price, setPrice] = useState(formType === "Update Spot" ? spot.price : "");

    const [previewImage, setPreviewImage] = useState("");
    const [url1, setUrl1] = useState("");
    const [url2, setUrl2] = useState("");
    const [url3, setUrl3] = useState("");
    const [url4, setUrl4] = useState("");
    const [errors, setError] = useState({});
    // const [disabled, setDisabled] = useState(true);
    // const [className, setClassName ] = useState("disabled");


    if (formType === "Update Spot") {
        if (user.id !== spot.ownerId) history.replace("/");
      }

    // console.log('USER====>', user)
    console.log('SPOT PROP', spot)


    // useEffect(() => {

    //     const error = {};

    //     if(!previewImage.length) {
    //         error.previewImageUrl = "Preview Image is required"
    //     }

    //     if(!previewImage.includes(".png") &&
    //        !previewImage.includes(".jpg") &&
    //        !previewImage.includes(".jpeg")
    //        ) {
    //         error.previewImage = "Image URL must end in .png .jpg or .jpeg"
    //     }

    //     if (
    //         url1 &&
    //         (!url1.includes(".png") &&
    //          !url1.includes(".jpg") &&
    //          !url1.includes(".jpeg"))
    //     ) {
    //         error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    //     };

    //     if (
    //         url2 &&
    //         (!url2.includes(".png") &&
    //          !url2.includes(".jpg") &&
    //          !url2.includes(".jpeg"))
    //     ) {
    //         error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    //     };

    //     if (
    //         url3 &&
    //         (!url3.includes(".png") &&
    //          !url3.includes(".jpg") &&
    //          !url3.includes(".jpeg"))
    //     ) {
    //         error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    //     };
    //     if (
    //         url4 &&
    //         (!url4.includes(".png") &&
    //          !url4.includes(".jpg") &&
    //          !url4.includes(".jpeg"))
    //     ) {
    //         error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    //     }

    //     if (!country.length) error.country = "Country is required";
    //     if (!address.length) error.address = "Address is required";
    //     if (!city.length) error.city = "City is required";
    //     if (!state.length) error.state = "State is required";
    //     if (!lat) error.lat = "Lat is requrired";
    //     if (!lng) error.lng = "Longtitude is required";
    //     if (description.length < 30) error.description = "Description needs a minimum of 30 or more characters";
    //     if (!name.length) error.name = "Name of spot is required";
    //     if (!price) error.price = "Price is required";

    //     if (name.length < 5) error.name = "Spot name needs a minimum of 5 characters"
    //     if (isNaN(price)) error.price = "Price is invalid";
    //     if (lat > 90 || lat < -90) error.lat = "Latitude must be between 90 and -90";
    //     if (isNaN(lat)) error.lat = "Latitude is invalid"
    //     if (lng > 180 || lng < -180) error.lng = "Longitude must be between 180 and -180";
    //     if (isNaN(lng)) error.lng = "Longtitude is invalid"

    //     setError(error);


    //     // if (!Object.keys(errors).length) {
    //     //     setDisabled(false)
    //     //     setClassName("createFormBtn")
    //     //  }
    // }, [country, address, city, state, lat, lng, description, name, price, previewImage]);


    if(!user) {
        history.replace('/')
        return;
     };

     if (formType === "Update Spot") {
         if (user.id !== spot.ownerId) history.replace("/");
     };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = {};


    const spotImages = [
        {
            url: previewImage,
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
                });
            }
    });
    console.log('spotImages', spotImages)


    console.log('AFTER SPREAD', spot)


    const spotInfo = {
        // ...spot,
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
    }


    if(!previewImage.length) {
        error.previewImageUrl = "Preview Image is required"
    }

    if(!previewImage.includes(".png") &&
       !previewImage.includes(".jpg") &&
       !previewImage.includes(".jpeg")
       ) {
        error.previewImage = "Image URL must end in .png .jpg or .jpeg"
    }

    if (
        url1 &&
        (!url1.includes(".png") &&
         !url1.includes(".jpg") &&
         !url1.includes(".jpeg"))
    ) {
        error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    };

    if (
        url2 &&
        (!url2.includes(".png") &&
         !url2.includes(".jpg") &&
         !url2.includes(".jpeg"))
    ) {
        error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    };

    if (
        url3 &&
        (!url3.includes(".png") &&
         !url3.includes(".jpg") &&
         !url3.includes(".jpeg"))
    ) {
        error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    };
    if (
        url4 &&
        (!url4.includes(".png") &&
         !url4.includes(".jpg") &&
         !url4.includes(".jpeg"))
    ) {
        error.imgUrl = "Image URL must end in .png .jpg or .jpeg"
    }

    if (!country.length) error.country = "Country is required";
    if (!address.length) error.address = "Address is required";
    if (!city.length) error.city = "City is required";
    if (!state.length) error.state = "State is required";
    if (!lat) error.lat = "Latitude is requried";
    if (!lng) error.lng = "Longtitude is required";
    if (description.length < 30) error.description = "Description needs a minimum of 30 or more characters";
    if (!name.length) error.name = "Name of spot is required";
    if (!price) error.price = "Price is required";

    if (name.length < 5) error.name = "Spot name needs a minimum of 5 characters"
    if (isNaN(price)) error.price = "Price is invalid";
    if (lat > 90 || lat < -90) error.lat = "Latitude must be between 90 and -90";
    if (isNaN(lat)) error.lat = "Latitude is invalid"
    if (lng > 180 || lng < -180) error.lng = "Longitude must be between 180 and -180";
    if (isNaN(lng)) error.lng = "Longtitude is invalid"


        if (!Object.keys(error).length && formType === "Create Spot") {
            const res = await dispatch(fetchCreateSpot(spotInfo));

            // if (!res.errors) {
                await dispatch(fetchAddImage(res.id, spotImages));
                history.push(`/spots/${res.id}`);
            // }else {
            //     setError(res.errors)
            // }

        }

        if (formType === "Update Spot") {
            delete errors.previewImage;
            delete errors.imgUrl

            if (!Object.keys(errors).length && formType === "Update Spot") {
                 const res=  await dispatch(fetchEditSpot(spot.id, spotInfo));
                 history.push(`/spots/${res.id}`)
            }
        };


        setError(error);

    };

    return (
            <div className="mainCreateSpotContianer">
                <form onSubmit={handleSubmit} className="createSpotForm">
                    <div id="mainTitle">
                        {formType === "Create Spot" ? (
                        <h1>Create a new Spot</h1>) : (
                         <h1>Update your Spot</h1>
                        )}
                        <h2>Where's your place located?</h2>
                        <p className='descriptionText'>Guests will only get your exact address once they booked a reservation</p>
                    </div>
                     <div className='addressContainer'>
                        <label className="createFormLabel">Country</label>
                        <input
                        className="createFormInput"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)} />
                        {errors.country && <p className="errors">{errors.country}</p>}

                        <label className="createFormLabel">Street Address</label>
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

                        <label className="createFormLabel">Latitude</label>
                        <input
                        className="createFormInput"
                        placeholder="Lat"
                        value={lat} onChange={(e) => setLat(e.target.value)} />
                        {errors.lat && <p className="errors">{errors.lat}</p>}


                        <label className="createFormLabel">Longitude</label>
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
                        {formType === "Create Spot" && (
                        <div className='groupInput'>
                            <label className="setUrl createFormLabel">Liven up your spot with photos</label>
                            <p className='descriptionText'>Catch guests attention with a spot title that highlights what makes your place special</p>
                            <input className="createFormInput"
                            type="text"
                            placeholder='Preview Image URL'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}/>
                            {errors.previewImage && <p className="errors">{errors.previewImage}</p>}

                            <input
                            className="createFormInput"
                            type="text"
                            placeholder='Image URL'
                            value={url1} onChange={(e) => setUrl1(e.target.value)}/>
                            {errors.imgUrl && <p className='errors'>{errors.imgUrl}</p>}

                            <input
                            className="createFormInput"
                            type="text"
                            placeholder='Image URL'
                            value={url2} onChange={(e) => setUrl2(e.target.value)}/>
                            {errors.imgUrl && <p className='errors'>{errors.imgUrl}</p>}

                            <input
                            className="createFormInput" type="text"
                            placeholder='Image URL'
                            value={url3} onChange={(e) => setUrl3(e.target.value)}/>
                            {errors.imgUrl && <p className='errors'>{errors.imgUrl}</p>}

                            <input
                            className="createFormInput"
                            type="text"
                            placeholder='Image URL'
                            value={url4} onChange={(e) => setUrl4(e.target.value)}/>
                            {errors.imgUrl && <p className='errors'>{errors.imgUrl}</p>}

                        </div>
                        )}
                     <button className="createFormBtn" type="submit" >{formType}</button>
                </form>
            </div>
    );
}

export default CreateSpot;
