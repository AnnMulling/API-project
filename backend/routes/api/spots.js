const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth, isOwner } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const { validateReview, validateSpot, validateQuery} = require('../../utils/validation-review');
const {reqAuthSpot } = require('../../utils/validation-reqAuth');
const { dateOverlap, dateExistsCreat, dateExistsCreate } = require('../../utils/validation-booking');



//Get all Spots owned by the Current User
router.get('/current', requireAuth, async(req, res) => {

    const { user } = req

    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                attributes: ['url'],
            },
        ],
        where: {
            ownerId: user.id
        }
    });

    const result = [];
    //Rating and Images
    for (let spot of spots) {
        spot = spot.toJSON();

        const spotRate = await Review.count({
            where: {
                spotId: spot.id
            }
        });

        const sumReview = await Review.sum( 'stars', {
            where: {
                spotId: spot.id
            }
        });

        spot.avgRating = sumReview / spotRate;

        if (spot.SpotImages.length)  {
            spot.previewImage = spot.SpotImages[0].url
        }


        if (spot.SpotImages.length < 0) {
             spot.previewImage = "Image not available"
        }

        delete spot.SpotImages;

        result.push(spot);

    }

    res.json({
        "Spots": result
    });
});



//Get details of a Spot from an id
router.get('/:spotId', async(req, res) => {
    const { spotId } = req.params

    const spot = await Spot.findByPk( spotId, {
        include:
        [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            },

        ],
    });

    //if NOT FOUND
    if (!spot) {
        res.status(404);
        res.json(
            {
            "message": "Spot couldn't be found"
            }
        )
    };

    const result = spot.toJSON();

    const reviews = await Review.count({
         where: {
            spotId: spotId
         }
    });

    const sumReview = await Review.sum('stars', {
        where: {
                spotId: spot.id
            }
    });
   result.numReviews = reviews;
   result.avgRating = sumReview/reviews;

    res.json(result);
});

//Get all bookings for a spot based on the spot's id
router.get('/:spotId/bookings', requireAuth,  async(req, res) => {
        const { user } = req;
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);


        if (!spot) {
            res.status(404)
            res.json(
                {
                "message": "Spot couldn't be found"
                }
              )
        };


        if (spot && spot.ownerId === user.id) {

            const ownerBookingDetail = await Booking.findAll({
                where: {
                    spotId: spotId
                },
                attributes: {
                    include: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            });
            return res.json({ Bookings : ownerBookingDetail } )
        }else {
            const guestBookingDetail = await Booking.findAll({
                where: {
                    spotId: spotId
                },
                attributes: {
                    exclude: ['userId', 'createdAt', 'upDatedAt']
                }
            });

            //const result = { Booking: [{spotId: spotId, startDate: guestBookingDetail.startDate, endDate: guestBookingDetail.endDate }] }
            return res.json({ Bookings: guestBookingDetail });
        }

})



//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req, res) => {
    const { spotId } = req.params;

    const spotReview = await Review.unscoped().findOne({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })


        if (!spotReview) {
            res.status(404)
            res.json(
                {
                "message": "Spot couldn't be found"
                }
              )
        }

       res.json({
        Review: spotReview
       });


});



//Get all Spots
router.get('/', validateQuery, async(req, res) => {

    let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    const whereSearch = {};
    const pagination = {};


    if (maxLat) whereSearch.lat = {[Op.lte]: maxLat};
    if (minLat) whereSearch.lat = {[Op.gte]: minLat};
    if (minLng) whereSearch.lng = {[Op.gte]: minLng};
    if (maxLng) whereSearch.lng = {[Op.lte]: maxLng};
    if (minPrice) whereSearch.price = {[Op.gte]: minPrice};
    if (maxPrice) whereSearch.price = {[Op.lte]: maxPrice};

    if (!page) page = 1;
    if (page > 10) page = 10;

    if (!size) size = 20;
    if (size > 20) size = 20;

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    const spots = await Spot.unscoped().findAll({
        include:
        [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            }
        ],
        where: {
            ...whereSearch
        },

        ...pagination
    });

    const result = [];

    for (let spot of spots) {
        spot = spot.toJSON();

        const spotRate = await Review.count({
            where:
            {
                spotId: spot.id
            },
        });

        const sumReview = await Review.sum( 'stars', {
            where: {
                spotId: spot.id
            }
        });

        spot.avgRating = sumReview / spotRate;

        if (spot.SpotImages.length)  {
            spot.previewImage = spot.SpotImages[0].url
        }
        delete spot.SpotImages;

        result.push(spot);

    }

    res.json({
        "Spots": result,
        page,
        size,
    });
});


