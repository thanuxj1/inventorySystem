import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../images/logo.png';

import backgroundImage from "../../images/main.jpeg";

const ViewReturnItems = () => {
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search input
  const [selectedCategory, setSelectedCategory] = useState("All"); // Set default to "All"

  // Updated categories based on your new options
  const categories = ["All", "Flowers", "Floral", "Accessories", "Vases"];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/supplier/getAllSupp");
        const data = await response.json();
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          setError("Unexpected response format for suppliers");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/stock/viewReturn");
        const data = await response.json();
        console.log("Response Data:", data);

        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
    fetchStocks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/stock/deleteReturn/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Delete Response:", data);

      if (response.ok) {
        setStocks(stocks.filter((stock) => stock._id !== id));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Function to filter stocks by search query and selected category
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearchQuery = stock.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || stock.category === selectedCategory;

    return matchesSearchQuery && matchesCategory;
  });

  // New function to calculate category counts
  const getCategoryCounts = () => {
    return stocks.reduce((acc, stock) => {
      acc[stock.category] = (acc[stock.category] || 0) + 1;
      return acc;
    }, {});
  };

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Add logo at the top
    doc.addImage(logo, 'PNG', 160, 10, 40, 30);

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Return List Report', 14, 25);

    // Add contact info
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);

    // Draw line
    doc.setDrawColor(0, 102, 204);
    doc.line(14, 50, 196, 50);

    // Add table
    doc.autoTable({
        startY: 60,
        headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        tableLineColor: [0, 102, 204],
        tableLineWidth: 0.1,
        head: [["Name", "Description", "Quantity", "Category", "Supplier Email"]],
        body: filteredStocks.map((stock) => [
            stock.name,
            stock.description,
            stock.quantity,
            stock.category,
            stock.supplierEmail,
        ]),
    });

    // Add page footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 180, 290); // Footer right-aligned
    }

    // Save the PDF
    doc.save("return-list.pdf");
};

  // Get category counts
  const categoryCounts = getCategoryCounts();

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
        <div className="flex flex-col items-center min-h-screen  pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h1 className="text-3xl font-semibold mb-6 text-center text-purple-600">
              View All Return Items
            </h1>

            {/* Search and Category Filters */}
            <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by stock name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === "Flowers"
                      ? "Fresh Flowers & Greenery"
                      : category === "Floral"
                      ? "Floral Supplies"
                      : category === "Accessories"
                      ? "Accessories & Decoration"
                      : category === "Vases"
                      ? "Vases & Containers"
                      : "All"}
                  </option>
                ))}
              </select>

              <button
                onClick={downloadPdf}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Generate Report
              </button>

              <Link
                to="/add-return-stock"
                className="border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-100"
              >
                Add New Return Item
              </Link>
            </div>

            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : filteredStocks.length === 0 ? (
              <p className="text-center">No return items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Supplier Email</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStocks.map((stock) => (
                    <tr key={stock._id}>
                      <td className="px-4 py-2">{stock.name}</td>
                      <td className="px-4 py-2">{stock.description}</td>
                      <td className="px-4 py-2">{stock.quantity}</td>
                      <td className="px-4 py-2">{stock.category}</td>
                      <td className="border p-2">
                          {suppliers.find(supplier => supplier._id === stock.supplierId)?.email || 'N/A'}
                        </td>
                      <td className="px-4 py-2">
                        <Link to={`/edite-return-stock/${stock._id}`} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mx-2">Update</Link>
                        <button
                          onClick={() => handleDelete(stock._id)}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        >
                          Delete
                        </button>
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

export default ViewReturnItems;
