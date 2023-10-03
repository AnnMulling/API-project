'use strict';
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'demo1fn',
        lastName: 'demo1ln',
        email: 'user1@user.io',
        username: 'user1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'demo2fn',
        lastName: 'demo2ln',
        email: 'user2@user.io',
        username: 'user2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'demo3fn',
        lastName: 'demo3ln',
        email: 'user3@user.io',
        username: 'user3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'demo4fn',
        lastName: 'demo4ln',
        email: 'user4@user.io',
        username: 'user4',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'demo5fn',
        lastName: 'demo5ln',
        email: 'user5@user.io',
        username: 'user5',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'demo6fn',
        lastName: 'demo6ln',
        email: 'user6@user.io',
        username: 'user6',
        hashedPassword: bcrypt.hashSync('password6')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
