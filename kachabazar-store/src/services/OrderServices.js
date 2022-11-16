import requests from './httpServices';

const OrderServices = {
  addOrder(body, headers) {
    return requests.post('/order/add', body, headers);
  },

  createPaymentIntent(body) {
    return requests.post('/order/create-payment-intent', body);
  },

  getOrderByUser({ page = 1, limit = 8 }) {
    return requests.get(`/order?limit=${limit}&page=${page}`);
  },
  getOrderById(id, body) {
    return requests.get(`/order/${id}`, body);
  },

  calculateDistance(body) {
    return requests.post('/locality/calculate', body);
  },

};

export default OrderServices;
