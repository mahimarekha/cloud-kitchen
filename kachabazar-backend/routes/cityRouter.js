const express = require('express');
const { isAuth, isAdmin } = require('../config/auth');
const router = express.Router();
const {
    addCity,addAllCity,deleteCity,getAllCity,getCityById,updateCity
} = require('../controller/cityController');

//add a coupon
router.post('/add',isAuth, addCity);

//add multiple coupon
router.post('/all',isAuth, addAllCity);

//get all coupon
router.get('/', getAllCity);

//get a coupon
router.get('/:id',isAuth, getCityById);

//update a coupon
router.put('/:id',isAuth, updateCity);

//delete a coupon
router.delete('/:id',isAuth, deleteCity);

module.exports = router;
