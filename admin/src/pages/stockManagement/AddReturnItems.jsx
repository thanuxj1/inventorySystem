import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import backgroundImage from "../../images/main.jpeg";

const AddReturnItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
    supplierId: "", // Add supplierId to the formData state
  });

  const [suppliers, setSuppliers] = useState([]); // State to hold supplier data
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/supplier/getAllSupp"); // Update with your API endpoint for suppliers
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setSuppliers(data); // Set the fetched suppliers
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSuppliers();
  }, []);

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
      const response = await fetch("/api/stock/addReturn", {
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
          supplierId: "", // Reset supplierId on success
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
      supplierId: "",
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
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl my-3">
            <h1 className="text-3xl font-semibold mb-6 text-center text-purple-600">
              Add Return Item
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-purple-600">
                  Item Name
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
              <div>
                <label htmlFor="supplierId" className="block text-lg font-medium text-purple-600">
                  Supplier
                </label>
                <select
                  id="supplierId"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name} {/* Assuming supplier has a name field */}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Return Items"}
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {success && (
                <p className="text-green-500 text-center mt-4">
                  Return Item added successfully!
                </p>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="w-full text-blue-500 hover:text-blue-700 py-2 font-semibold"
              >
                Reset Form
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/view-return-stock"
                className="text-purple-500 hover:underline"
              >
                View Return Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReturnItems;
