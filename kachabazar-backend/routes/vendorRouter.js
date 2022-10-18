const express = require('express');
const router = express.Router();
const {
    addVendor,addAllVendor,getAllVendor,getVendorById,updateVendor,deleteVendor
} = require('../controller/vendorController');

//add a coupon
router.post('/add', addVendor);

//add multiple coupon
router.post('/all', addAllVendor);

//get all coupon
router.get('/', getAllVendor);

//get a coupon
router.get('/:id', getVendorById);

//update a coupon
router.put('/:id', updateVendor);

//delete a coupon
router.delete('/:id', deleteVendor);

module.exports = router;