//Create a Booking from a Spot based on the spot's id
router.post('/:spotId/bookings', [ requireAuth,  isOwner, dateExistsCreate, dateOverlap ], async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    let { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404)
        return res.json(
            {
            "message": "Spot couldn't be found"
            }
          )
    }

    // const newBooking = await Booking.unscoped().create({
    //     spotId,
    //     userId: user.id,
    //     startDate,
    //     endDate,
    // });

    const newBooking = await spot.createBooking({
            spotId,
            userId: user.id,
            startDate,
            endDate
    });

     await newBooking.save();

    res.json(newBooking);
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', [ requireAuth, validateReview ] , async(req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const { review, stars } = req.body;


    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
          });
    }

    const theReview = await Review.findOne({
        where: {
            [Op.and] : [

                { spotId: spotId } ,
                { userId: user.id }
            ]
        }
    });

    if (theReview) {
        res.status(500);
        return res.json(
            {
            "message": "User already has a review for this spot"
            }
        );
    };

    const newReview = await Review.unscoped().create({
        userId: user.id,
        spotId: spotId,
        review,
        stars
     });


    await newReview.save();

    res.status(201);
    res.json(newReview);

})

//Create a Spot
router.post('/', [ requireAuth, validateSpot],  async(req, res) => {
    const { user } = req;

    const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
         } = req.body;


    const newSpot = await Spot.create({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
    });

    await newSpot.save();

    res.status(201);
    res.json(newSpot)
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', [ requireAuth, reqAuthSpot ], async(req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

    // const spotImage = await SpotImage.findAll({
    //     where: {
    //         spotId: spotId
    //     }
    // });

    // if (spotId.length) {
    //     for (let )
    // }
    // if(!spot) {
    //     res.status(404)
    //     res.json(
    //         {
    //         "message": "Spot couldn't be found"
    //         }
    //     )
    // };
    //if image prview = true set the rest to false

    const spotImg = await spot.createSpotImage({
        url,
        preview
    });

    const result = { id: spotImg.id,
                     url: spotImg.url,
                     preview: spotImg.preview
                    }

    res.json(result);
});

//Edit a Spot
router.put('/:spotId', [ requireAuth, reqAuthSpot, validateSpot ], async(req, res) => {
    const { spotId } = req.params;
    const { user  } = req;
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        } = req.body;

    const spot = await Spot.unscoped().findByPk(spotId);

    // if (spot.ownerId !== user.id) {
    //     res.status(403)
    //     res.json({
    //         message: "Unauthorized Not Allow"
    //     })
    // }


    // if(!spot) {
    //     res.status(404)
    //     res.json(
    //         {
    //         "message": "Spot couldn't be found"
    //         }
    //     )
    // };

    spot.address = address
    spot.city = city
    spot.state = state
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price

   await spot.save();

    res.json(spot)

})

//Delete a Spot

router.delete('/:spotId', [ requireAuth, reqAuthSpot ], async(req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    // if(!spot) {
    //     res.status(404)
    //     res.json(
    //         {
    //         "message": "Spot couldn't be found"
    //         }
    //     )
    // };

    await spot.destroy();

    res.json(
        {
        "message": "Successfully deleted"
        }
      )

});

module.exports = router;
