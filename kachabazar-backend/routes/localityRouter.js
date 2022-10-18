const express = require('express');
const router = express.Router();
const {
    addLocality,addAllLocality,getAllLocality,getLocalityById,updateLocality,deleteLocality,getLocalityByCityId
} = require('../controller/localityController');

//add a coupon
router.post('/add', addLocality);

router.post('/getLocalityByCityId', getLocalityByCityId);
//add multiple coupon
router.post('/all', addAllLocality);

//get all coupon
router.get('/', getAllLocality);

//get a coupon
router.get('/:id', getLocalityById);

//update a coupon
router.put('/:id', updateLocality);

//delete a coupon
router.delete('/:id', deleteLocality);

module.exports = router;
