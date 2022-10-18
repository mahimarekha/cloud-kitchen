
const Vendor = require('../models/Vendor');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const addVendor = async (req, res) => {
    try {
      const newVendor = new Vendor(req.body);
      await newVendor.save();
      res.send({ message: 'Vendor Added Successfully!' });
    } catch (err) {
      res.status(500).send({ message: err.message });
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
  };