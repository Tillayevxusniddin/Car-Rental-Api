const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Car = sequelize.define('Car', {
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1980,
        max: new Date().getFullYear() + 1
      }
    },
    pricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    availabilityStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    licensePlate: {
      type: DataTypes.STRING,
      unique: true, 
      allowNull: true 
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true 
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.make} ${this.model} (${this.year})`;
        }
    }
  });
  return Car;
};