'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Parolni xavfsiz xeshlash
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password123', 10);

    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@carrental.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // `down` funksiyasi o'zgarishlarni bekor qilish uchun ishlatiladi
    await queryInterface.bulkDelete('Users', { email: process.env.ADMIN_EMAIL || 'admin@carrental.com' }, {});
  }
};