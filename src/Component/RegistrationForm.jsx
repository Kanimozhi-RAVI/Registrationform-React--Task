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
  const [errors, setErrors] = useState({});


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
const validateForm = () => {
  const newErrors = {};

  if (formData.fullName.trim() === "") newErrors.fullName = 'Full name is required';
  if (formData.email.trim() === "") newErrors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

  if (formData.age === "") newErrors.age = 'Age is required';
  else if (formData.age < 1) newErrors.age = 'Age must be at least 1';

  if (formData.dob === "") newErrors.dob = 'Date of Birth is required';
  if (formData.gender === "") newErrors.gender = 'Gender is required';
  if (formData.address.trim() === "") newErrors.address = 'Address is required';
  if (formData.country === "") newErrors.country = 'Country is required';
  if (formData.city === "") newErrors.city = 'City is required';
  if (formData.pincode === "") newErrors.pincode = 'Pincode is required';

  return newErrors;
};

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

 const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return; 

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error('Please fill all the detailes');
    return;
  }

  setErrors({});
  setLoading(true); 

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

    setFormData({
      fullName: '', email: '', age: '', dob: '',
      gender: '', address: '', country: '', city: '', pincode: ''
    });

    toast.success(userId ? 'User updated successfully!' : 'Registration successful!');
    setTimeout(() => navigate('/users'), 2000);
  } catch (error) {
    console.error('Error saving data:', error);
    toast.error('Failed to save data. Please try again.');
  } finally {
    setLoading(false); 
  }
};

const showUser= ()=> {
  navigate('/users')
}


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
                    placeholder="Enter your Name"
                  
                  />
                  {errors.fullName && <small className="error">{errors.fullName}</small>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your valid Email"
                  />
                  {errors.email && <small className="error">{errors.email}</small>}         
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
                    placeholder="Enter your Age"
                  />
                  {errors.age && <small className="error">{errors.age}</small>}
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  
                  />
                  {errors.dob && <small className="error">{errors.dob}</small>}
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
                  {errors.gender && <small className="error">{errors.gender}</small>}

                </div>
              </div>

              <div className="form-group full">
                <label>Address: Street</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Eg: 158, West street.."
                />
                {errors.address && <small className="error">{errors.address}</small>}

              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    {countriesData.map((c, idx) => (
                      <option key={idx} value={c.country}>
                        {c.country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <small className="error">{errors.country}</small>}

                </div>
                <div className="form-group">
                  <label>City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">Select City</option>
                    {cities.map((city, idx) => (
                      <option key={idx} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && <small className="error">{errors.city}</small>}

                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    readOnly
                  />
                </div>
              </div>
               <div style={{display:"flex", justifyContent:"space-between"}}>
                <button type="submit" >
                {userId ? 'Update' : 'Register'}
              </button>
              <button type='submit' onClick={showUser} style={{backgroundColor:"indigo"}} >Show user Detailes</button>
               </div>
              
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
