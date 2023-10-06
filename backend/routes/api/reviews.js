const express = require('express');
const router = express.Router();
const { requireAuth, isreviewWriter } = require('../../utils/auth');
const { Spot, User, ReviewImage, Review, SpotImage } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { matchReview, matchUserReview  } = require('../../utils/validation-match');
const { validateReview, validateSpot } = require('../../utils/validation-review');


//Get all reviews of the Current User
router.get('/current', async(req, res) => {
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
                            preview: true
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

         review.Spot.previewImage = review.Spot.SpotImages.url

         delete review.Spot.SpotImages
    }

    res.json({
        Review: userReview
    });
});


//Add an Image to a Review bashed on the Review's id
router.post('/:reviewId/images', [ isreviewWriter, matchUserReview , matchReview,  requireAuth ], async ( req, res ) => {
    const { reviewId } = req.params;

    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    const allReviewImg = await ReviewImage.count({

        where: {
            reviewId: reviewId
        }
    });

    if (allReviewImg >= 10) {
        res.status(403);
        res.json(
            {
            message: "Maximum number of images for this resource was reached"
        });
    };

    const reviewImg = await review.createReviewImage({
            url
    });

    await reviewImg.save();

    res.json({
        id: reviewImg.id,
        url
    });
})

//Edit a Review
router.put('/:reviewId', [ isreviewWriter, matchUserReview , matchReview, validateReview, requireAuth ], async (req, res) => {
        const { reviewId } = req.params;
        const { review, stars } = req.body;
        const updatedReview = await Review.findByPk(reviewId, {

          attributes: {

            include: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']

            }

        });

        updatedReview.review = review;
        updatedReview.stars = stars;

        updatedReview.save();

        res.json(updatedReview);
});

//Delete a Review
router.delete('/:reviewId', [ matchUserReview, matchReview ], async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    await review.destroy();
    res.json({
        message: "Successfully deleted"
    });
});



module.exports = router ;
