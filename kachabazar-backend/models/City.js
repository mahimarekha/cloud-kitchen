const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
    },
    stateId: {
        type: String,
        required: false,
      },
    status: {
        type: Boolean,
        required: true,
      }
  },
  {
    timestamps: true,
  }
);

const City = mongoose.models.City || mongoose.model('City', citySchema);
module.exports = City;
