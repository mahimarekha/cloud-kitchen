
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail } = require('../config/auth');

dayjs.extend(utc);

const addVendor = async (req, res) => {
    try {
      const isAdded = await Vendor.findOne({ mobileNumber: req.body.mobileNumber });
      const isEmailAdded = await Vendor.findOne({ email: req.body.email });
      if (isAdded || isEmailAdded) {
        return res.status(403).send({
          message: 'This Mobile or Email already Added!',
        });
      }else{
        req.body.password = bcrypt.hashSync(req.body.password);
        const newVendor = new Vendor(req.body);
        await newVendor.save();
        res.send({ message: 'Vendor Added Successfully!' });
      }
      
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
  const loginVendor = async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ mobileNumber: req.body.mobileNumber });
      if (vendor && bcrypt.compareSync(req.body.password, vendor.password)) {
        const token = signInToken(vendor);
        res.send({
          token,
          _id: vendor._id,
          name: vendor.orgName,
          phone: vendor.mobileNumber,
          email:vendor.email,
        });
      } else {
        res.status(401).send({
          message: 'Invalid Email or password!',
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const addAllVendor = async (req, res) => {
    try {
      await Vendor.insertMany(req.body);
      res.status(200).send({
        message: 'Vendor Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const getAllVendor = async (req, res) => {
    try {
      const vendor = await Vendor.find({}).populate("cityId").populate("localityId").populate("categoryId");
      res.send(vendor);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };

const findVendorList=async(req, res)=>{
 
  let preparePost ={};
  if(req.body.localityId){
    preparePost = {...preparePost,...{"localityId" : ObjectId(req.body.localityId)}}
  }
  if(req.body.categoryId){
    preparePost = {...preparePost,...{"categoryId" : ObjectId(req.body.categoryId)}}
  }
  try {
    const vendor = await Vendor.find(preparePost).populate("cityId").populate("localityId").populate("categoryId");
    res.send(vendor);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

  const getVendorById = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      res.send(vendor);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updateVendor = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (vendor) {
        vendor.orgName = req.body.orgName;
        vendor.fullName = req.body.fullName;
        vendor.mobileNumber = req.body.mobileNumber;
        vendor.altMobileNumber = req.body.altMobileNumber;
        vendor.email = req.body.email;
        vendor.password = req.body.password;
        vendor.address = req.body.address;
        vendor.pincode = req.body.pincode;
        vendor.geoLocation = req.body.geoLocation;
        vendor.cityId = req.body.cityId;
        vendor.localityId = req.body.localityId;
        vendor.categoryId = req.body.categoryId;
        vendor.gst = req.body.gst;
        vendor.pan = req.body.pan;
        vendor.accName = req.body.accName;
        vendor.accNumber = req.body.accNumber;
        vendor.bankName = req.body.bankName;
        vendor.branch = req.body.branch;
        vendor.ifsc = req.body.ifsc;
        vendor.status = req.body.status;
        await vendor.save();
        res.send({ message: 'Vendor Updated Successfully!' });
      }
    } catch (err) {
      res.status(404).send({ message: 'Vendor not found!' });
    }
  };
  const deleteVendor = (req, res) => {
    Vendor.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Vendor Deleted Successfully!',
        });
      }
    });
  };
  module.exports = {
    addVendor,
    addAllVendor,
    getAllVendor,
    getVendorById,
    updateVendor,
    deleteVendor,
    findVendorList,
    loginVendor
  };