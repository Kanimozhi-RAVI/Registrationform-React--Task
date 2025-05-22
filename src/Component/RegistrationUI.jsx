//
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const RegistrationUI = ({
  initialValues,
  validation,
  handleSubmit,
  countries,
  states,
  cities,
  handleCountryChange,
  handleStateChange,
  handleCityChange,
  navigate,
  userId,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validation}
    onSubmit={handleSubmit}
    enableReinitialize
  >
    {({ setFieldValue, isSubmitting }) => (
      <Form>
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

        <div className="form-row gender-row">
          <label>Gender</label>
          <div className="gender-group">
            <label><Field type="radio" name="gender" value="Male" /> Male</label>
            <label><Field type="radio" name="gender" value="Female" /> Female</label>
            <ErrorMessage name="gender" component="small" className="error" />
          </div>
        </div>

        <div className="form-group full">
          <label>Address</label>
          <Field as="textarea" name="address" />
          <ErrorMessage name="address" component="small" className="error" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Country</label>
            <Field as="select" name="country" onChange={(e) => handleCountryChange(e, setFieldValue)}>
              <option value="">Select Country</option>
              {countries.map((c, i) => (
                <option key={i} value={c.country}>{c.country}</option>
              ))}
            </Field>
            <ErrorMessage name="country" component="small" className="error" />
          </div>
          <div className="form-group">
            <label>State</label>
            <Field as="select" name="state" onChange={(e) => handleStateChange(e, setFieldValue)}>
              <option value="">Select State</option>
              {states.map((s, i) => (
                <option key={i} value={s.state}>{s.state}</option>
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
              {cities.map((c, i) => (
                <option key={i} value={c.name}>{c.name}</option>
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
);

export default RegistrationUI;
