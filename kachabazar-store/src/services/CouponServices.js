import requests from './httpServices';

const CouponServices = {
  getAllCoupons() {
    return requests.get('/coupon');
  },
  applyCoupon(body) {
    return requests.post('/coupon/apply', body);
  },
};

export default CouponServices;
