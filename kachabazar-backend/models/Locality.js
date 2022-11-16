const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema(
  {
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true,
    },
    area: {
        type: String,
        required: true,
      },
    status: {
        type: Boolean,
        required: true,
      },
      geo:{
        type: String,
        required: true,
      }
  },
  {
    timestamps: true,
  }
);

const Locality = mongoose.models.Locality || mongoose.model('Locality', localitySchema);
module.exports = Locality;
