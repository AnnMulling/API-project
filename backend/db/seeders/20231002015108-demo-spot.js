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
      {
        ownerId: 4,
        address: "678 Oak Shadow ",
        city: 'Devenport',
        state: 'Florida',
        country: 'United States of America',
        lat: 28.67582928,
        lng: -128.94873199,
        name: "Entire home",
        description: "Mini Golf, 5xThemed Bedrooms, Sauna, Space Theater",
        price: 607
      },
      {
        ownerId: 5,
        address: "177 Paw Paw Ave ",
        city: 'Coloma',
        state: 'Michigan',
        country: 'United States of America',
        lat: 40.67582928,
        lng: -169.94873199,
        name: "Entire-Cabin",
        description: "Beautiful Cabin by the River, across Paw Paw Lake! ",
        price: 420
      },
      {
        ownerId: 6,
        address: "380 Salem ",
        city: 'Wisconsin',
        state: 'Michigan',
        country: 'United States of America',
        lat: 36.67582928,
        lng: -154.94873199,
        name: "Entire-House",
        description: "Cozy Holiday Log Cabin Getaway ",
        price: 123
      },
      {
        ownerId: 3,
        address: " W Oaky Blvd ",
        city: 'Las Vegas',
        state: 'Nevada',
        country: 'United States of America',
        lat: 34.67582928,
        lng: -134.94873199,
        name: "Entire-Guesthouse",
        description: "Private Luxury Guesthouse with Romantic Patio",
        price: 123
      },
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Cottage', 'Tiny-home', 'Entire-Condo', 'Entire home', 'Entire-Cabin', 'Entire-House', 'Entire-Guesthouse' ] }
    }, {})
  }
};
