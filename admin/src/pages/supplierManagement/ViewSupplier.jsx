import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../images/logo.png';

import backgroundImage from "../../images/main.jpeg";

const ViewSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("/api/supplier/getAllSupp");
        setSuppliers(response.data);
      } catch (error) {
        setError("Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`/api/supplier/deleteSupp/${id}`);
        setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
      } catch (error) {
        setError("Failed to delete supplier");
      }
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 160, 10, 40, 30);
  
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Supplier Stock Report', 14, 25);
  
    // Add contact details
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);
  
    // Draw a line under the header
    doc.setDrawColor(0, 102, 204); // Blue line
    doc.line(14, 50, 196, 50); // Horizontal line
  
    // Add table with custom styles
    autoTable(doc, {
      startY: 60, // Start after the title and line
      headStyles: {
        fillColor: [0, 102, 204], // Blue header background
        textColor: [255, 255, 255], // White text for header
        fontSize: 12,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
      tableLineColor: [0, 102, 204], // Blue table borders
      tableLineWidth: 0.1,
      head: [["No.", "Name", "ID", "Date", "Address", "Email", "Contact"]],
      body: filteredSuppliers.map((supplier, index) => [
        index + 1, // Row number
        supplier.name,
        supplier.id,
        new Date(supplier.date).toLocaleDateString(),
        supplier.address,
        supplier.email,
        supplier.contact,
      ]),
    });

    doc.save("supplier-list.pdf");
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
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-purple-700">
          Suppliers List
        </h1>

        {/* Search Filter */}
        <div className="mb-10 justify-center flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by supplier name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 "
          />

          <button
            onClick={downloadPdf}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Generate Report
          </button>

          <Link
            to="/add-supplier"
            className="border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-100"
          >
            Add New Supplier
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-purple-600 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : filteredSuppliers.length === 0 ? (
          <p className="text-center">No suppliers available.</p>
        ) : (
          <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
              <tr>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  #
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  Name
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  ID
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  Date
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  Address
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  Email
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  Contact
                </th>
                <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier, index) => (
                <tr
                  key={supplier._id}
                  className="hover:bg-purple-50 transition-colors duration-300"
                >
                  <td className="border p-2 whitespace-nowrap">{index + 1}</td>
                  <td className="border p-2 whitespace-nowrap">
                    {supplier.name}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {supplier.id}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {new Date(supplier.date).toLocaleDateString()}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {supplier.address}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {supplier.email}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {supplier.contact}
                  </td>
                  <td className="border p-2 whitespace-nowrap text-right">
                    <div className="flex space-x-2 justify-center">
                      <Link
                        to={`/edit-supplier/${supplier._id}`}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-20 text-center"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default ViewSupplier;
