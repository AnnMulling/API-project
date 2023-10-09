const { Op } = require('sequelize');
const { Booking } = require('../db/models');


const dateOverlap = async function (req, _res, next) {
    let { startDate, endDate } = req.body;
    let  error = new Error("Booking Conflict");

   let newStartDate = new Date(startDate).getTime();
   let newEndDate = new Date(endDate).getTime();

   if (newStartDate >=  newEndDate) {
      error.errors = {};
      error.status = 400;
      error.message = "Bad Request";
      error.errors.endDate = "endDate cannot be on or before startDate"
      next(error);
   }
   next();

}



const dateExistsCreate = async function (req, _res, next) {

    let { startDate, endDate } = req.body;
    let spotId;

    if (req.params.spotId) {
       spotId = req.params.spotId;

    }else{
        const bookingId = req.params.bookingId;
        const booking = await Booking.findByPk(bookingId);
        spotId = booking.spotId;
    }


    let error = new Error("Booking Conflict");
    error.errors = {};
    let sendMessage = false;

    const bookings = await Booking.findAll({
       where: {
            spotId,

       }
    });

    if (bookings.length) {
       for (let booking of bookings) {

        const oldStartDate = new Date(booking.startDate).getTime();
        const oldEndDate = new Date(booking.endDate).getTime();

        const newStartDate = new Date(startDate).getTime();
        const newEndDate = new Date(endDate).getTime();

        //StartDate
            if(newStartDate >= oldStartDate && newStartDate <= oldEndDate){
                error.errors.startDate = "Start date conflicts with an existing booking"
                sendMessage = true;
            }

       //EndDate
            if(newEndDate >= oldStartDate && newEndDate <= oldEndDate) {
                error.errors.endDate = "End date conflicts with an existing booking"
                sendMessage = true;
            }

       //Both
            if(newStartDate < oldStartDate && oldEndDate < newEndDate) {
                error.errors.endDate = "End date conflicts with an existing booking";
                error.errors.startDate = "Start date conflicts with an existing booking"
                sendMessage = true;
             }

            if (sendMessage) {
                error.message = "Sorry, this spot is already booked for the specified dates"
                error.status = 403;
                next(error);
            }
       }
    }
 next();
};

const dateExistsEdit = async function(req, res, next) {
    const { user } = req;
    const { bookingId } = req.params;
    let { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId)

    const bookings = await Booking.findAll({
        where: {
            userId: user.id,
            id: {[Op.not]: booking.id}
        }
    });

    const currentDate = new Date().getTime()
    const newStartDate = new Date(startDate).getTime();
    const newEndDate = new Date(endDate).getTime();


    let error = new Error("Booking Conflict");
    error.errors = {};
    let sendMessage = false;

    bookings.forEach(booking => {
        const oldStartDate = new Date(booking.startDate).getTime();
        const oldEndDate = new Date(booking.endDate).getTime();

        if (currentDate >= newEndDate ) {
            res.status(403)
            return res.json(
                {
                message: "Past bookings can't be modified"
             });
        };

        if(newStartDate >= oldStartDate && newStartDate <= oldEndDate){
            error.errors.startDate = "Start date conflicts with an existing booking"
            sendMessage = true;
        }

        if(newEndDate >= oldStartDate && newEndDate <= oldEndDate) {
            error.errors.endDate = "End date conflicts with an existing booking"
            sendMessage = true;
        }

        if(newStartDate < oldStartDate && oldEndDate < newEndDate) {
            error.errors.endDate = "End date conflicts with an existing booking";
            error.errors.startDate = "Start date conflicts with an existing booking"
            sendMessage = true;
        }
        if (sendMessage) {
            error.message = "Sorry, this spot is already booked for the specified dates"
            error.status = 403;
            next(error);
        }

    });

    next();
}





module.exports = { dateExistsCreate, dateOverlap, dateExistsEdit };
