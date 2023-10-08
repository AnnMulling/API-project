'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //has many spot images
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });

      //belongs to many
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'
      });

      //has many bookings
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });

      //has many reviews
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
       type: DataTypes.STRING,
       allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate : {
        min: -90.0000000,
        max: 90.0000000
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        min: -180.0000000,
        max: 180.00000000
      }
    },
    name: {
      type: DataTypes.STRING(50),
      validate: {
        len: [5, 50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',

    defaultScope: {
      attributes: {
        exclude: [ "createdAt", "updatedAt" ]
      }
    }
  });
  return Spot;
};

//Update
