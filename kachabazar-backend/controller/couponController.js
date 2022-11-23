const Coupon = require('../models/Coupon');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const addCoupon = async (req, res) => {
  try {
    const isAdded = await Coupon.findOne({ couponCode: req.body.couponCode });
  
    if (isAdded) {
      return res.status(403).send({
        message: 'This Coupon Code already Added!',
      });
    }
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.send({ message: 'Coupon Added Successfully!' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const addAllCoupon = async (req, res) => {
  try {
    await Coupon.insertMany(req.body);
    res.status(200).send({
      message: 'Coupon Added successfully!',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).populate("productType", { parent: 1, _id: 1 }).sort({ _id: -1 });
    res.send(coupons);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.title = req.body.title;
      coupon.couponCode = req.body.couponCode;
      coupon.startTime = dayjs().utc().format(req.body.startTime);
      coupon.endTime = dayjs().utc().format(req.body.endTime);
      coupon.discountPercentage = req.body.discountPercentage;
      coupon.minimumAmount = req.body.minimumAmount;
      coupon.productType = req.body.productType;
      coupon.logo = req.body.logo;
      coupon.status = req.body.status;
      await coupon.save();
      res.send({ message: 'Coupon Updated Successfully!' });
    }
  } catch (err) {
    res.status(404).send({ message: 'Coupon not found!' });
  }
};

const deleteCoupon = (req, res) => {
  Coupon.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: 'Coupon Deleted Successfully!',
      });
    }
  });
};
const applyCoupon= async (req, res) => { 
  const couponCode = req.body.couponCode;
  const couponDetails = await Coupon.findOne({couponCode:couponCode});

  if (couponDetails) {
    if( req.body.minimumAmount < couponDetails.minimumAmount ){
      
      return res.status(403).send({
        message: `Minimum ${couponDetails.minimumAmount}  required for Apply this coupon!`
      });
      
    }

    const date = new Date();
    if( date <= couponDetails.startTime ){
      
      return res.status(403).send({
        message: ` Invalid Coupon!`
      });
      
    }
    if( date >= couponDetails.endTime ){
      
      return res.status(403).send({
        message: ` Coupon Expaired!`
      });
      
    }
    
    if(couponDetails.productType.length ){

      // for (req.body.categoryId) {
      //   text += cars[i] + "<br>";
      // }
    let condition = false;
      couponDetails.productType.forEach(element =>{
       console.log(req.body.categoryId)
        if(req.body.categoryId.includes(element.toString())){
          condition = true;
        }
      });
      if(!condition){
        return res.status(403).send({
          message: `Coupon is not applicable for this category!`
        });
      }
   
      
    }
    res.send([couponDetails]);
  }else {
    res.status(403).send({
      message: 'Invalid Coupon! ',
    });
  }
}
module.exports = {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon
};
