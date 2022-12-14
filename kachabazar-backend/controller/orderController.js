const dayjs = require('dayjs');
const Order = require('../models/Order');
const Vendor= require('../models/Vendor')
const {orderTempleteMail} = require('../utils/emailTemplete');
const {adminEmail} =require('../utils/emailTemplete')
const VendorOrders = require('../models/VendorOrders');
var ObjectId = require('mongodb').ObjectID;
const { signInToken, tokenForVerify, sendEmail, sendOrderEmail } = require('../config/auth');
const getAllOrders = async (req, res) => {
  const { contact, status, page, limit, day } = req.query;

  console.log(req.query);

  // day count
  let date = new Date();
  const today = date.toString();
  date.setDate(date.getDate() - Number(day));
  const dateTime = date.toString();

  const beforeToday = new Date();
  beforeToday.setDate(beforeToday.getDate() - 1);

  const queryObject = {};





     
    
  

  if (contact) {
    queryObject.contact = { $regex: `${contact}`, $options: 'i' };
  }

  if (day) {
    queryObject.createdAt = { $gte: dateTime, $lte: today };
  }

  if (status) {
    queryObject.status = { $regex: `${status}`, $options: 'i' };
  }

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const totalDoc = await Order.countDocuments(queryObject);
    // today order amount

    // query for orders
    const orders = await Order.find(queryObject)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      limits,
      pages,
      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ _id: -1 });
    res.send(orders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const updateOrderDetails = (req, res) => {
  const newStatus = req.body.status;
  console.log(req.body)
  Order.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        cart:req.body.cart,
        isOrderAssign:req.body.isOrderAssign,
        status:req.body.status
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Order Updated Successfully!',
        });
      }
    }
  );
};

const updateOrder = (req, res) => {
  const newStatus = req.body.status;
  Order.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: 'Order Updated Successfully!',
        });
      }
    }
  );
};


const updateVendorOrders = async (req, res) => {
  const newStatus = req.body.status;

  const order = await VendorOrders.findById(req.params.id);
  const vendorId = await Vendor.findById(order.vendorId);
  VendorOrders.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        const userEmail = {
          price: order.total,
          date: order.deliveryDate,
          orderId: order.orderInvoice,
          shippingCost: order.shippingCost,
          tax: order.tax,
          coupon: order.discount,
          total: order.total,
          status:newStatus,
          name:vendorId.orgName,
          subTotal:order.subTotal
        };
        const body = {
          from: process.env.EMAIL_USER,
          to:  [vendorId.email,"kilarurekha@gmail.com"],
          subject: 'Your Order Detailes',
          
          html: orderTempleteMail(userEmail),
        };
  
        const message = 'Please check your email to verify!';
        //res.send(body);
        sendOrderEmail(body);
        res.status(200).send({
          message: 'Vendor Order Updated Successfully!',
        });
      }
    }
  );
};

