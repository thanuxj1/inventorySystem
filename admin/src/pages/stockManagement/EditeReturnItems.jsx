import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import backgroundImage from "../../images/main.jpeg";

const EditReturnItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`/api/stock/viewReturn`);
        const data = await response.json();
        const stock = data.find((stock) => stock._id === id);
        if (stock) {
          setStock(stock);
        } else {
          setError("Stock not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/stock/updateReturn/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock),
      });
      const data = await response.json();
      console.log("Update Response:", data);

      if (response.ok) {
        navigate("/view-return-stock"); // Redirect to the view stock page
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
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
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-purple-600">
          Edit Return Item
        </h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={stock?.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Description
              </label>
              <textarea
                name="description"
                value={stock?.description || ""}
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
                value={stock?.quantity || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-purple-600">
                Category
              </label>
              <select
                name="category"
                value={stock?.category || ""}
                onChange={handleChange}
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
              className="bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Update Stock
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default EditReturnItems;
