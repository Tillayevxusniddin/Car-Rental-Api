// /src/server.js

require('dotenv').config();
const express = require('express');
const helmet = require('helmet'); // Xavfsizlik sarlavhalarini qo'shadi
const cors = require('cors'); // Boshqa manbalardan so'rovlarga ruxsat beradi
const rateLimit = require('express-rate-limit'); // So'rovlar sonini cheklaydi

const db = require('./src/models');
const errorHandler = require('./src/middlewares/errorHandler');

// Marshrutlarni import qilish
const userRoutes = require('./src/routes/user.routes');
const carRoutes = require('./src/routes/car.routes');
const bookingRoutes = require('./src/routes/booking.routes');
const transactionRoutes = require('./src/routes/transaction.routes');

const app = express();

// --- Asosiy Middleware'lar ---
app.use(express.json()); // Kiruvchi JSON so'rovlarini tushunish uchun
app.use(express.urlencoded({ extended: true })); // Kiruvchi form-data'larni tushunish uchun
app.use(helmet()); // Xavfsizlik uchun
app.use(cors()); // CORS'ni yoqish

// So'rovlarni cheklash (Brute-force hujumlaridan himoya)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // Har bir IP'dan 15 daqiqada 100 ta so'rov
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- API Marshrutlari ---
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/transactions', transactionRoutes);

// Tizim holatini tekshirish uchun oddiy marshrut
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Car Rental API is running.' });
});

// Markazlashtirilgan xatolik ushlovchi (barcha marshrutlardan keyin bo'lishi shart)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Ma'lumotlar bazasini sinxronlash va serverni ishga tushirish
db.sequelize.sync({ alter: true }) // `force: true` ishlatmang, bu jadvallarni o'chirib yuboradi!
  .then(() => {
    console.log('Ma\'lumotlar bazasi muvaffaqiyatli sinxronlandi.');
    app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda ishlamoqda...`);
    });
  })
  .catch((err) => {
    console.error('Ma\'lumotlar bazasiga ulanib bo\'lmadi:', err);
  });