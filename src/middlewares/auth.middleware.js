const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Role = db.Role;

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });
      if (!req.user) {
        return res.status(401).json({ message: 'Ushbu foydalanuvchi endi mavjud emas.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Kirish uchun ruxsat yo\'q, token yaroqsiz.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Kirish uchun ruxsat yo\'q, token topilmadi.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Bu amalni bajarish uchun sizda ruxsat yo\'q (Admin emas).' });
  }
};

module.exports = { protect, isAdmin };