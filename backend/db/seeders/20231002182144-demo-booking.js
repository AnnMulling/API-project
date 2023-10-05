'use strict';
const { Booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-10-19',
        endDate: '2023-10-25'
     },
     {
        spotId: 2,
        userId: 3,
        startDate: '2023-11-19',
        endDate: '2023-11-25'
    },
    {
        spotId: 3,
        userId: 6,
        startDate: '2023-12-19',
        endDate: '2023-12-25'
    }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
