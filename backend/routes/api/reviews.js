const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, User, ReviewImage, Review } = require('../../db/models');



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
                atrribute: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                atrribute: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
            },
            {
                model: ReviewImage,
                atrribute: ['id', 'url']
            }
        ]
    })

    res.json(userReview);
})


//Get all Reviews by a Spot's id


//Create a Review for a Spot based on the Spot's id


//Add an Image to a Review bashed on the Review's id


//Edit a Review


//Delete a Review







module.exports = router;
