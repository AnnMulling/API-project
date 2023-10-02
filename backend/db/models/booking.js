'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //user has many bookings
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      //many spots can be booked
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });

    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,

      validate: {
        checkStartDate(date) {
          if(date) {
            throw Error ("Start date conflicts with an existing booking")
          }
        },
     }

    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        checkDate(value) {
          if (new Date(value) < new Date()) {
            throw new Error ("endDate cannot be on or before startDate")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
