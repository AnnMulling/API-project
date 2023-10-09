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

        const oldStart = new Date(booking.startDate).getTime();
        const oldEnd = new Date(booking.endDate).getTime();

        const newStart = new Date(startDate).getTime();
        const newEnd = new Date(endDate).getTime();
       //StartDate
           //if the existing startDate is after the desired startDate AND before the desired endDate
           if ( (oldStart > newStart && oldStart < newEnd) ||
           //OR the existing startDateate is the same as the desired startDateate
                 (oldStart === newStart) ||
                 //OR the Desired newStart is before the exisiting newStart AND before the exisitng endDate
                 (oldStart < newStart && oldEnd > newStart) ||
                 //OR the existing endDate is the same as the desire newStart
                 (oldEnd === newStart)
           ){
                   error.errors.newStart = "Start date conflicts with an existing booking"
                   sendMessage = true
            }

       //EndDate
       //if the existing newStart is same as endDate
            if ((oldStart === newEnd) ||
            //OR if the existing newStart is after the desired newEnd AND the existing newEnd is after the disired newEnd
                (oldStart < newEnd && oldEnd > newEnd) ||
                //OR if the existing endtDate is same as newEnd
                (oldEnd === newEnd) ||
                //OR if  the desired newStart is before the existing newEnd AND the existing newEnd is before the desired newEnd
                (oldEnd > newStart &&  oldEnd < newEnd)
            ) {
                   error.errors.newEnd = "End date conflicts with an existing booking"
                   sendMessage = true
               };
       //Both
       // if the newStart is after desired newStart AND the existing newEnd is before the desired newEnd
            if (oldStart > newStart && oldEnd < newEnd ) {
                   error.errors.newEnd = "End date conflicts with an existing booking";
                   error.errors.newStart = "Start date conflicts with an existing booking"
                   sendMessage = true;
            };

            if (sendMessage) {
                   error.message = "Sorry, this spot is already booked for the specified dates"
                   error.status = 403;
                   next(error)
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
            error.errors.newStart = "Start date conflicts with an existing booking"
            sendMessage = true;
        }
        if(newEndDate >= oldStartDate && newEndDate <= oldEndDate) {
            error.errors.newEnd = "End date conflicts with an existing booking"
            sendMessage = true;
        }
        if(newStartDate < oldStartDate && oldEndDate < newEndDate) {
            error.errors.newEnd = "End date conflicts with an existing booking";
            error.errors.newStart = "Start date conflicts with an existing booking"
            sendMessage = true;
        }
        if (sendMessage) {
            error.message = "Sorry, this spot is already booked for the specified dates"
            error.status = 403;
            next(error)
     }

    });

    next();
}





module.exports = { dateExistsCreate, dateOverlap, dateExistsEdit };
