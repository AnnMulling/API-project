const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Spot, User, SpotImage, Review } = require('../../db/models');


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
    check('ownerId')
        .isInt({ checkFalsy: true })
        .exists({ checkFalsy: true }),
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid address'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid city'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid state'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid country'),
    check('lat')
        .isInt({ checkFalsy: true })
        .exists({ checkFalsy: true })
        .withMessage('latitude must be number'),
    check('lng')
        .isInt({ checkFalsy: true })
        .exists({ checkFalsy: true })
        .withMessage('longitude must be number'),
    check('name')
        .exists({ checkFalsy: true }),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide description'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Please provide description'),

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


//Add an Image to a Spot based on the Spot's id

//Edit a Spot


//Delete a Spot

module.exports = router;
