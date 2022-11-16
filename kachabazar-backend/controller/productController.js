const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).send({
      message: 'Product Added Successfully!',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: 'Product Added successfully!',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const prepareJSON =(product)=>{
  return {
    "price":product.price,
"discount":product.discount,
"flashSale":product.flashSale,
"status":product.status,
"_id":product._id,
"categoryId":product.categoryId,
"title":product.title,
"originalPrice":product.originalPrice,
"quantity":product.quantity,
"pricing":product.pricing,
description:product.description,
image:product.image,
createdAt:product.createdAt,
updatedAt:product.updatedAt,
unit:product.unit
  }
}
const addVendorDetails = (productList, vendorList) => {
  return productList.map(product => {
    const vendorDetails = vendorList.filter(vendor => vendor.categoryId.includes(product.categoryId));
    return { ...prepareJSON(product), ...{ vendorDetails: vendorDetails } };
  });
  ;
}
const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: true }).sort({ _id: -1 });
    const vendor = await Vendor.find({}, { cityId: 1, localityId: 1, categoryId: 1, _id: 1, orgName: 1, fullName: 1, mobileNumber: 1, geoLocation:1 }).populate("cityId", { cityName: 1, _id: 1 }).populate("localityId", { area: 1, _id: 1 });
    const finalProductList = addVendorDetails(products, vendor);
    res.send(finalProductList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDiscountedProducts = async (req, res) => {
  try {
    const products = await Product.find({ discount: { $gt: 5 } }).sort({
      _id: -1,
    });
    const vendor = await Vendor.find({}, { cityId: 1, localityId: 1, categoryId: 1, _id: 1, orgName: 1, fullName: 1, mobileNumber: 1 }).populate("cityId", { cityName: 1, _id: 1 }).populate("localityId", { area: 1, _id: 1 });
    const finalProductList = addVendorDetails(products, vendor);
    res.send(finalProductList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  
  const { title, category, price, page, limit } = req.query;

  const queryObject = {};

  let sortPrice;

  if (title) {
    queryObject.$or = [{ title: { $regex: `${title}`, $options: 'i' } }];
  }

  if (price === 'Low') {
    sortPrice = 1;
  } else {
    sortPrice = -1;
  }

  if (category) {
    // queryObject.category = { $regex: category, $options: 'i' };
    queryObject.parent = { $regex: category, $options: 'i' };
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);
   
    const products = await Product.find(queryObject).populate("categoryId")
      .sort(price ? { price: sortPrice } : { _id: -1 })
      .skip(skip)
      .limit(limits);
      const vendor = await Vendor.find({}, { cityId: 1, localityId: 1, categoryId: 1, _id: 1, orgName: 1, fullName: 1, mobileNumber: 1 }).populate("cityId", { cityName: 1, _id: 1 }).populate("localityId", { area: 1, _id: 1 });
      const finalProductList = addVendorDetails(products, vendor);

    res.send({
      finalProductList,
      totalDoc,
      limits,
      pages,
      vendor,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStockOutProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $lt: 1 } }).sort({
      _id: -1,
    });
    const vendor = await Vendor.find({}, { cityId: 1, localityId: 1, categoryId: 1, _id: 1, orgName: 1, fullName: 1, mobileNumber: 1 }).populate("cityId", { cityName: 1, _id: 1 }).populate("localityId", { area: 1, _id: 1 });
    const finalProductList = addVendorDetails(products, vendor);

    res.send(finalProductList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  console.log("getProductBySlug")
  try {
    const product = await Product.find({ _id: req.params.slug });
   
     if(product){
      const vendor = await Vendor.find({}, { cityId: 1, localityId: 1, categoryId: 1, _id: 1, orgName: 1, fullName: 1, mobileNumber: 1 }).populate("cityId", { cityName: 1, _id: 1 }).populate("localityId", { area: 1, _id: 1 });
      const finalProductList = addVendorDetails(product, vendor);
  
      res.send(finalProductList[0]);
     }else{
      res.send(null);
     }
    
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  console.log("getProductById")
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.categoryId = req.body.categoryId;
      product.title = req.body.title;
      product.image = req.body.image;
      product.description = req.body.description;
      // product.parent = req.body.parent;
      // product.children = req.body.children;
      product.type = req.body.type;
      product.unit = req.body.unit;
      product.quantity = req.body.quantity;
      product.originalPrice = req.body.originalPrice;
      product.price = req.body.price;
      product.discount = req.body.discount;
      product.status = req.body.status;
      product.title = req.body.title;
      product.tag = req.body.tag;
      product.pricing = req.body.pricing;
      await product.save();
      res.send({ data: product, message: 'Product updated successfully!' });
    }
    
    // handleProductStock(product);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
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
          message: `Product ${newStatus} Successfully!`,
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: 'Product Deleted Successfully!',
      });
    }
  });
};

module.exports = {
  addProduct, 
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getDiscountedProducts,
  getStockOutProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateStatus,
  deleteProduct,
};
