import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import backgroundImage from "../../images/main.jpeg";

export default function UpdatePackage() {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    expireDate: '',
    category: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`/api/package/${packageId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();

        setFormData({
          name: data.name,
          price: data.price,
          description: data.description,
          expireDate: new Date(data.expireDate).toISOString().split('T')[0],
          category: data.category || ''
        });
      } catch (error) {
        setMessage('Error fetching package details');
        console.error('Error fetching package details:', error);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Package name is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      return 'Price must be a positive number';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (!formData.expireDate || new Date(formData.expireDate) <= new Date()) {
      return 'Expiration date must be in the future';
    }
    if (!formData.category) {
      return 'Category must be selected';
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
      const response = await fetch(`/api/package/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Package updated successfully');
        setTimeout(() => {
          navigate('/package-manage');
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while updating the package');
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
            <Link to="/package-manage" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Manage Packages
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-package" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Package
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
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">Update Package</h2>

            {message && <p className="text-center text-red-500 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-600">Package Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-purple-600">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-purple-600">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="expireDate" className="block text-sm font-medium text-purple-600">Expiration Date:</label>
                <input
                  type="date"
                  id="expireDate"
                  name="expireDate"
                  value={formData.expireDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-purple-600">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  <option value="Weddings">Weddings</option>
                  <option value="Engagements">Engagements</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Home Decor">Home Decor</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                Update Package
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
