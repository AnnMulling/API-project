const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, Booking, SpotImage } = require('../../db/models');

const { reqAuthBooking } = require('../../utils/validation-reqAuth');
const { dateOverlap, dateExistsCreate, dateExistsEdit } = require('../../utils/validation-booking');


//Get all the current user's bookings
router.get('/current', requireAuth , async (req, res) => {
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

        if (!images.length) {
            booking.Spot.previewImage = "Image Not Available";
        }

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

router.put('/:bookingId', [ requireAuth, reqAuthBooking, dateExistsEdit, dateOverlap ], async (req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;

    // let newEndDate = new Date(endDate).getTime();
    // let currentDate = new Date().getTime();

    // if (currentDate >= newEndDate ) {
    //     res.status(403)
    //     return res.json(
    //         {
    //         message: "Past bookings can't be modified"
    //      });
    // };


    // const updatedBooking = await Booking.unscoped().findByPk(bookingId, {
    //         attributes: {
    //             include: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    //         }

    // });

    const booking = await Booking.unscoped().findByPk(bookingId);

    const update = await booking.update({
        startDate, endDate
    });

    const updatedBooking = {
        id: update.id,
        spotId: update.spotId,
        userId: update.userId,
        startDate: update.startDate.toISOString().slice(0,10),
        endtDate: update.endDate.toISOString().slice(0,10),
        createdAt: update.createdAt,
        updatedAt: update.updatedAt
    }

    // updatedBooking.startDate = startDate;
    // updatedBooking.endDate = endDate;

    // updatedBooking.save();

    res.json(updatedBooking);

});

//Delete a Booking
router.delete('/:bookingId', [ requireAuth, reqAuthBooking ], async (req, res) => {
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
