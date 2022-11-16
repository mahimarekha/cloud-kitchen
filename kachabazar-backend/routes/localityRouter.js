const express = require('express');
const { isAuth, isAdmin } = require('../config/auth');
const router = express.Router();
const {
    addLocality,addAllLocality,getAllLocality,getLocalityById,updateLocality,deleteLocality,
    getLocalityByCityId,calculateDistance
} = require('../controller/localityController');

//add a coupon
router.post('/add', isAuth,addLocality);

router.post('/getLocalityByCityId', getLocalityByCityId);
//add multiple coupon
router.post('/all', isAuth,addAllLocality);

//get all coupon
router.get('/',isAuth, getAllLocality);

//get a coupon
router.get('/:id',isAuth, getLocalityById);

//update a coupon
router.put('/:id', isAuth,updateLocality);

//delete a coupon
router.delete('/:id',isAuth, deleteLocality);

//calculate a coupon
router.post('/calculate', calculateDistance);
module.exports = router;
