
const { Spot, Review, User } = require('../db/models');

const matchSpot = async function (err, req, res, next) {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        res.json(
            {
            "message": "Spot couldn't be found"
           }
        );
    }

    next();
};


const matchReview = async function (err, req, res, next) {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        res.status(404);
        res.json(
            {
             "message": "Review couldn't be found"
            }
        );
    };

    next(err);
}

const matchUserSpot = async function (req, res, next) {
    const { spotId } = req.params
    const { user } = req;
    const spot = await Spot.findByPk(spotId)

    if (spot.ownerId !== user.id) {
        res.status(403)
        res.json({
            message: "Unauthorized Not Allow"
        })
    };

    next();
};


const matchUserReview = async function (req, res, next) {
    const { reviewId } = req.params;
    const { user } = req;
    const review = await Review.findByPk(reviewId);

    if (review.userId !== user.id) {
        res.status(403)
        res.json({
            message: "Unauthorized Not Allow"
        })
    }

    next(err);

}


module.exports = { matchSpot, matchReview, matchUserSpot, matchUserReview }
