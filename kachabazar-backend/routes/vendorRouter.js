const express = require('express');
const { isAuth, isAdmin } = require('../config/auth');
const router = express.Router();
const {
    addVendor,addAllVendor,getAllVendor,getVendorById,updateVendor,deleteVendor,findVendorList,loginVendor
} = require('../controller/vendorController');

//add a coupon
router.post('/add', addVendor);

//add multiple coupon
router.post('/all',isAuth, addAllVendor);

router.post('/find',isAuth, findVendorList);
//get all coupon
router.get('/',isAuth, getAllVendor);

//get a coupon
router.get('/:id',isAuth, getVendorById);

//update a coupon
router.put('/:id',isAuth, updateVendor);

//delete a coupon
router.delete('/:id',isAuth, deleteVendor);

router.post('/login', loginVendor);
module.exports = router;
