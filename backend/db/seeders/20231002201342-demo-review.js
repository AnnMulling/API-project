'use strict';
const { Review } = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'Love it!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 5,
        review: 'Great',
        stars: 3
      },
      {
        spotId: 3,
        userId: 6,
        review: 'Nice place',
        stars: 4
      },
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
     { userId: { [Op.in]: ['user1', 'user5', 'user6'] } } ,
    {});
  }
};
