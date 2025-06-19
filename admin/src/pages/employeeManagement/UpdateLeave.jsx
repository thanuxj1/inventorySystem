import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import backgroundImage from "../../images/main.jpeg";

export default function UpdateLeave() {
  const { leaveId } = useParams(); // Get leaveId from the URL
  const navigate = useNavigate();

  const [leaveData, setLeaveData] = useState(null); // Initialized as null to handle loading state
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [loading, setLoading] = useState(true); // Loading state
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    // Fetch leave details by leaveId
    fetch(`/api/leave/leaveBy/${leaveId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching leave data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setFormData({
          leaveType: data.leaveType || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().substring(0, 10) : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().substring(0, 10) : '',
          reason: data.reason || '',
        });
        setEmployeeId(data.employeeId); // Assuming employeeId is part of the leave data
      })
      .catch((err) => console.error("Error fetching leave data:", err))
      .finally(() => setLoading(false)); // Set loading to false after fetching

  }, [leaveId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`/api/leave/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Error updating leave data: ${response.statusText}`);
      }
      await response.json();
      navigate(`/employees/update/${employeeId}`); // Navigate back to employee management after updating
    } catch (error) {
      console.error(error);
      alert("Failed to update leave data.");
    }
  };

  if (loading) {
    return <div className="text-center text-purple-600 text-lg">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      {/* Sidebar */}
      <nav className="w-64 bg-purple-300 text-white h-auto p-6 z-10">
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
      <div className="flex-1 z-10">
        <div className="flex flex-col items-center min-h-screen pt-10">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-center text-purple-600 text-3xl font-bold mb-6">Update Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-purple-600 mb-2">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
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
            <label className="block text-sm font-semibold text-purple-600 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-600 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-600 mb-2">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
            />
          </div>
          <div className='flex justify-center'>
          <button
            type="submit"
            className="w-1/3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Update Leave
          </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
  );
}
