'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //user owner
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        // onDelete: 'CASCADE'
      });

      //user has many bookings
      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        // onDelete: 'CASCADE'
      });

      //user has many reviews
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        // onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3,30]
      }
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3,30]
      }
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
