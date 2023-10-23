'use strict';
const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
    {

      spotId: 1,
      url: 'https://hips.hearstapps.com/hmg-prod/images/unique-thatched-cottage-for-sale-64070369c2812.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*',
      preview: true,
    },
    {

      spotId: 2,
      url: 'https://cdn.houseplansservices.com/content/7tl37sj1js99tigr6gbr3pvg6n/w575.jpg?v=9',
      preview: true,
    },
    {

      spotId: 3,
      url: 'https://i0.wp.com/i.pinimg.com/originals/cc/c1/c5/ccc1c5c5d52a2dbc1be00ccb81268e08.jpg?resize=650,400',
      preview: true,
    },
    {

      spotId: 4,
      url: 'https://a0.muscache.com/im/pictures/ffb001b7-92a3-413f-ae51-e5b2c1df5580.jpg?im_w=720',
      preview: true,
    },
    {

      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/ebaabed4-751d-49f5-95bd-254374d84145.jpg?im_w=960',
      preview: true,
    },
    {

      spotId: 6,
      url: 'https://www.wisdells.com/Files/Partner-Images/Accomm-Partner-Images/LakeDeltonWaterfrontVillas_1.jpg?Large',
      preview: true,
    },
    {

      spotId: 7,
      url: 'https://tomlencustomhomes.com/wp-content/uploads/2021/04/Design-the-Ultimate-Luxury-Backyard-for-Your-Family14.jpg',
      preview: true,
    },

    ] ,{ validate : true})

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {url: {[Op.in]:

      ['https://hips.hearstapps.com/hmg-prod/images/unique-thatched-cottage-for-sale-64070369c2812.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*',
        'https://cdn.houseplansservices.com/content/7tl37sj1js99tigr6gbr3pvg6n/w575.jpg?v=9',
        'https://i0.wp.com/i.pinimg.com/originals/cc/c1/c5/ccc1c5c5d52a2dbc1be00ccb81268e08.jpg?resize=650,400',
        'https://a0.muscache.com/im/pictures/ffb001b7-92a3-413f-ae51-e5b2c1df5580.jpg?im_w=720',
        'https://a0.muscache.com/im/pictures/ebaabed4-751d-49f5-95bd-254374d84145.jpg?im_w=960',
        'https://www.wisdells.com/Files/Partner-Images/Accomm-Partner-Images/LakeDeltonWaterfrontVillas_1.jpg?Large',
        'https://tomlencustomhomes.com/wp-content/uploads/2021/04/Design-the-Ultimate-Luxury-Backyard-for-Your-Family14.jpg'
      ]
    }}
    , {})
  }
};
