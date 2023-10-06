const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, SpotImage } = require('../../db/models');

const { matchUserBooking } = require('../../utils/validation-match');


//Get all the current user's bookings
router.get('/current', [ requireAuth, matchUserBooking ], async (req, res) => {
     const { user } = req;
     const userBooking = await Booking.findAll({
        where: {
            userId: user.id
        },

        include: [
            {
                model: Spot,
                attributes:  ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],

            }
        ],
        attributes: {
            include: ['userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
        },

     });

     const result = userBooking.map( booking => booking.toJSON())
     const images = await SpotImage.findAll({
         where: {
             preview: true
         }
     });

     for (let i = 0; i < result.length; i++) {
        let booking = result[i];

        if (!images.length) booking.Spot.previewImage = "Image Not Available";

        for (let j = 0; j < images.length; j++) {
             let image = images[j];

             booking.Spot.previewImage = image.url
        }
    };


     res.json({
        Booking : result
     });
})



//Create a Booking from a Spot based on the spot's id


//Edite a Booking



//Delete a Booking

module.exports = router;
