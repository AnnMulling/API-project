const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, User, ReviewImage, Review, SpotImage } = require('../../db/models');

const { reqAuthReview  } = require('../../utils/validation-reqAuth');
const { validateReview } = require('../../utils/validation-review');


//Add an Image to a Review bashed on the Review's id
router.post('/:reviewId/images', [ requireAuth , reqAuthReview ], async ( req, res ) => {
    const { url } = req.body;
    const { reviewId } = req.params;

    // const review = await Review.findByPk(reviewId);

    const allReviewImg = await ReviewImage.findAll({

        where: {
            reviewId: reviewId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    if (allReviewImg.length >= 10) {
        res.status(403);
        res.json(
            {
            message: "Maximum number of images for this resource was reached"
        });
    };

    const reviewImg = await ReviewImage.create({
        reviewId,
        url,
    });

    const result = { id: reviewImg.id,
                     url: reviewImg.url
                   }

    await reviewImg.save();


    res.json(result);
})

//Get all reviews of the Current User
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userReview = await Review.unscoped().findAll({
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
                attributes:  ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']

            }
        ]
    });



    const result = userReview.map( review => review.toJSON())
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
       Reviews : result
    });
});



//Edit a Review
router.put('/:reviewId', [ requireAuth, reqAuthReview, validateReview ] , async (req, res) => {
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
router.delete('/:reviewId', [ requireAuth, reqAuthReview ], async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    await review.destroy();
    res.json({
        message: "Successfully deleted"
    });
});



module.exports = router ;
