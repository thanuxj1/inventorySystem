import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../images/logo.png';

import backgroundImage from "../../images/main.jpeg";

const SupplierStockView = () => {
  const [supplierStocks, setSupplierStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const navigate = useNavigate(); // Hook for navigation

  // Fetch supplier stocks when the component mounts
  useEffect(() => {
    const fetchSupplierStocks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/supplier/viewAllSuppStock");
        if (response.data) {
          setSupplierStocks(response.data); // Successfully fetched data
        } else {
          setError("No supplier stock data available");
        }
      } catch (error) {
        setError(`Failed to fetch supplier stocks: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierStocks();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/supplier/deleteSuppStock/${id}`);
      setSupplierStocks((prevStocks) =>
        prevStocks.filter((stock) => stock._id !== id)
      );
    } catch (error) {
      setError(`Failed to delete stock. Error: ${error.message}`);
    }
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 160, 10, 40, 30);
  
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Supplier Stock Report', 14, 25);
  
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);
  
    doc.setDrawColor(0, 102, 204); // Blue line
    doc.line(14, 50, 196, 50); // Horizontal line
  
    autoTable(doc, {
      startY: 60,
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableLineColor: [0, 102, 204],
      tableLineWidth: 0.1,
      head: [["No.", "Supplier ID", "Item Name", "Quantity", "Date"]],
      body: supplierStocks.map((stock, index) => [
        index + 1,
        stock.supplierId, // Changed from stock.id to stock.supplierId
        stock.itname,
        stock.quantity,
        new Date(stock.date).toLocaleDateString(),
      ]),
    });

    doc.save("supplier-stock-list.pdf");
  };

  const filteredStocks = supplierStocks.filter((stock) =>
    stock.itname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-10 text-purple-600">
        Loading supplier stocks...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

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
            <h1 className="text-3xl mb-6 text-center font-semibold text-purple-700">
              Supplier's Stocks List
            </h1>

            {/* Search Filter and Report Button */}
            <div className="mb-10 flex items-center justify-center space-x-4">
              <input
                type="text"
                placeholder="Search by item name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={downloadPdf}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Generate Report
              </button>

              <Link
                to="/add-supp-stock"
                className="border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-100"
              >
                Add New Supplier Stock
              </Link>
            </div>

            {/* Stock Table */}
            {filteredStocks.length === 0 ? (
              <p className="text-center text-gray-500">
                No supplier stock available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                      No.
                    </th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                      Supplier ID
                    </th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                      Item Name
                    </th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                      Quantity
                    </th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                      Date
                    </th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <tr
                      key={stock._id}
                      className="hover:bg-purple-50 transition-colors duration-300"
                    >
                      <td className="border p-2 whitespace-nowrap">{index + 1}</td>
                      <td className="border p-2 whitespace-nowrap">{stock.supplierId?.id}</td> {/* Updated to display supplier ID */}
                      <td className="border p-2 whitespace-nowrap">
                        {stock.itname}
                      </td>
                      <td className="border p-2 whitespace-nowrap">
                        {stock.quantity}
                      </td>
                      <td className="border p-2 whitespace-nowrap">
                        {new Date(stock.date).toLocaleDateString()}
                      </td>
                      <td className="border p-2 whitespace-nowrap text-right">
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => navigate(`/editsuppstock/${stock._id}`)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(stock._id)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
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

export default SupplierStockView;
