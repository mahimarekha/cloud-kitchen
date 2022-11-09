
import requests from './httpServices';

const VendorServices = {
  getAllCity() {
    return requests.get('/city');
  },
  getAllLocality() {
    return requests.get('/locality');
  },
  getAllCategory() {
    return requests.get('/category');
  },
  getLocalityByCityId(body){
    return requests.post('/locality/getLocalityByCityId',body); 
  },
  creteVendorRegistration(body){
    return requests.post('/vendor/add',body); 
  },
};

export default VendorServices;

