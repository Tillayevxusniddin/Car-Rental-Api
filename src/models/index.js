const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
    host: config.host,
    dialect: config.dialect
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize);
db.Car = require('./car.model')(sequelize);
db.Booking = require('./booking.model')(sequelize);
db.Transaction = require('./transaction.model')(sequelize);
 

db.User.hasMany(db.Booking, { foreignKey: 'userId' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId' });

db.Car.hasMany(db.Booking, { foreignKey: 'carId' });
db.Booking.belongsTo(db.Car, { foreignKey: 'carId' });

db.Booking.hasOne(db.Transaction, {
  foreignKey: 'bookingId',
  onDelete: 'CASCADE'
});
db.Transaction.belongsTo(db.Booking, {
  foreignKey: 'bookingId',
  onDelete: 'CASCADE'
});


module.exports = db;