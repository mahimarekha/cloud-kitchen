const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
    {
        orgName: {
            type: String,
            unique:true,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            unique:true,
            required: true,
        },
        altMobileNumber: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: true,
        },
        
        pincode: {
            type: Number,
            required: true,
        },
        geoLocation: {
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        cityId: {

            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: true,

        },
        localityId: {

            type: mongoose.Schema.Types.ObjectId,
            ref: "Locality",
            required: true,

        },
        categoryId: [{

            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false,

        }],
        gst: {
            type: String,
            required: false,
        },
        pan: {
            type: String,
            required: false,
        },
        accName: {
            type: String,
            required: true,
        },
        accNumber: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        ifsc: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
