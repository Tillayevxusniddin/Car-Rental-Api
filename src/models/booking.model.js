const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cars', 
            key: 'id'
        }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isFuture(value) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (new Date(value) < yesterday) {
                throw new Error('Ijara sanasi o\'tmishda bo\'lishi mumkin emas.');
            }
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (this.startDate && new Date(value) <= new Date(this.startDate)) {
            throw new Error('Ijara tugash sanasi boshlanish sanasidan keyin bo\'lishi kerak.');
          }
        }
      }
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
          min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    }
  });

  return Booking;
};