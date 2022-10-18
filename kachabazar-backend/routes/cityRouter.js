const express = require('express');
const router = express.Router();
const {
    addCity,addAllCity,deleteCity,getAllCity,getCityById,updateCity
} = require('../controller/cityController');

//add a coupon
router.post('/add', addCity);

//add multiple coupon
router.post('/all', addAllCity);

//get all coupon
router.get('/', getAllCity);

//get a coupon
router.get('/:id', getCityById);

//update a coupon
router.put('/:id', updateCity);

//delete a coupon
router.delete('/:id', deleteCity);

module.exports = router;
