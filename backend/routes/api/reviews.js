const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, User, ReviewImage, Review, SpotImage } = require('../../db/models');



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
                        as: 'previewImage',
                        attributes: ['url']
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']

            }
        ]
    });


    res.json(userReview);
});




//Create a Review for a Spot based on the Spot's id


//Add an Image to a Review bashed on the Review's id


//Edit a Review


//Delete a Review





module.exports = router;
