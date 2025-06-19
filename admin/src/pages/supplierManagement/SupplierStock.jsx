import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import backgroundImage from "../../images/main.jpeg";

const SupplierStock = () => {
  const [stock, setStock] = useState({
    itname: "",
    quantity: "",
    date: "",
    supplierId: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("/api/supplier/getAllSupp");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError({ global: "Failed to load suppliers." });
      }
    };

    fetchSuppliers();
  }, []);

  const validate = (name, value) => {
    let errors = {};

    if (name === "itname") {
      const nameRegex = /^[A-Za-z0-9 _&-]+$/;
      if (!nameRegex.test(value)) {
        errors.itname = "Item name can only contain letters, numbers, spaces, and _ , - , &.";
      }
    }

    if (name === "date") {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate <= today) {
        errors.date = "Date must be a future date.";
      }
    }

    if (name === "quantity") {
      if (!value || value <= 0) {
        errors.quantity = "Quantity must be a positive number.";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update stock state
    setStock((prevStock) => ({
      ...prevStock,
      [name]: value,
    }));

    // Validate the field during typing
    const newError = validate(name, value);
    setError((prevError) => ({
      ...prevError,
      ...newError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    // Check for any validation errors
    const itnameError = validate("itname", stock.itname).itname;
    const dateError = validate("date", stock.date).date;
    const quantityError = validate("quantity", stock.quantity).quantity;

    if (itnameError || dateError || quantityError) {
      setError({ itname: itnameError, date: dateError, quantity: quantityError });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/supplier/addSuppStock", stock);
      setSuccess(true);
      resetForm();
    } catch (error) {
      console.error("Error adding stock:", error);
      setError({ global: "Failed to add stock." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStock({
      itname: "",
      quantity: "",
      date: "",
      supplierId: "",
    });
    setSuccess(false);
    setError({});
  };

  return (
    <div className="flex min-h-screen relative">
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
              Purchase Order
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
            <h1 className="text-2xl font-bold text-purple-700">Add Stock</h1>
            <div className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Supplier ID Dropdown */}
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-purple-700 mb-1">
                    Select Supplier
                  </label>
                  <select
                    name="supplierId"
                    value={stock.supplierId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" disabled>Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name} (ID: {supplier.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item Name */}
                <div>
                  <label htmlFor="itname" className="block text-sm font-medium text-purple-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itname"
                    value={stock.itname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {error.itname && <p className="text-red-600">{error.itname}</p>}
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-purple-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={stock.quantity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {error.quantity && <p className="text-red-600">{error.quantity}</p>}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-purple-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={stock.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {error.date && <p className="text-red-600">{error.date}</p>}
                </div>

                {/* Error and Success Messages */}
                {error.global && <p className="text-red-600">{error.global}</p>}
                {success && <p className="text-green-600">Stock added successfully!</p>}

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>

              <button
                onClick={resetForm}
                className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierStock;
