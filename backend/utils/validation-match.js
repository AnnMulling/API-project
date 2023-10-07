
const { Spot, Review, Booking } = require('../db/models');

const matchSpot = async function ( req, res, next) {
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

    next();
};


const matchBooking = async function (req, res, next) {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404);
        res.json(
            {
                "message": "Booking couldn't be found"
            }
        )
    }
    next();
};

const matchUserSpot = async function (req, res, next) {
    const { spotId } = req.params
    const { user } = req;
    const spot = await Spot.findByPk(spotId)

    if (spot) {

        if (spot.ownerId !== user.id) {
            res.status(403)
           return res.json({
                message: "Unauthorized Activity"
            })
        };
    }

    next();
};


const matchUserReview = async function (req, res, next) {
    const { reviewId } = req.params;
    const { user } = req;
    const review = await Review.findByPk(reviewId);

    if (review) {

        if (review.userId !== user.id) {
            res.status(403)
            res.json({
                message: "Unauthorized Activity"
            })
        }
    }

    next();

};

const matchUserBooking = async function (req, res, next) {
    const { user } = req;
    const { bookingId } = req.params;
    const userBooking = await Booking.findByPk(bookingId);

    if (userBooking) {
        if (userBooking.userId !== user.id) {
            res.status(404)
            res.json({
                message: "Unauthorized Activity"
            });
        }
    }
    next();
}

module.exports = { matchSpot,
                   matchReview,
                   matchBooking,
                   matchUserSpot,
                   matchUserReview,
                   matchUserBooking }
