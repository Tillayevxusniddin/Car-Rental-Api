const db = require('../models');
const { Op } = require('sequelize');
const Booking = db.Booking;
const Car = db.Car;
const User = db.User;

exports.createBooking = async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const userId = req.user.id; 

  const t = await db.sequelize.transaction();
  try {
    const car = await Car.findByPk(carId, { transaction: t });
    if (!car) {
      await t.rollback();
      return res.status(404).json({ message: 'Mashina topilmadi.' });
    }
    if (!car.availabilityStatus) {
      await t.rollback();
      return res.status(400).json({ message: 'Bu mashina hozirda band.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        await t.rollback();
        return res.status(400).json({ message: 'Ijara tugash sanasi boshlanish sanasidan keyin bo\'lishi kerak.' });
    }

    const existingBooking = await Booking.findOne({
      where: {
        carId: carId,
        status: 'confirmed',
        [Op.or]: [
          { startDate: { [Op.lt]: end }, endDate: { [Op.gt]: start } }
        ],
      },
      transaction: t,
    });

    if (existingBooking) {
      await t.rollback();
      return res.status(409).json({ message: 'Mashina bu sanalarda allaqachon band qilingan.' });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalCost = days * car.pricePerDay;

    const booking = await Booking.create({
      userId, carId, startDate, endDate, totalCost, status: 'pending'
    }, { transaction: t });

    await t.commit();
    res.status(201).json(booking);
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ message: 'Ma\'lumotlar noto\'g\'ri kiritildi.', errors: messages });
    }
    res.status(500).json({ message: 'Buyurtma yaratishda xatolik.', error: error.message });
  }
};

exports.getBookings = async (req, res) => {
    try {
        const { carId, status, page = 1, limit = 10 } = req.query;
        const where = {};
        
        if (req.user.role !== 'admin') {
            where.userId = req.user.id;
        }

        if (carId) where.carId = carId;
        if (status) where.status = status;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows } = await Booking.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Car, attributes: ['id', 'make', 'model'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: offset,
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum,
            bookings: rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Buyurtmalarni olishda xatolik.', error: error.message });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Car }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Buyurtma topilmadi.' });
        }

        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu amal uchun sizda ruxsat yo\'q.' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Buyurtmani olishda xatolik.', error: error.message });
    }
};


exports.cancelBooking = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: 'Buyurtma topilmadi.' });
    }
    
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        await t.rollback();
        return res.status(403).json({ message: 'Bu amal uchun sizda ruxsat yo\'q.' });
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
        await t.rollback();
        return res.status(400).json({ message: `"${booking.status}" holatidagi buyurtmani bekor qilib bo'lmaydi.` });
    }

    booking.status = 'cancelled';
    await booking.save({ transaction: t });

    if (booking.status === 'confirmed') {
        await Car.update({ availabilityStatus: true }, {
            where: { id: booking.carId },
            transaction: t
        });
    }

    await t.commit();
    res.status(200).json({ message: 'Buyurtma muvaffaqiyatli bekor qilindi.', booking });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Buyurtmani bekor qilishda xatolik.', error: error.message });
  }
};