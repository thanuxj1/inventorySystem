import React, { useState } from "react";
import { Link } from "react-router-dom";

import backgroundImage from "../../images/main.jpeg";

const AddStock = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/stock/addStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message);
      } else {
        setSuccess(true);
        setFormData({
          name: "",
          description: "",
          quantity: "",
          category: "",
        });
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quantity: "",
      category: "",
    });
    setError("");
    setSuccess(false);
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
            <Link to="/view-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Manage Stock
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Stock
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/view-return-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Return Stock Manage
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-return-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Return Stock
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/show-notCompleted-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              View Event Items
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h1 className="text-3xl font-semibold mb-6 text-center text-purple-600">
              Add New Stock
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-purple-600">
                  Stock Name
                </label>
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
                <label htmlFor="description" className="block text-lg font-medium text-purple-600">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-lg font-medium text-purple-600">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-lg font-medium text-purple-600">
                  Category
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
                  <option value="Flowers">Fresh Flowers & Greenery</option>
                  <option value="Floral">Floral supplies</option>
                  <option value="Accessories">Accessories & Decoration</option>
                  <option value="Vases">Vases & Containers</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add New Stock"}
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {success && (
                <p className="text-green-500 text-center mt-4">
                  Stock added successfully!
                </p>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="w-full text-blue-500 hover:text-blue-700 py-2 font-semibold "
              >
                Reset Form
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/view-stock" className="text-purple-500 hover:underline">
                View All Stocks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
