const db = require('../models');
const Transaction = db.Transaction;
const Booking = db.Booking;
const Car = db.Car;
const User = db.User;

exports.createTransaction = async (req, res) => {
  const { bookingId, paymentMethod = 'card' } = req.body; // To'lov usuli
  const t = await db.sequelize.transaction();

  try {
    const booking = await Booking.findByPk(bookingId, {
        include: [Car],
        transaction: t
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: 'Buyurtma topilmadi.' });
    }
    
    // Foydalanuvchi o'z buyurtmasi uchun to'lov qilishini tekshirish
    if (booking.userId !== req.user.id) {
        await t.rollback();
        return res.status(403).json({ message: 'Siz faqat o\'z buyurtmangiz uchun to\'lov qilishingiz mumkin.' });
    }

    if (booking.status !== 'pending') {
        await t.rollback();
        return res.status(400).json({ message: `Ushbu buyurtma holati "${booking.status}", to'lov qilib bo'lmaydi.` });
    }

    // Yangi tranzaksiya yaratish
    const transaction = await Transaction.create({
      bookingId: booking.id,
      amountPaid: booking.totalCost,
      paymentDate: new Date(),
      paymentStatus: 'completed',
      paymentMethod: paymentMethod
    }, { transaction: t });

    // Buyurtma holatini 'confirmed' ga o'zgartirish
    booking.status = 'confirmed';
    await booking.save({ transaction: t });

    // Mashina holatini 'band' ga o'zgartirish
    await booking.Car.update({ availabilityStatus: false }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'To\'lov muvaffaqiyatli amalga oshirildi.', transaction });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Tranzaksiya yaratishda xatolik.', error: error.message });
  }
};

// Tranzaksiyalar ro'yxatini olish
exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const where = {};

        // Foydalanuvchi faqat o'z tranzaksiyalarini ko'rishi kerak
        if (req.user.role !== 'admin') {
            // Bu biroz murakkab so'rov, chunki tranzaksiya userga to'g'ridan-to'g'ri bog'lanmagan
            const userBookings = await Booking.findAll({ where: { userId: req.user.id }, attributes: ['id'] });
            const bookingIds = userBookings.map(b => b.id);
            where.bookingId = { [db.Sequelize.Op.in]: bookingIds };
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows } = await Transaction.findAndCountAll({
            where,
            include: [{
                model: Booking,
                include: [
                    { model: User, attributes: ['id', 'username'] },
                    { model: Car, attributes: ['id', 'make', 'model'] }
                ]
            }],
            order: [['paymentDate', 'DESC']],
            limit: limitNum,
            offset: offset,
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum,
            transactions: rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Tranzaksiyalarni olishda xatolik.', error: error.message });
    }
};

// Bitta tranzaksiyani olish
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id, {
            include: [{ model: Booking, include: [User] }]
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Tranzaksiya topilmadi.' });
        }

        // Ruxsatni tekshirish
        if (transaction.Booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu amal uchun sizda ruxsat yo\'q.' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Tranzaksiyani olishda xatolik.', error: error.message });
    }
};