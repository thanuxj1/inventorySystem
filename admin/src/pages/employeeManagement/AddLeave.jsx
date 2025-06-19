import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import backgroundImage from "../../images/main.jpeg";

export default function AddLeave() {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const { employeeId } = useParams(); // Get the employeeId from the URL
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/leave/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
        },
        body: JSON.stringify({ ...formData, employeeId }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/employee-manage`);
      } else {
        console.error("Error adding leave:", data.message);
      }
    } catch (error) {
      console.error("Error adding leave:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      {/* Sidebar */}
      <nav className="w-64 bg-purple-300 text-white h-screen p-6 z-10">
        <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>
        <ul>
          <li className="mb-4">
            <Link
              to="/main-admin-dashboard"
              className="block py-2 px-4 rounded-lg hover:bg-purple-400"
            >
              Main Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/employee-manage"
              className="block py-2 px-4 rounded-lg hover:bg-purple-400"
            >
              Manage Employee
            </Link>
          </li>
          
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 pt-20 z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-purple-600 mb-6">
            Add Leave Request
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="leaveType"
                    className="block text-sm font-medium text-purple-600"
                  >
                    Leave Type:
                  </label>
                  <select
                    id="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Sick">Sick</option>
                    <option value="Casual">Casual</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-purple-600"
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-purple-600"
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-purple-600"
                  >
                    Reason:
                  </label>
                  <textarea
                    id="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-1/3 bg-purple-400 text-white px-4 py-2 mt-5 rounded-lg hover:bg-purple-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {loading ? "Submitting..." : "Submit Leave Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
