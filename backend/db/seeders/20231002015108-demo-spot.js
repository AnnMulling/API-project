'use strict';
const { Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 ABC",
        city: 'Chicago',
        state: 'Illinois',
        country: 'United States of America',
        lat: 34.67583928,
        lng: -134.94873109,
        name: "Cottage",
        description: "2 Acre Wooded Escape Cottage",
        price: 123
      },
      {
        ownerId: 2,
        address: "177 MAIN STREET",
        city: 'Fort Wayne',
        state: 'Indiana',
        country: 'United States of America',
        lat: 34.67583945,
        lng: -134.94873139,
        name: "Tiny-home",
        description: "The Tiny Shed Glamping-Beautiful Country Escape",
        price: 123
      },
      {
        ownerId: 3,
        address: "380 WESTMINSTER ",
        city: 'Whitethorn',
        state: 'California',
        country: 'United States of America',
        lat: 34.67582928,
        lng: -134.94873199,
        name: "Entire-Condo",
        description: "Breathtaking Oceanview! ",
        price: 123
      },
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Cottage', 'Tiny-home', 'Entire-Condo'] }
    }, {})
  }
};

