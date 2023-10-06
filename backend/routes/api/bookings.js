const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, SpotImage } = require('../../db/models');

const { matchUserBooking, matchBooking } = require('../../utils/validation-match');
const { validateBooking, isExisting, dateOverlap, dateExists } = require('../../utils/validation-booking');


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



//Edit a Booking

router.put('/:bookingId', [ requireAuth, matchBooking, matchUserBooking, dateOverlap ], async (req, res) => {

    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;

    let newStartDate = new Date(startDate).getTime();
    let newEndDate = new Date(endDate).getTime();
    let currentDate = new Date().getTime();

    if (currentDate > newEndDate) {
        res.status(404)
        res.json(
            {
            message: "Past bookings can't be modified"
         })
    }

    const updatedBooking = await Booking.unscoped().findByPk(bookingId, {
            attributes: {
                include: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
            }

    });

    updatedBooking.startDate = startDate;
    updatedBooking.endDate = endDate;

    res.json(updatedBooking);

});

//Delete a Booking
router.delete('/:bookingId', [ matchUserBooking, matchBooking ], async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId)

    let startDate = new Date(booking.startDate).getTime();
    let endDate = new Date(booking.endDate).getTime();
    let currentDate = new Date().getTime();

    if (startDate < currentDate) {
        res.status(403)
       return res.json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    await booking.destroy();
    res.json({
        message: "Successfully deleted"
    });
})

module.exports = router;
