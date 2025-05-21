import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import countries from '../Countries.json';
import './RegistrationForm.css';

const API_URL = 'https://682abf55ab2b5004cb379014.mockapi.io/User';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [countriesData, setCountriesData] = useState([]);
  const [cities, setCities] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setCountriesData(countries);

    const editUser = JSON.parse(localStorage.getItem('editUser'));
    if (editUser) {
      setUserId(editUser.id || null);

      const countryData = countries.find(c => c.country === editUser.country);
      if (countryData) setCities(countryData.cities);

      localStorage.removeItem('editUser');
    }
  }, []);

  const Schema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    age: Yup.number().min(1, 'Age must be at least 1').required('Age is required'),
    dob: Yup.string().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string().required('Pincode is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const dataToSend = { ...values, age: Number(values.age) };

    try {
      const response = userId
        ? await fetch(`${API_URL}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          })
        : await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          });

      if (!response.ok) throw new Error('Failed to save data');

      toast.success(userId ? 'User updated successfully!' : 'Registration successful!');
      resetForm();
      setTimeout(() => navigate('/users'), 2000);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showUser = () => navigate('/users');

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-left">
          <div className="welcome-content">
            <div className="logo">🚀</div>
            <h2>Welcome</h2>
            <p>You are 30 seconds away from earning your own money!</p>
          </div>
        </div>

        <div className="register-right">
          <div className="register-form">
            <h2>{userId ? 'Update User' : 'Registration Form'}</h2>

            <Formik
              initialValues={{
                fullName: '',
                email: '',
                age: '',
                dob: '',
                gender: '',
                address: '',
                country: '',
                city: '',
                pincode: '',
              }}
              validationSchema={Schema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <Field name="fullName" placeholder="Enter your Name" />
                      <ErrorMessage name="fullName" component="small" className="error" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <Field name="email" type="email" placeholder="Enter your valid Email" />
                      <ErrorMessage name="email" component="small" className="error" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Age</label>
                      <Field name="age" type="number" placeholder="Enter your Age" />
                      <ErrorMessage name="age" component="small" className="error" />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <Field name="dob" type="date" />
                      <ErrorMessage name="dob" component="small" className="error" />
                    </div>
                  </div>

                  <div className="form-row gender-row">
                    <label>Gender</label>
                    <div className="gender-group">
                      <label>
                        <Field type="radio" name="gender" value="Male" />
                        Male
                      </label>
                      <label>
                        <Field type="radio" name="gender" value="Female" />
                        Female
                      </label>
                      <ErrorMessage name="gender" component="small" className="error" />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Address</label>
                    <Field as="textarea" name="address" placeholder="Eg: 158, West street.." />
                    <ErrorMessage name="address" component="small" className="error" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Country</label>
                      <Field
                        as="select"
                        name="country"
                        onChange={(e) => {
                          const selectedCountry = e.target.value;
                          const countryData = countries.find(c => c.country === selectedCountry);
                          setCities(countryData ? countryData.cities : []);
                          setFieldValue("country", selectedCountry);
                          setFieldValue("city", "");
                          setFieldValue("pincode", "");
                        }}
                      >
                        <option value="">Select Country</option>
                        {countriesData.map((c, idx) => (
                          <option key={idx} value={c.country}>{c.country}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="country" component="small" className="error" />
                    </div>

                    <div className="form-group">
                      <label>City</label>
                      <Field
                        as="select"
                        name="city"
                        onChange={(e) => {
                          const selectedCity = e.target.value;
                          const cityData = cities.find(c => c.name === selectedCity);
                          setFieldValue("city", selectedCity);
                          setFieldValue("pincode", cityData?.pincode || '');
                        }}
                      >
                        <option value="">Select City</option>
                        {cities.map((city, idx) => (
                          <option key={idx} value={city.name}>{city.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="city" component="small" className="error" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Pincode</label>
                      <Field name="pincode" readOnly />
                      <ErrorMessage name="pincode" component="small" className="error" />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="submit" disabled={isSubmitting}>
                      {userId ? 'Update' : 'Register'}
                    </button>
                    <button type="button" onClick={showUser} className='show-user' >
                      Show User Details
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
