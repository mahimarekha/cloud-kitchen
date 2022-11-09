const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vendorOrdersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderInvoice: {
        type: String,
        required: false,
      },
    cart: [{}],
  
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Delivered','Rejected'],
    },
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const VendorOrders =
  mongoose.models.VendorOrders ||
  mongoose.model(
    'VendorOrders',
    vendorOrdersSchema
  );
module.exports = VendorOrders;
