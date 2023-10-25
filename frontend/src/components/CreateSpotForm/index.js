import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './CreateSpot.css';

function CreateSpot() {
    const dispatch = useDispatch();

    const [country, setCountry] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [latitude, setLatitue] = useState("");
    const [longitude, setLongitude] = useState("");
    const [textArea, setTextArea] = useState("");
    const [spotName, setSpotName] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("");
    const [errors, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();


    }

    return (
        <>
            <div className="mainCreateSpotContianer">
                <div id="mainTitle">
                    <h1>Create a new Spot</h1>
                    <h2>Where's your place located?</h2>
                    <p className='descriptionText'>Guests will only get your exact address once they booked a reservation</p>
                </div>
                <form onsubmit={handleSubmit} className="createSpotForm">
                     <div className='addressContainer'>
                        <label className="createFormLabel">Country</label>
                        <input className="createFormInput" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />

                        <label className="createFormLabel">Stree Address</label>
                        <input className="createFormInput" placeholder="Address" value={streetAddress} onChange={(e) => setCountry(e.target.value)} />

                        <label className="createFormLabel">City</label>
                        <input className="createFormInput" placeholder="City" value={city} onChange={(e) => setCountry(e.target.value)} />
                        <label className="createFormLabel">State</label>
                        <input className="createFormInput" placeholder="STATE" value={state} onChange={(e) => setCountry(e.target.value)} />

                        <label className="createFormLabel">Latitude</label>
                        <input className="createFormInput" placeholder="Latitude" value={latitude} onChange={(e) => setLatitue(e.target.value)} />
                        <label className="createFormLabel">Longitude</label>
                        <input className="createFormInput" placeholder="Longtitude" value={longitude} onChange={(e) => setLatitue(e.target.value)} />
                     </div>

                    <div className='groupInput'>
                        <label className="setDescription createFormLabel">Describe your place to guests</label>
                        <p className='descriptionText'>Mention the best features of your space, any special amentities like fast wifi
                            or parking, and what you love about the neighborhood.
                        </p>
                        <textArea
                         id="textCreate"
                         className="createFormInput"
                         placeholder="Please write at least 30 characters"
                         name={textArea}></textArea>
                    </div>

                    <div className='groupInput'>
                        <label className="createTitle createFormLabel">Create a title for your spot</label>
                        <p className='descriptionText'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        <input
                        className="createFormInput"
                        type="text"
                        placeholder='Name of your spot'
                        value={spotName}
                        onChange={(e) => setSpotName(e.target.value)}/>
                    </div>

                    <div className='groupInput'>
                        <label className="setPrice createFormLabel">Set a base price for your spot</label>
                        <p className='descriptionText'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <div><span style={{marginRight:'5px'}}>$</span>
                        <input
                        className="createFormInput"
                        id="priceInput"
                        type="text"
                        placeholder='Price per night(USD)'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                        </div>
                    </div>

                    <div className='groupInput'>
                        <label className="setUrl createFormLabel">Liven up your spot with photos</label>
                        <p className='descriptionText'>Catch guests attention with a spot title that highlights what makes your place special</p>
                        <input className="createFormInput" type="text" placeholder='Preview Image URL' value={url} onChange={(e) => setUrl(e.target.value)}/>
                        <input className="createFormInput" type="text" placeholder='Image URL' value={url} onChange={(e) => setUrl(e.target.value)}/>
                        <input className="createFormInput" type="text" placeholder='Image URL' value={url} onChange={(e) => setUrl(e.target.value)}/>
                        <input className="createFormInput" type="text" placeholder='Image URL' value={url} onChange={(e) => setUrl(e.target.value)}/>
                        <input className="createFormInput" type="text" placeholder='Image URL' value={url} onChange={(e) => setUrl(e.target.value)}/>
                    </div>

                </form>
                <button id="createFormBtn" type="submit">Create Spot</button>
            </div>
        </>
    );
}

export default CreateSpot;
