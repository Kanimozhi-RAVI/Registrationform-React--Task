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

  const validation = Yup.object().shape({
    fullName: Yup.string().required('Enter your name*'),
    email: Yup.string().email('Invalid').required('Enter a valid Email*'),
    age: Yup.number().min(1).required('Enter your age*'),
    dob: Yup.string().required('Enter your DOB*'),
    gender: Yup.string().required('Choose your gender*'),
    address: Yup.string().required('Enter your address*'),
    country: Yup.string().required('Select your country*'),
    state: Yup.string().required('Select your state*'),
    city: Yup.string().required('Select your city*'),
    pincode: Yup.string().required('Pincode is Required*'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${userId || ''}`, {
        method: userId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, age: Number(values.age) }),
      });

      if (!response.ok) throw new Error();

      resetForm();

      toast.success(userId ? 'User updated!' : 'Registered successfully!', {
        autoClose: 2000,
        onClose: () => {
          setLoading(false);
          navigate('/users');
        }
      });

    } catch {
      toast.error('Something went wrong!', {
        autoClose: 2000,
        onClose: () => setLoading(false)
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCountryChange = (e, setFieldValue, handleChange) => {
    handleChange(e);
    const selected = e.target.value;
    const countryData = countries.find(c => c.country === selected);
    setStates(countryData?.states || []);
    setCities([]);
  };

  const handleStateChange = (e, setFieldValue, handleChange) => {
    handleChange(e);
    const selected = e.target.value;
    const stateData = states.find(s => s.state === selected);
    setCities(stateData?.cities || []);
  };

  const handleCityChange = async (e, setFieldValue, setFieldTouched, validateField) => {
    const selectedCity = e.target.value;
    await setFieldValue("city", selectedCity);
    setFieldTouched("city", true);
    await validateField("city");
    const cityData = cities.find(city => city.name === selectedCity);
    await setFieldValue("pincode", cityData?.pincode || '');
  };

  const userdata = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/users');
    }, 1000);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
                validationSchema={validation}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ setFieldValue, isSubmitting, handleChange, setFieldTouched, validateField, values }) => (
                  <Form>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <Field name="fullName" />
                        <ErrorMessage name="fullName" component="div" className="error" />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <Field name="email" type="email" />
                        <ErrorMessage name="email" component="div" className="error" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                          name="dob"
                          type="date"
                          value={values.dob}
                          onChange={(e) => {
                            const dob = e.target.value;
                            setFieldValue('dob', dob);
                            if (dob) {
                              const age = calculateAge(dob);
                              if (!isNaN(age) && age >= 0) {
                                setFieldValue('age', age);
                              } else {
                                setFieldValue('age', '');
                              }
                            } else {
                              setFieldValue('age', '');
                            }
                          }}
                        />
                        <ErrorMessage name="dob" component="div" className="error" />
                      </div>

                      <div className="form-group">
                        <label>Age</label>
                        <Field
                          name="age"
                          type="number"
                          readOnly
                        />
                        <ErrorMessage name="age" component="div" className="error" />
                      </div>
                    </div>

                    <div className="form-group full">
                      <label>Gender</label>
                      <div className="gender-group">
                        <label><Field type="radio" name="gender" value="Male" /> Male</label>
                        <label><Field type="radio" name="gender" value="Female" /> Female</label>
                      </div>
                      <ErrorMessage name="gender" component="div" className="error" />
                    </div>

                    <div className="form-group full">
                      <label>Address</label>
                      <Field as="textarea" name="address" />
                      <ErrorMessage name="address" component="div" className="error" />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Country</label>
                        <Field as="select" name="country" onChange={(e) => handleCountryChange(e, setFieldValue, handleChange)}>
                          <option value="">Select Country</option>
                          {countries.map((c, idx) => (
                            <option key={idx} value={c.country}>{c.country}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="country" component="div" className="error" />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <Field as="select" name="state" onChange={(e) => handleStateChange(e, setFieldValue, handleChange)}>
                          <option value="">Select State</option>
                          {states.map((s, idx) => (
                            <option key={idx} value={s.state}>{s.state}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="state" component="div" className="error" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <Field
                          as="select"
                          name="city"
                          onChange={(e) => handleCityChange(e, setFieldValue, setFieldTouched, validateField)}
                        >
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
                        <ErrorMessage name="pincode" component="div" className="error" />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                      <button type="submit" disabled={isSubmitting} className='button-reg'>
                        {userId ? 'Update' : 'Register'}
                      </button>
                      <button type="button" onClick={userdata} className='show-user'>
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
