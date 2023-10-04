const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Spot, User, SpotImage, Review } = require('../../db/models');


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
    // check('ownerId')
    //     .isInt({ checkFalsy: true })
    //     .exists({ checkFalsy: true }),
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .isDecimal({force_decimal: true})
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .isDecimal({force_decimal: true})
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),

    handleValidationErrors
];


//Get all Spots
router.get('/', async(req, res) => {

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
            include:
            [
                {
                    model: SpotImage,
                    attributes: ['url'],
                }
             ]
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

    res.json(result)
});

//Get all Spots owned by the Current User
router.get('/current', async(req, res) => {

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

//Create a Spot
router.post('/', validateSpot, async(req, res) => {
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
router.post('/:spotId/images', async(req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

    // console.log('==>', spotId, '===>', url)

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


//Delete a Spot

module.exports = router;
