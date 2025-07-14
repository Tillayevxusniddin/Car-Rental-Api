const errorHandler = (err, req, res, next) => {
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    error.message = messages;
    return res.status(400).json({ message: "Ma'lumotlar noto'g'ri kiritildi", errors: error.message });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Bu ma\'lumot allaqachon mavjud.';
    return res.status(409).json({ message }); 
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Token yaroqsiz, iltimos qaytadan kiring.';
    return res.status(401).json({ message });
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Token muddati tugagan, iltimos qaytadan kiring.';
    return res.status(401).json({ message });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || 'Serverda kutilmagan xatolik yuz berdi.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;