import React from 'react';

import { Grid, Card, Box, Checkbox, Container, FormControl, NativeSelect, CardActions, CardContent, Button, Typography, MenuItem, Select, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
//internal import
import Layout from '@layout/Layout';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
import PageHeader from '@component/header/PageHeader';
import { useFormik } from 'formik';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import VendorServices from '@services/VendorServices';
import { useContext, useEffect, useState } from 'react';
import { notifyError, notifySuccess } from '@utils/toast';
import { useRouter } from 'next/router';
const VendorRegistrationform = () => {

  const validationSchema = Yup.object().shape({
    orgName: Yup.string().required('Organization Name is required'),
    fullName: Yup.string().required('Full Name is required'),

    mobileNumber: Yup.string().required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
    altMobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required')
      .min(8, 'Must be exactly 8 digits'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string().required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits'),
    geoLocation: Yup.string(),
    cityId: Yup.string().required('city is required'),
    localityId: Yup.string().required('locality is required'),
    categoryId: Yup.array().required('category is required'),
    gst: Yup.string().required('GST is required'),
    pan: Yup.string().required()
      .matches(/^[0-9a-zA-Z]+$/)
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
    accName: Yup.string().required('Account Name is required'),
    accNumber: Yup.number().typeError('Account Number must be a number')
      .required('Account Number is required')
    ,
    bankName: Yup.string().required('bankName Number is required'),
    branch: Yup.string().required('branch  is required'),
    ifsc: Yup.string().required()
      .matches(/^[0-9a-zA-Z]+$/)
      .min(11, 'Must be exactly 11 digits')
      .max(11, 'Must be exactly 11 digits'),
    status: Yup.string('true').required('Status is required')
  });
  const [localityList, setLocalityList] = useState([]);
  const[categoryList, setCategoryList]=useState([]);
  const [cityList, setCityList] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const [vendor, setVendor] = useState({
    orgName: '',
    fullName: '',
    mobileNumber: '',
    altMobileNumber: '',
    email:'', 
    password:'',
    address: '',
    pincode: '',
    geoLocation: '',
    cityId: '',
    localityId: '',
    categoryId: [],
    gst: '',
    pan: '',
    accName: '',
    accNumber: '',
    bankName: '',
    branch: '',
    ifsc: '',
    status: true,
  });
  useEffect(() => {
    getCityList();   
   // getLocalityList();
   getCategoryList();
   
  
    
    return () => {
      setCityList([]);
      setLocalityList([]);
     
    };
  }, []);
  const getCityList = () => {
    VendorServices.getAllCity().then((res) => {
      setCityList(res);

    }).catch((err) => {
      setError(err.message);
    });
  }
  
  const getLocalityList = (event) => {
    
    VendorServices.getLocalityByCityId({cityId:event.target.value}).then((res) => {

      setLocalityList(res);

    }).catch((err) => {
      setError(err.message);
    });
  }
  const getCategoryList = () => {
    VendorServices.getAllCategory().then((res) => {

      setCategoryList(res);

    }).catch((err) => {
      // setError(err.message);
    });
  }
  const selectedCate =(selected)=>{

    const cateSelected = selected.map(res=>categoryList.find(catList=>catList._id === res));
    
    return cateSelected.map(result=>result.parent)
    
    }
  const formik = useFormik({
    initialValues: vendor,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
console.log("fsdfsdfsfssd")
      VendorServices.creteVendorRegistration(values).then((res) => {

        notifySuccess('Registered Successfully');
        router.push('/');
          
        })
          .catch((err) => {

            setError(err.message);
          })



    },
  });
  return (
    <Layout title="Vendor Registration" description="This is vendor registration page">
      <PageHeader title="Vendor Registration" />




      <div className="bg-white">
        {/* <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          <div className="grid grid-flow-row lg:grid-cols-2 gap-4 lg:gap-16 items-center">
            */}
        <Container fixed>
        <form onSubmit={formik.handleSubmit} >
          <Grid container spacing={3}>
            <Grid item xs={12}  >
              <h3 className="text-xl lg:text-3xl mb-2 font-serif font-semibold">
                <span style={{ fontSize: '17px', color: 'rgb(16 185 129)' }} >Basic Details:</span>
              </h3>
              
            </Grid>
            
              
            <Grid item xs={12} sm={4} >
              <TextField InputProps={{ style: { width: 370 } }}
                margin="dense"
                id="orgName"
                name="orgName"
                variant="outlined"
                label="Name Of The organization"
                type="Name Of The organization"
                value={formik.values.orgName}
                onChange={formik.handleChange}
                error={formik.touched.orgName && Boolean(formik.errors.orgName)}
                helperText={formik.touched.orgName && formik.errors.orgName}

              />


            </Grid>


            <Grid item xs={12} sm={4}>
              <TextField

                InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="fullName"
                name="fullName"
                label="Full Name "
                type="Full Name "
                variant="outlined"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />


            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="mobileNumber"
                name="mobileNumber"
                label="Mobile Number "
                type="Mobile Number"
                variant="outlined"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="altMobileNumber"
                name="altMobileNumber"
                label="Alternative Mobile Number "
                type="Alternative Mobile Number "
                variant="outlined"
                value={formik.values.altMobileNumber}
                onChange={formik.handleChange}
                error={formik.touched.altMobileNumber && Boolean(formik.errors.altMobileNumber)}
                helperText={formik.touched.altMobileNumber && formik.errors.altMobileNumber}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="Email "
                type="Email "
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="password"
                name="password"
                label="Password "
                type="Password "
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />

            </Grid>



            <Grid item xs={12}  >
              <h3 className="text-xl lg:text-3xl mb-2 font-serif font-semibold">
                <span style={{ fontSize: '17px', color: 'rgb(16 185 129)' }} >Address:</span>
              </h3>
            </Grid>



            <Grid item xs={12} sm={4}>
              <TextField
                InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="address"
                name="address"
                label="Address "
                type="Address"
                variant="outlined"
                value={formik.values.address}

                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />


            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="pincode"
                name="pincode"
                label="PIN Number "
                type="PIN Number"
                variant="outlined"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
  <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="geoLocation"
                  name="geoLocation"
                  label="Geo Location "
                  type="Geo Location "
                  variant="outlined"
                  value={formik.values.geoLocation}
                  onChange={formik.handleChange}
                  error={formik.touched.geoLocation && Boolean(formik.errors.geoLocation)}
                  helperText={formik.touched.geoLocation && formik.errors.geoLocation}
                />
 </Grid>

            <Grid item xs={12} sm={4}>
              <div style={{ width: 370 }}>
                <FormControl variant="standard" fullWidth="true" >
                  <InputLabel id="demo-simple-select-standard-label">City Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="cityId"
                    name="cityId"
                    label="City Name"
                    variant="outlined"
                    value={formik.values.cityId}
                    onChange={e => { formik.handleChange(e); getLocalityList(e) }}

                    error={formik.touched.cityId && Boolean(formik.errors.cityId)}
                    helperText={formik.touched.cityId && formik.errors.cityId}
                  >

                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>


                    {cityList.map(({ _id, cityName }) => (
                  <MenuItem key={_id} value={_id}>{cityName}</MenuItem>
                ))}
                  </Select>
                </FormControl>
              </div>

            </Grid>
            <Grid item xs={12} sm={4}>
              <div style={{ width: 370}}>
                <FormControl variant="standard" fullWidth="true" >
                  <InputLabel id="demo-simple-select-standard-label">Locality</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="localityId"
                    name="localityId"
                    label="Locality"
                    variant="outlined"
                    value={formik.values.localityId}
                    onChange={formik.handleChange}
                    error={formik.touched.localityId && Boolean(formik.errors.localityId)}
                    helperText={formik.touched.localityId && formik.errors.localityId}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>

                    {localityList.map(({ _id, area }) => (
                  <MenuItem key={_id} value={_id}>{area}</MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div style={{ width: 370 }}>

                <FormControl variant="standard" fullWidth="true" >
                  <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="categoryId"
                    variant="outlined"
                    multiple
                    name="categoryId"
                    renderValue={(selected) => selectedCate(selected).join(", ")}
                     MenuProps ={MenuProps }
                    label="Category"
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                    error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                    helperText={formik.touched.categoryId && formik.errors.categoryId}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>

                    {categoryList.map(({ _id, parent }) => (
                  <MenuItem key={_id} value={_id}> {parent}
              </MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </div>

            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="gst"
                name="gst"
                label="GST "
                type="GST "
                variant="outlined"
                value={formik.values.gst}
                onChange={formik.handleChange}
                error={formik.touched.gst && Boolean(formik.errors.gst)}
                helperText={formik.touched.gst && formik.errors.gst}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="pan"
                name="pan"
                label="PAN Number "
                type="PAN Number "
                variant="outlined"
                value={formik.values.pan}
                onChange={formik.handleChange}
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                helperText={formik.touched.pan && formik.errors.pan}
              />

            </Grid>

            <Grid item xs={12} style={{ marginTop: '30px' }}>

              <h3 className="text-xl lg:text-3xl mb-2 font-serif font-semibold">
                <span style={{ fontSize: '17px', color: 'rgb(16 185 129)' }}>Bank Account Detailes:
                </span>
              </h3>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="accName"
                name="accName"
                label="Account Name "
                type="Account Name"
                variant="outlined"
                value={formik.values.accName}
                onChange={formik.handleChange}
                error={formik.touched.accName && Boolean(formik.errors.accName)}
                helperText={formik.touched.accName && formik.errors.accName}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="accNumber"
                name="accNumber"
                label="Account Number "
                type="Account Number"
                variant="outlined"
                value={formik.values.accNumber}
                onChange={formik.handleChange}
                error={formik.touched.accNumber && Boolean(formik.errors.accNumber)}
                helperText={formik.touched.accNumber && formik.errors.accNumber}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="bankName"
                name="bankName"
                label="Bank  Name "
                type="Bank  Name"
                variant="outlined"
                value={formik.values.bankName}
                onChange={formik.handleChange}
                error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                helperText={formik.touched.bankName && formik.errors.bankName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="branch"
                name="branch"
                label="Branch "
                type="Branch"
                variant="outlined"
                value={formik.values.branch}
                onChange={formik.handleChange}
                error={formik.touched.branch && Boolean(formik.errors.branch)}
                helperText={formik.touched.branch && formik.errors.branch}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField InputProps={{ style: { width: 370 } }}
                autoFocus
                margin="dense"
                id="ifsc"
                name="ifsc"
                label="IFSC Code "
                type="IFSC Code"
                variant="outlined"
                value={formik.values.ifsc}
                onChange={formik.handleChange}
                error={formik.touched.ifsc && Boolean(formik.errors.ifsc)}
                helperText={formik.touched.ifsc && formik.errors.ifsc}
              />

            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl variant="standard" fullWidth="true" style={{ width: 370 }}>
                <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  label="Status"
                  variant="outlined"
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                  
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={true}  >Active</MenuItem>
                  <MenuItem value={false}>In Active</MenuItem>

                </Select>
              </FormControl>
            </Grid>
            <div style={{ textAlign: 'right', marginLeft: '1093px',
    marginTop: '37px' }}>
                    <button
                      data-variant="flat"
                      className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-base w-full sm:w-auto"
                   type='submit' >
                      Register
                    </button>
                    </div>
                  
          </Grid>
</form>
        </Container>
        {/* </div>
            </div> */}

      </div>



     



        <div style={{ textAlign: 'right', margin: '29px' }}>
         
        </div>
     


    </Layout>
  );
};

export default VendorRegistrationform;
