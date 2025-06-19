import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backgroundImage from "../../images/main.jpeg";

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    category: '', // Add category field
  });

  const [message, setMessage] = useState('');

  // Handle form data change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form data
  const validate = () => {
    if (!formData.firstName) {
      return 'First Name is required';
    }
    if (!formData.lastName) {
      return 'Last Name is required';
    }
    if (!formData.phoneNumber) {
      return 'Phone Number is required';
    }
    if (!formData.email) {
      return 'Email is required';
    }
    if (!formData.address) {
      return 'Address is required';
    }
    if (!formData.category) {
      return 'Category is required';
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const response = await axios.post('/api/customer/add', formData);
      setMessage('Customer added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        category: '', // Reset category field
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <nav className="w-64 bg-purple-300 text-white h-screen p-6 z-10">
        <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>
        <ul>
          <li className="mb-4">
            <Link to="/main-admin-dashboard" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Main Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/customer/manage" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Manage Customers
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/customer/add" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Customer
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center text-purple-600">
              Add Customer
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-lg font-medium text-purple-600">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-lg font-medium text-purple-600">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-lg font-medium text-purple-600">
                  Phone Number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-purple-600">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-lg font-medium text-purple-600">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-lg font-medium text-purple-600">
                  Category:
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Add Customer
              </button>

              {/* Message */}
              {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
