import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';

import countries from '../Countries.json';
import './RegistrationForm.css';
import Loading from './Loading';

const API_URL = 'https://682abf55ab2b5004cb379014.mockapi.io/User';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    fullName: '', email: '', age: '', dob: '',
    gender: '', address: '', country: '',
    state: '', city: '', pincode: '',
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const editUser = JSON.parse(localStorage.getItem('editUser'));
    if (editUser) {
      setUserId(editUser.id);
      setInitialValues(editUser);
      const countryData = countries.find(c => c.country === editUser.country);
      setStates(countryData?.states || []);
      const stateData = countryData?.states.find(s => s.state === editUser.state);
      setCities(stateData?.cities || []);
      localStorage.removeItem('editUser');
    }
  }, []);

  const schema = Yup.object().shape({
    fullName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid').required('Required'),
    age: Yup.number().min(1).required('Required'),
    dob: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    pincode: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/${userId || ''}`,
        {
          method: userId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, age: Number(values.age) }),
        }
      );

      if (!response.ok) throw new Error();

      toast.success(userId ? 'User updated!' : 'Registered successfully!');
      resetForm();

      setTimeout(() => navigate('/users'), 2000);
    } catch {
      toast.error('Something went wrong!');
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCountryChange = (e, setFieldValue) => {
    const selected = e.target.value;
    const countryData = countries.find(c => c.country === selected);
    setStates(countryData?.states || []);
    setCities([]);
    setFieldValue("country", selected);
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("pincode", "");
  };

  const handleStateChange = (e, setFieldValue) => {
    const selected = e.target.value;
    const stateData = states.find(s => s.state === selected);
    setCities(stateData?.cities || []);
    setFieldValue("state", selected);
    setFieldValue("city", "");
    setFieldValue("pincode", "");
  };

  const handleCityChange = (e, setFieldValue) => {
    const selected = e.target.value;
    const cityData = cities.find(c => c.name === selected);
    setFieldValue("city", selected);
    setFieldValue("pincode", cityData?.pincode || '');
  };

  return (
    <>
      {loading && <Loading />}
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
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    {/* Basic Info */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <Field name="fullName" />
                        <ErrorMessage name="fullName" component="small" className="error" />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <Field name="email" type="email" />
                        <ErrorMessage name="email" component="small" className="error" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Age</label>
                        <Field name="age" type="number" />
                        <ErrorMessage name="age" component="small" className="error" />
                      </div>
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <Field name="dob" type="date" />
                        <ErrorMessage name="dob" component="small" className="error" />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="form-row gender-row">
                      <label>Gender</label>
                      <div className="gender-group">
                        <label><Field type="radio" name="gender" value="Male" /> Male</label>
                        <label><Field type="radio" name="gender" value="Female" /> Female</label>
                        <ErrorMessage name="gender" component="small" className="error" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="form-group full">
                      <label>Address</label>
                      <Field as="textarea" name="address" />
                      <ErrorMessage name="address" component="small" className="error" />
                    </div>

                    {/* Location Dropdowns */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Country</label>
                        <Field as="select" name="country" onChange={(e) => handleCountryChange(e, setFieldValue)}>
                          <option value="">Select Country</option>
                          {countries.map((c, idx) => (
                            <option key={idx} value={c.country}>{c.country}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="country" component="small" className="error" />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <Field as="select" name="state" onChange={(e) => handleStateChange(e, setFieldValue)}>
                          <option value="">Select State</option>
                          {states.map((s, idx) => (
                            <option key={idx} value={s.state}>{s.state}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="state" component="small" className="error" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <Field as="select" name="city" onChange={(e) => handleCityChange(e, setFieldValue)}>
                          <option value="">Select City</option>
                          {cities.map((c, idx) => (
                            <option key={idx} value={c.name}>{c.name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="city" component="small" className="error" />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <Field name="pincode" readOnly />
                        <ErrorMessage name="pincode" component="small" className="error" />
                      </div>
                    </div>

                    {/* Submit */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <button type="submit" disabled={isSubmitting}>
                        {userId ? 'Update' : 'Register'}
                      </button>
                      <button type="button" onClick={() => navigate('/users')} className='show-user'>
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
    </>
  );
};

export default RegistrationForm;
