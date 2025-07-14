const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

router.route('/')
    .post(protect, isAdmin, carController.addCar) 
    .get(carController.getCars); 

router.route('/:id')
    .put(protect, isAdmin, carController.updateCar) 
    .delete(protect, isAdmin, carController.deleteCar) 
    .get(carController.getCar);

module.exports = router;
