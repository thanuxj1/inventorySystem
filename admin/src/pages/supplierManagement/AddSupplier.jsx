import React, { useState } from "react";
import { Link } from "react-router-dom";

import backgroundImage from "../../images/main.jpeg";

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    name: "",
    id: "",
    date: "",
    address: "",
    email: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for the 'name' field to allow only alphabetic characters and spaces
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      setError("Name can only contain letters and spaces.");
      return;
    }

    // Validation for the 'contact' field to allow only numeric values
    if (name === "contact" && !/^\d*$/.test(value)) {
      setError("Contact number can only contain digits.");
      return;
    }

    // Clear the error if input is valid
    setError("");

    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/supplier/addSupp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
      });
      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || "An error occurred");
      } else {
        setSuccess(true);
        setSupplier({
          name: "",
          id: "",
          date: "",
          address: "",
          email: "",
          contact: "",
        });
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSupplier({
      name: "",
      id: "",
      date: "",
      address: "",
      email: "",
      contact: "",
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
          Add New Supplier
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left side */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-purple-600"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={supplier.name}
                onChange={handleChange}
                required
                pattern="[A-Za-z\s]*"
                title="Name can only contain letters and spaces"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="id"
                className="block text-lg font-medium text-purple-600"
              >
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={supplier.id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-lg font-medium text-purple-600"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={supplier.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-lg font-medium text-purple-600"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={supplier.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-purple-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={supplier.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-lg font-medium text-purple-600"
              >
                Contact
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={supplier.contact}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Contact number can only contain digits"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add New Supplier"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 col-span-1 md:col-span-2">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center mt-4">
            Supplier added successfully!
          </p>
        )}

        <div className="justify-center mt-7">
          <button
            type="button"
            onClick={resetForm}
            className="w-full justify-center text-blue-500 hover:text-blue-700 py-2 font-semibold"
          >
            Reset Form
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/view-supplier" className="text-purple-500 hover:underline">
            View All Supplier
          </Link>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AddSupplier;
