
const Locality = require('../models/Locality');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const addLocality = async (req, res) => {
    try {
      const newLocality = new Locality(req.body);
      await newLocality.save();
      res.send({ message: 'Locality Added Successfully!' });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
  const addAllLocality = async (req, res) => {
    try {
      await Locality.insertMany(req.body);
      res.status(200).send({
        message: 'Locality Added successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const getAllLocality = async (req, res) => {
    try {
      const locality = await Locality.find({}).populate("cityId");
      res.send(locality);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const getLocalityByCityId = async (req, res) => {
    try {
      const locality = await Locality.find({cityId:req.body.cityId}).populate("cityId");
      res.send(locality);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const getLocalityById = async (req, res) => {
    try {
      const locality = await Locality.findById(req.params.id);
      res.send(locality);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };
  const updateLocality = async (req, res) => {
    try {
      const locality = await Locality.findById(req.params.id);
      if (locality) {
        locality.cityId = req.body.cityId;
        locality.area = req.body.area;
        locality.status = req.body.status;
        await locality.save();
        res.send({ message: 'Locality Updated Successfully!' });
      }
    } catch (err) {
      res.status(404).send({ message: 'Locality not found!' });
    }
  };
  const deleteLocality = (req, res) => {
    Locality.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Locality Deleted Successfully!',
        });
      }
    });
  };
  module.exports = {
    addLocality,
    addAllLocality,
    getAllLocality,
    getLocalityById,
    updateLocality,
    deleteLocality,
    getLocalityByCityId
  };