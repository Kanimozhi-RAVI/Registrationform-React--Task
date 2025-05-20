import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import countries from '../Countries.json';
import './RegistrationForm.css';

const API_URL = 'https://682abf55ab2b5004cb379014.mockapi.io/User';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [countriesData, setCountriesData] = useState([]);
  const [cities, setCities] = useState([]);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    dob: '',
    gender: '',
    address: '',
    country: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    setCountriesData(countries);

    const editUser = JSON.parse(localStorage.getItem('editUser'));
    if (editUser) {
      setFormData(editUser);
      setUserId(editUser.id || null);

      const countryData = countries.find(c => c.country === editUser.country);
      if (countryData) setCities(countryData.cities);

      localStorage.removeItem('editUser');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'country') {
      const countryData = countries.find(c => c.country === value);
      setCities(countryData ? countryData.cities : []);
      setFormData({ ...formData, country: value, city: '', pincode: '' });
    } else if (name === 'city') {
      const cityData = cities.find(c => c.name === value);
      setFormData({ ...formData, city: value, pincode: cityData?.pincode || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFieldsFilled = Object.values(formData).every(val => val !== '');
    if (!allFieldsFilled) {
      toast.error('Please fill all fields.');
      return;
    }

    const dataToSend = {
      ...formData,
      age: Number(formData.age),
    };

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
      setTimeout(() => navigate('/users'), 2000);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

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
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your Name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your valid Email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="Enter your Age"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row gender-row">
                <label>Gender</label>
                <div className="gender-group">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="form-group full">
                <label>Address: Street</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Eg: 158, West street.."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countriesData.map((c, idx) => (
                      <option key={idx} value={c.country}>
                        {c.country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city, idx) => (
                      <option key={idx} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    readOnly
                    required
                  />
                </div>
              </div>

              <button type="submit" className=''>
                {userId ? 'Update' : 'Register'}
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
