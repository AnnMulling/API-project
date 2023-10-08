
const { Spot, Review, Booking, SpotImage, ReviewImage } = require('../db/models');

//check if spot exists
// if exists check if user owns the spot
const reqAuthSpot = async function ( req, res, next) {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        return res.json(
            {
            "message": "Spot couldn't be found"
           }
        );
    }

    if (user.id === spot.ownerId) {
        next();
    }else {
        const err = new Error ('Authorization required');
        err.errors = { message: 'Forbidden'}
        err.status = 403;
        return next(err);
    }

};


//check if review exists
//if exists check if user owns the review
const reqAuthReview = async function (req, res, next) {
    const { user } = req
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        res.status(404);
        return res.json(
            {
             message: "Review couldn't be found"
            }
        );
    };

    if(user.id === review.userId) {
        next();
    }else {

        const err = new Error ('Authorization required');
        err.errors = { message: 'Forbidden'}
        err.status = 403;
        return next(err);
    }

};

//check if booking exists
//if exists check if user owns the booking
const reqAuthBooking = async function (req, res, next) {
    const { user } = req;
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404);
        return res.json(
            {
                message: "Booking couldn't be found"
            }
        )
    }

    if(user.id === booking.userId) {
        next();
    }else{
        const err = new Error ('Authorization required');
        err.errors = { message: 'Forbidden'}
        err.status = 403;
        return next(err);
    }
};

//check if Image exists
//if exists check if the current user has permission

const reqAuthImageSpot  = async function (req, res, next) {
    const { user } = req;
    const { imageId } = req.params;
    const spotImage = await SpotImage.findByPk(imageId);

    if (!spotImage) {
        res.status(404);
        return res.json({
            message: "Spot Image couldn't be found"
          })
    }

    if (spotImage && spotImage.spotId) {
        const spot = await Spot.findByPk(spotImage.spotId);

        if (!spot) {
            res.status(404);
            return res.json(
                {
                message: "Spot couldn't be found"
            })
        };

        if (spot && spot.ownerId !== user.id) {
            const err = new Error ('Authorization required');
            err.errors = { message: 'Forbidden'};
            err.status = 403;
            return next(err);

        }
    };
    next();
};


const reqAuthImageReview = async function(req, res, next) {
    const { user } = req;
    const { imageId } = req.params;
    const imageReview = await ReviewImage.findByPk(imageId);

    if (!imageReview) {
        res.status(404)
        return res.json({

                message: "Review Image couldn't be found"
        })
    };

    if (imageReview && imageReview.reviewId) {
        const review = await Review.findByPk(imageReview.reviewId);

            if (review && user.id !== review.userId) {
                const err = new Error ('Authorization required');
                err.errors = { message: 'Forbidden'};
                err.status = 403;
                return next(err);
            };
    };

    next();
};

// //check if user own the spot
// const matchUserSpot = async function (req, res, next) {
//     const { spotId } = req.params
//     const { user } = req;
//     const spot = await Spot.findByPk(spotId)

//     if (spot) {

//         if (spot.ownerId !== user.id) {
//             res.status(403)
//            return res.json({
//                 message: "Forbidden"
//             })
//         };
//     }

//     next();
// };

//check if user own the review
// const matchUserReview = async function (req, res, next) {
//     const { reviewId } = req.params;
//     const { user } = req;
//     const review = await Review.findByPk(reviewId);

//     if (review && review.userId !== user.id) {
//                 res.status(403)
//             return res.json({
//                 message: "Forbidden"
//             })

//     }

//     next();

// };

//check if user own the booking
// const matchUserBooking = async function (req, res, next) {
//     const { user } = req;
//     const { bookingId } = req.params;
//     const userBooking = await Booking.findByPk(bookingId);

//     if (userBooking) {
//         if (userBooking.userId !== user.id) {
//             res.status(403)
//             return res.json({
//                 message: "Forbidden"
//             });
//         }
//     }
//     next();
// }

module.exports = { reqAuthSpot,
                   reqAuthReview,
                   reqAuthBooking,
                   reqAuthImageSpot,
                   reqAuthImageReview }
