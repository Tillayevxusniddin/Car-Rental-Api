
const db = require('../models');
const { Op } = require('sequelize');
const Car = db.Car;

exports.addCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Ma\'lumotlar noto\'g\'ri kiritildi.', errors: messages });
    }
    res.status(500).json({ message: 'Mashina qo\'shishda xatolik.', error: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const { make, model, year, priceMin, priceMax, status, sortBy, order = 'ASC', page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    const sort = [];

    if (!req.user || req.user.role !== 'admin') {
      where.availabilityStatus = true;
    }

    if (status) {
      where.availabilityStatus = (status === 'true');
    }
    
    if (make) where.make = { [Op.iLike]: `%${make}%` };
    if (model) where.model = { [Op.iLike]: `%${model}%` };
    if (year) where.year = parseInt(year, 10);
    if (priceMin || priceMax) {
      where.pricePerDay = {};
      if (priceMin) where.pricePerDay[Op.gte] = parseFloat(priceMin);
      if (priceMax) where.pricePerDay[Op.lte] = parseFloat(priceMax);
    }

    const allowedSortBy = ['make', 'model', 'year', 'pricePerDay'];
    if (sortBy && allowedSortBy.includes(sortBy)) {
      sort.push([sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
    } else {
      sort.push(['createdAt', 'DESC']);
    }

    const { count, rows } = await Car.findAndCountAll({
      where,
      order: sort,
      limit: limitNum,
      offset: offset,
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      cars: rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Mashinalarni olishda xatolik.', error: error.message });
  }
};


exports.getCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Mashina topilmadi.' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Mashinani olishda xatolik.', error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Mashina topilmadi.' });
    }
    await car.update(req.body);
    res.status(200).json(car);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Ma\'lumotlar noto\'g\'ri kiritildi.', errors: messages });
    }
    res.status(500).json({ message: 'Mashinani yangilashda xatolik.', error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Mashina topilmadi.' });
    }
    await car.destroy();
    res.status(200).json({ message: 'Mashina muvaffaqiyatli o\'chirildi.' });
  } catch (error) {
    res.status(500).json({ message: 'Mashinani o\'chirishda xatolik.', error: error.message });
  }
};