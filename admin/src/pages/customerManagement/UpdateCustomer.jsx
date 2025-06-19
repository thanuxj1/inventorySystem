import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import backgroundImage from "../../images/main.jpeg";

export default function UpdateCustomer() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    category: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`/api/customer/${customerId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();

        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.phonetNumber,
          address: data.address,
          category: data.category,
        });
      } catch (error) {
        setMessage('Error fetching customer details');
        console.error('Error fetching customer details:', error);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      return 'A valid email is required';
    }
    if (!formData.contactNumber.trim()) {
      return 'Contact number is required';
    }
    if (!formData.address.trim()) {
      return 'Address is required';
    }
    if (!formData.category.trim()) {
      return 'Categary is required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const response = await fetch(`/api/customer/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Customer updated successfully');
        setTimeout(() => {
          navigate('/customer/manage');
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while updating the customer');
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
          <li className="mb-4">
            <Link to="/show-notCompleted" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Items
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">Update Customer</h2>

            {message && <p className="text-center text-red-500 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-purple-600">First Name:</label>
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
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-purple-600">Last Name:</label>
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
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-600">Email:</label>
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
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-purple-600">Contact Number:</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-purple-600">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                </div>
                <div>
                <label htmlFor="categary" className="block text-sm font-medium text-purple-600">Categary:</label>
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
              <button
                type="submit"
                className="w-full bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                Update Customer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
