const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage } = require('../../db/models');


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validateReview, validateSpot } = require('../../utils/validation-review');


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

    res.json(result);
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

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews',  requireAuth, async(req, res) => {
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

    res.json(result);
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', [ requireAuth, validateReview ] , async(req, res) => {
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

     const newReview = await Review.unscoped().create({
        userId: user.id,
        spotId,
        review,
        stars
     });

    res.status(201)
    res.json(newReview)

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
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        res.status(404)
        res.json(
            {
            "message": "Spot couldn't be found"
            }
        )
    };

    const spotImg = await spot.createSpotImage({
        url,
        preview
    });

    res.json(spotImg);
})

//Edit a Spot
router.put('/:spotId', [ validateSpot, requireAuth ], async(req, res) => {
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

    if (spot.ownerId !== user.id) {
        res.status(403)
        res.json({
            message: "Unauthorized Not Allow"
        })
    }


    if(!spot) {
        res.status(404)
        res.json(
            {
            "message": "Spot couldn't be found"
            }
        )
    };

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

router.delete('/:spotId', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    console.log(spotId)
    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        res.status(404)
        res.json(
            {
            "message": "Spot couldn't be found"
            }
        )
    };

    await spot.destroy();

    res.json(
        {
        "message": "Successfully deleted"
        }
      )

});

module.exports = router;
