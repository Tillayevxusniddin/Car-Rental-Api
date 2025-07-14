const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/', protect, isAdmin, userController.getUsers);
router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, userController.updateUser); 
router.delete('/:id', protect, isAdmin, userController.deleteUser);

module.exports = router;