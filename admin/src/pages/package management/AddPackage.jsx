import { useState } from 'react';
import { Link } from 'react-router-dom';

import backgroundImage from "../../images/main.jpeg";

export default function AddPackage() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    expireDate: '',
    category: '',
  });

  const [message, setMessage] = useState('');

  // Handle form data change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form data
  const validate = () => {
    const namePattern = /^[A-Za-z\s]*$/; // Allows only letters and spaces
    const descriptionPattern = /^[A-Za-z\s]*$/; // Allows only letters and spaces
    const price = parseFloat(formData.price);

    if (!formData.name || !namePattern.test(formData.name)) {
      return 'Package Name must be letters and spaces only';
    }

    if (!formData.description || !descriptionPattern.test(formData.description)) {
      return 'Description must be letters and spaces only';
    }

    if (isNaN(price) || price <= 0) {
      return 'Price must be a positive number';
    }

    if (!formData.expireDate || new Date(formData.expireDate) <= new Date()) {
      return 'Expiration Date must be a valid date in the future';
    }

    if (!formData.category) {
      return 'Category must be selected';
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
      // Check for duplicate package by name and category
      const duplicateCheckResponse = await fetch(`/api/package/check-duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name, category: formData.category }),
      });

      const duplicateCheckData = await duplicateCheckResponse.json();

      if (duplicateCheckData.exists) {
        setMessage('A package with this name already exists in the selected category.');
        return;
      }

      // If no duplicate exists, proceed with adding the package
      const response = await fetch('/api/package/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Package added successfully');
        setFormData({
          name: '',
          price: '',
          description: '',
          expireDate: '',
          category: ''
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while adding the package');
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      expireDate: '',
      category: ''
    });
    setMessage('');
  };

  // Filter input to allow only letters and spaces
  const filterText = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    setFormData({ ...formData, [name]: filteredValue });
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
            <h2 className="text-2xl font-semibold mb-6 text-center text-purple-600">
              Add Package
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Package Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-purple-600"
                >
                  Package Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={filterText}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-lg font-medium text-purple-600"
                >
                  Price:
                </label>
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

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-lg font-medium text-purple-600"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={filterText}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              {/* Expiration Date */}
              <div>
                <label
                  htmlFor="expireDate"
                  className="block text-lg font-medium text-purple-600"
                >
                  Expiration Date:
                </label>
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

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-lg font-medium text-purple-600"
                >
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
                  <option value="Weddings">Weddings</option>
                  <option value="Engagements">Engagements</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Home Decor">Home Decor</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Add Package
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full text-blue-500 underline py-2 mt-4 focus:outline-none"
              >
                Reset Form
              </button>

              {/* Message */}
              {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
