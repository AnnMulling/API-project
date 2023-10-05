const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, User, ReviewImage, Review, SpotImage } = require('../../db/models');

const { matchReview, matchUserReview  } = require('../../utils/validation-notFound');
const { validateReview } = require('../../utils/validation-review');


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

            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']

            }
        ]
    });

    const result = userReview.map(review => review.toJSON())
    const images = await SpotImage.findAll({
        where: {
            preview: true
        }
    });


    for (let i = 0; i < result.length; i++) {
        let review = result[i];

        if (!images.length) review.Spot.previewImage = "Image Not Available";

        for (let j = 0; j < images.length; j++) {
            let image = images[j];
            review.Spot.previewImage = image.url
        }
    };


    res.json({
        Review: result
    });
});


//Add an Image to a Review bashed on the Review's id
router.post('/:reviewId/images', [ matchUserReview , matchReview,  requireAuth ], async ( req, res ) => {
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
router.put('/:reviewId', [  matchUserReview , matchReview, validateReview, requireAuth ], async (req, res) => {
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



module.exports = router;
