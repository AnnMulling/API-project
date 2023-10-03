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
        isDate: true,
      //   checkDate() {
      //     if (this.startDate) {
      //       throw new Error("Start date conflicts with an existing booking")
      //     }
      //   }
      //  }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,

        // startAfterendDate() {
        //   if (this.endDate.isBefore(this.startDate)) {
        //     throw new Error("endDate cannot be on or before startDate")
        //   }
        // },
        // checkDate() {
        //   if (this.endDate) {
        //     throw new Error("End date conflicts with an existing booking")
        //   }
        // }
       }
    },


  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Booking;
};
