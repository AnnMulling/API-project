const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, User, ReviewImage, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { matchSpot, matchReview, matchUserSpot, matchUserReview  } = require('../../utils/validation-notFound');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isFloat({ min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),

    handleValidationErrors
]

//Get all reviews of the Current User
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userReview = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes:  ['id', 'firstName', 'lastName'],
            },

            {
                model: Spot,
                attributes:  ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: ['url'],
                        where: {
                            preview : true
                        }
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']

            }
        ]
    });


     userReview.map( review => review.toJSON())


    for (let review of userReview) {
        console.log(userReview)
         review.Spot.previewImage = review.Spot.SpotImages.url

         delete review.Spot.SpotImages
    }

    res.json({
        Review: userReview
    });
});


//Add an Image to a Review bashed on the Review's id
router.post('/:reviewId/images', [ matchUserReview , matchReview, requireAuth ], async ( req, res ) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const review = await Review.findByPk(reviewId);
    const allReviewImg = await ReviewImage.count({
        where: {
            reviewId: reviewId
        },
    });

    if (allReviewImg > 10) {
        res.status(403);
        res.json({
            message: "Maximum number of images for this resource was reached"
        });
    };

    const reviewImg = await review.createReviewImage({
            url
    });


    res.json({
        id: reviewImg.id,
        url
    });
})

//Edit a Review


//Delete a Review







module.exports = router ;
