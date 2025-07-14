const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    amountPaid: { 
      type: DataTypes.FLOAT,
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paymentStatus: { 
      type: DataTypes.STRING,
      defaultValue: 'completed' 
      
    }
  });
  return Transaction;
};