const db = require('../models');
const jwt = require('jsonwebtoken');
const User = db.User;


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password, role: 'customer' });

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role, 
      token: generateToken(user.id),
    };

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Bu email yoki username allaqachon ro\'yxatdan o\'tgan.' });
    }
    res.status(500).json({ message: 'Foydalanuvchi yaratishda xatolik.', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email va parol kiritilishi shart.' });
        }

        const user = await User.findOne({ where: { email } });

        if (user && (await user.isPasswordMatch(password))) {
            const userResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            };
            res.status(200).json(userResponse);
        } else {
            res.status(401).json({ message: 'Email yoki parol noto\'g\'ri.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Tizimga kirishda xatolik.', error: error.message });
    }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik.', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: { model: Role, attributes: ['role_name'] },
    });
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Foydalanuvchini olishda xatolik.', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
    }

    await user.update(req.body);

    const updatedUserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id
    };

    res.status(200).json(updatedUserResponse);
  } catch (error) {
    res.status(500).json({ message: 'Foydalanuvchini yangilashda xatolik.', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi.' });
  } catch (error) {
    res.status(500).json({ message: 'Foydalanuvchini o\'chirishda xatolik.', error: error.message });
  }
};