const deleteOrder = (req, res) => {
  Order.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: 'Order Deleted Successfully!',
      });
    }
  });
};
const bestSellerProductChart = async (req, res) => {
  try {
    const totalDoc = await Order.countDocuments({});
    const bestSellingProduct = await Order.aggregate([
      {
        $unwind: '$cart',
      },
      {
        $group: {
          _id: '$cart.title',

          count: {
            $sum: '$cart.quantity',
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);

    res.send({
      totalDoc,
      bestSellingProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const getDashboardOrders = async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  let week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date().toDateString();

  // (startDate = '12:00'),
  //   (endDate = '23:59'),
  console.log('page, limit', page, limit);

  try {
    const totalDoc = await Order.countDocuments({});

    // query for orders
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: '$total',
          },
        },
      },
    ]);

    // total order amount
    const todayOrder = await Order.find({ createdAt: { $gte: start } });

    // this month order amount
    const totalAmountOfThisMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: '$createdAt',
            },
            month: {
              $month: '$createdAt',
            },
          },
          total: {
            $sum: '$total',
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: 'Pending',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: 'Processing',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: 'Delivered',
        },
      },
      {
        $group: {
          _id: null,


          total: { $sum: '$total' },
          count: {
            $sum: 1,
          },
        },
      },
    ]);



  


    //weekly sale report
    // filter order data
    const weeklySaleReport = await Order.find({
      $or: [{ status: { $regex: `Delivered`, $options: 'i' } }],
      createdAt: {
        $gte: week,
      },
    });

    res.send({
      totalOrder: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      todayOrder: todayOrder,
      totalAmountOfThisMonth:
        totalAmountOfThisMonth.length === 0
          ? 0
          : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
      totalPendingOrder:
        totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
      totalProcessingOrder:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      totalDeliveredOrder:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
        completeOrder:
        completeOrder.length === 0 ? 0 : completeOrder[0].count,

      orders,
      weeklySaleReport,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const addOrder = async (req, res) => {
  try {
    
    // const newVendorOrder = new VendorOrders({
    //   ...req.body,
     
    // });
    const vendorOrder = await VendorOrders.insertMany(req.body);

    vendorOrder.forEach(async (element) =>{
      const orderGetDetailes= element;
      const vendorId = await Vendor.findById(orderGetDetailes.vendorId);


      const userEmailJson = {
        price: orderGetDetailes.total,
        date: orderGetDetailes.deliveryDate,
        orderId: orderGetDetailes.orderInvoice,
        shippingCost: orderGetDetailes.shippingCost,
        tax: orderGetDetailes.tax,
        coupon: orderGetDetailes.discount, 
        total: orderGetDetailes.total,
        status:orderGetDetailes.status,
        name:vendorId.length ? vendorId[0].name : "",
        subTotal:orderGetDetailes.subTotal
      };
      const body = {
        from: process.env.EMAIL_USER,
        to:  [vendorId.length ? vendorId[0].email : "","kilarurekha@gmail.com"],
        subject:`  Order Assaigned To You ${orderGetDetailes.orderInvoice}  ` ,
        
        html: adminEmail(userEmailJson),
      };
  
      sendOrderEmail(body);
    } );


   



    res.status(201).send(vendorOrder);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const getVendorOrderById = async (req, res) => {
  let preparePost ={};
  if(req.params.orderId){
    preparePost = {...preparePost,...{"orderId" : ObjectId(req.params.orderId)}}
  }
 
  try {
    const vendorOrders = await VendorOrders.find(preparePost)
    .populate("orderId",{name:1, discount:1, address : 1, contact:1, title:1, deliveryDate:1, originalPrice:1, quantity:1, shippingOption : 1,paymentMethod : 1, invoice : 1,})
    .populate("vendorId",{_id:1, orgName:1, fullName:1})
    .populate("user", { name: 1, _id: 1,phone:1 });
    res.send(vendorOrders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrdersByVendorId = async (req, res) => {
  let preparePost ={};
  if(req.params.vendorId){
    preparePost = {...preparePost,...{"vendorId" : ObjectId(req.params.vendorid)}}
  }
 
  try {
    const vendorOrders = await VendorOrders.find({"vendorId" :req.params.vendorid})
    .populate("orderId",{name:1, discount:1, address : 1, contact:1, title:1, deliveryDate:1, originalPrice:1, quantity:1, shippingOption : 1,paymentMethod : 1, invoice : 1,})
    .populate("vendorId",{_id:1, orgName:1, fullName:1})
    .populate("user", { name: 1, _id: 1,phone:1 });
    res.send(vendorOrders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};




const getVendorOrdersById = async (req, res) => {
    const { page, limit } = req.query;
    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;
    let week = new Date();
    week.setDate(week.getDate() - 10);
    const start = new Date().toDateString();
    console.log('page, limit', page, limit);
    try {
      const totalDoc = await VendorOrders.countDocuments({vendorId:req.body.vendorId});
  
      // query for orders
      const orders = await VendorOrders.find({vendorId:req.body.vendorId})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limits);
  
      const totalAmount = await VendorOrders.aggregate([
        {
          $match: {
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            tAmount: {
              $sum: '$total',
            },
          },
        },
      ]);
  
      // total order amount
      const todayOrder = await VendorOrders.find({ createdAt: { $gte: start }, vendorId:req.body.vendorId });
  
      // this month order amount
      const totalAmountOfThisMonth = await VendorOrders.aggregate([
        {
          $match: {
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: '$createdAt',
              },
              month: {
                $month: '$createdAt',
              },
            },
            total: {
              $sum: '$total',
            },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $limit: 1,
        },
      ]);
  
      // total padding order count
      const totalPendingOrder = await VendorOrders.aggregate([
        {
          $match: {
            status: 'Pending',
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
  
      // total delivered order count
      const totalProcessingOrder = await VendorOrders.aggregate([
        {
          $match: {
            status: 'Processing',
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
  
      // total delivered order count
      const totalDeliveredOrder = await VendorOrders.aggregate([
        {
          $match: {
            status: 'Delivered',
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
  


      const completOrder = await VendorOrders.aggregate([
        {
          $match: {
            status: 'Completed',
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      const rejectedOrder = await VendorOrders.aggregate([
        {
          $match: {
            status: 'Rejected',
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      const acceptedOrder = await VendorOrders.aggregate([
        {
          $match: {
            status: 'Accepted',
            vendorId:ObjectId(req.body.vendorId)
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      //weekly sale report
      // filter order data
      const weeklySaleReport = await VendorOrders.find({
        $or: [{ status: { $regex: `Delivered`, $options: 'i' } }],
        createdAt: {
          $gte: week,
        },
        vendorId:req.body.vendorId
      });
  
      res.send({
        totalOrder: totalDoc,
        totalAmount:
          totalAmount.length === 0
            ? 0
            : parseFloat(totalAmount[0].tAmount).toFixed(2),
        todayOrder: todayOrder,
        totalAmountOfThisMonth:
          totalAmountOfThisMonth.length === 0
            ? 0
            : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
        totalPendingOrder:
          totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
        totalProcessingOrder:
          totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
        totalDeliveredOrder:
          totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
          completOrder:
          completOrder.length === 0 ? 0 :completOrder[0].count,
          rejectedOrder:
          rejectedOrder.length === 0 ? 0 :rejectedOrder[0].count,
          acceptedOrder:
          acceptedOrder.length === 0 ? 0 :acceptedOrder[0].count,
        orders,
        weeklySaleReport,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
};
module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByUser,
  updateOrder,
  deleteOrder,
  bestSellerProductChart,
  getDashboardOrders,
  addOrder,
  getVendorOrderById,
  updateOrderDetails,
  getOrdersByVendorId,
  updateVendorOrders,
  getVendorOrdersById
};
