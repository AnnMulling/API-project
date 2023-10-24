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
        stars: 4
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Great',
        stars: 3
      },
      {
        spotId: 3,
        userId: 6,
        review: 'Nice place',
        stars: 4
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Very cool place!',
        stars: 4
      },
      {
        spotId: 5,
        userId: 2,
        review: 'Peacful!',
        stars: 3.8
      },
      {
        spotId: 6,
        userId: 3,
        review: 'Very spacious',
        stars: 4.5
      },
      {
        spotId: 7,
        userId: 3,
        review: 'Huge Place',
        stars: 4.2
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
     { review: { [Op.in]: ['Love it!', 'Great', 'Nice place', 'Very cool place!', 'Peacful!', 'Very spacious', 'Huge Place'] }} ,
    {});
  }
};
