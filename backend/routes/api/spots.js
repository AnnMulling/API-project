const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth, checkOwner } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');


const { validateReview, validateSpot} = require('../../utils/validation-review');
const { matchSpot, matchReview, matchUserSpot } = require('../../utils/validation-notFound');

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

    const sumReview = await Review.sum( 'stars', {
        where: {
                spotId: spot.id
            }
    });
   result.numReviews = reviews;
   result.avgRating = sumReview / reviews;

    res.json(result);
});

//Get all bookings for a spot based on the spot's id
router.get('/:spotId/bookings', matchSpot,  async(req, res) => {
        const { user } = req;
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);

        if (user.id == spot.ownerId) {
            const ownerBookingDetail = await Booking.findAll({
                where: {
                    userId: user.id
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
            })
            res.json(ownerBookingDetail)
        }else {
            const guestBookingDetail = await Booking.findAll({
                where: {
                    userId: user.id
                },
                attributes: {
                    include: ['spotId', 'startDate', 'endDate']
                }
            })
            res.json(guestBookingDetail)
        }

})





//Get all Reviews by a Spot's id
router.get('/:spotId/reviews',  matchSpot, async(req, res) => {
    const { spotId } = req.params;

    const spotReview = await Review.unscoped().findAll({
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


        if (!spotReview.length) {
            res.status(404)
            res.json(
                {
                "message": "Spot couldn't be found"
                }
              )
        }


       res.json(spotReview);


});

//Get all Spots
router.get('/',  async(req, res) => {

    const spots = await Spot.findAll({
        include:
        [
            {
                model: SpotImage,
                attributes: ['url'],
            }
        ]
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
        "Spots": result
    });
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', [ checkOwner, requireAuth, matchUserSpot, matchSpot, validateReview ] , async(req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const { review, stars } = req.body;


    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404);
        res.json({
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
        res.status(403);
        res.json(
            {
            "message": "User already has a review for this spot"
            }
        );
    };

     const newReview = await Review.unscoped().create({
        userId: user.id,
        spotId,
        review,
        stars
     });

    res.status(201);
    res.json(newReview);

})

//Create a Spot
router.post('/', [ validateSpot, requireAuth ],  async(req, res) => {
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
router.post('/:spotId/images', [ matchSpot, requireAuth ], async(req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

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

    res.json(spotImg);
})

//Edit a Spot
router.put('/:spotId', [ matchUserSpot, matchSpot, validateSpot, requireAuth ], async(req, res) => {
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

router.delete('/:spotId', [ matchUserSpot, matchSpot, requireAuth ], async(req, res) => {
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
