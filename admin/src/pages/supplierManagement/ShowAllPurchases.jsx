import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link } from "react-router-dom";

import backgroundImage from "../../images/main.jpeg";

const ShowAllPurchaces = () => {
  const [purchaces, setPurchaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaces = async () => {
      try {
        const response = await axios.get('/api/purchace'); // Adjusted endpoint
        setPurchaces(response.data);
      } catch (err) {
        setError('Error fetching purchace data');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaces();
  }, []);

  const handleUpdateStatus = async (id) => {
    try {
      // Call the API to update the purchase status
      const response = await axios.put('/api/purchace', { purchaseId: id }); // Pass purchaseId in the body
      // Update the local state with the new status
      setPurchaces((prev) =>
        prev.map((purchace) =>
          purchace._id === id ? { ...purchace, status: response.data.status } : purchace
        )
      );
    } catch (err) {
      setError('Error updating purchace status');
    }
  };

  if (loading) return <p>Loading purchaces...</p>;
  if (error) return <p>{error}</p>;

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
      <h1 className="text-3xl mb-6 text-center font-semibold text-purple-700">All Purchaces</h1>
      {purchaces.length === 0 ? (
        <p>No purchaces found.</p>
      ) : (
        <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
            <tr>
              <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">Stock ID</th>
              <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">Quantity</th>
              <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">Status</th>
              <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">Purchase Date</th>
              <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {purchaces.map((purchace) => (
              <tr key={purchace._id} className="hover:bg-purple-50 transition-colors duration-300">
                <td className="border p-2 whitespace-nowrap">
                  {purchace.stockId.name || purchace.stockId} {/* Adjust as needed */}
                </td>
                <td className="border p-2 whitespace-nowrap">{purchace.quantity}</td>
                <td className="border p-2 whitespace-nowrap">{purchace.status}</td>
                <td className="border p-2 whitespace-nowrap">
                  {new Date(purchace.purchaseDate).toLocaleDateString()}
                </td>
                <td className="border p-2 whitespace-nowrap">
                  <button
                    onClick={() => handleUpdateStatus(purchace._id)}
                    className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Update Status
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

export default ShowAllPurchaces;
