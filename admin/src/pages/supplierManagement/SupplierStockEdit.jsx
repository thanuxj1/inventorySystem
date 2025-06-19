import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import backgroundImage from "../../images/main.jpeg";

const SupplierStockEdit = () => {
  const { id } = useParams(); // Stock ID from the URL
  const navigate = useNavigate();
  const [stock, setStock] = useState({
    id: "",
    itname: "",
    quantity: 0,
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`/api/supplier/viewAllSuppStock`);
        const stockData = response.data.find((stock) => stock._id === id);
        if (stockData) {
          setStock(stockData);
        } else {
          setError("Stock not found");
        }
      } catch (error) {
        setError("Failed to fetch stock details");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock({ ...stock, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/supplier/editSuppStock/${id}`, stock);
      navigate("/view-supp-stock"); // Redirect to stock list after updating
    } catch (error) {
      setError("Failed to update stock");
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
            <Link to="/view-supplier" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Manage Suppliers
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-supplier" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Supplier
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/view-supp-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Manage Supplier Stocks
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-supp-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Purchace Order
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/show-all-purchase" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Want to Purchase
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-purple-600">
          Edit Supplier Stock
        </h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Supplier ID
              </label>
              <input
                type="text"
                name="id"
                value={stock.supplierId?.id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Item Name
              </label>
              <input
                type="text"
                name="itname"
                value={stock.itname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={stock.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={new Date(stock.date).toISOString().split("T")[0]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Update Supplier Stock
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default SupplierStockEdit;
