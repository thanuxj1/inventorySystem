import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../images/logo.png';

import backgroundImage from "../../images/main.jpeg";

const ViewStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [purchasePopup, setPurchasePopup] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const categories = ["All", "Flowers", "Floral", "Accessories", "Vases"];

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/stock/getAll");
        const data = await response.json();
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          setError("Unexpected response format for stocks");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchStocks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/stock/deleteStock/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setStocks((prevStocks) => prevStocks.filter((stock) => stock._id !== id));
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

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearchQuery = stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || stock.category === selectedCategory;
    return matchesSearchQuery && matchesCategory;
  });

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 160, 10, 40, 30);
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Product List Report', 14, 25);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);
    doc.setDrawColor(0, 102, 204);
    doc.line(14, 50, 196, 50);

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
      head: [["Name", "Description", "Quantity", "Category"]],
      body: filteredStocks.map(stock => [
        stock.name,
        stock.description,
        stock.quantity,
        stock.category,
      ]),
    });

    doc.save("stock-list.pdf");
  };

  const handlePurchase = (stock) => {
    setSelectedStock(stock);
    setPurchaseQuantity(1); // Reset quantity input
    setPurchasePopup(true); // Show popup
  };

  const handlePurchaseSubmit = async () => {
    if (!selectedStock) return; // Check if a stock is selected
    const purchaseData = {
      stockId: selectedStock._id,
      quantity: purchaseQuantity,
    };

    try {
      const response = await fetch("/api/purchace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Purchased ${purchaseQuantity} of ${selectedStock.name}`, data);
        setPurchasePopup(false); // Close the popup
      } else {
        setError(data.message); // Handle errors
      }
    } catch (error) {
      setError(error.message); // Handle fetch errors
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
            <Link to="/main-admin-dashboard" className="block py-2 px-4 rounded-lg hover:bg-purple-500">Main Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/view-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">Manage Stock</Link>
          </li>
          <li className="mb-4">
            <Link to="/add-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">Add Stock</Link>
          </li>
          <li className="mb-4">
            <Link to="/view-return-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">Return Stock Manage</Link>
          </li>
          <li className="mb-4">
            <Link to="/add-return-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">Add Return Stock</Link>
          </li>
          <li className="mb-4">
            <Link to="/show-notCompleted-stock" className="block py-2 px-4 rounded-lg hover:bg-purple-500">View Event Items</Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center min-h-screen pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h1 className="text-3xl font-semibold mb-6 text-center text-purple-600">View All Stocks</h1>

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
                      ? "Floral supplies"
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
                to="/add-stock"
                className="border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-100"
              >
                Add New Stock
              </Link>
            </div>

            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : filteredStocks.length === 0 ? (
              <p className="text-center">No stocks available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">#</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/4">Name</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/4">Description</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock, index) => (
                      <tr key={stock._id} className="border-b">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{stock.name}</td>
                        <td className="border p-2">{stock.description}</td>
                        <td className="border p-2">{stock.quantity}</td>
                        <td className="border p-2">{stock.category}</td>
                        <td className="border p-2 flex space-x-2">
                          <Link to={`/edit-stock/${stock._id}`} className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600">Edit</Link>
                          <button
                          onClick={() => handlePurchase(stock)}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        >
                          Purchase
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id)}
                          className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
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

         {/* Purchase Popup */}
         {purchasePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl mb-4">Purchase {selectedStock?.name}</h2>
                <div className="mb-4">
                  <label className="block mb-2">Quantity</label>
                  <input
                    type="number"
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded w-full"
                  />
                </div>
                <button
                  onClick={handlePurchaseSubmit}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Confirm Purchase
                </button>
                <button
                  onClick={() => setPurchasePopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ViewStock;
