import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import backgroundImage from "../../images/main.jpeg";

export default function UpdateEmployee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    contactNumber: '',
    email: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`/api/employee/${employeeId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();

        setFormData({
          name: data.name,
          position: data.position,
          department: data.department || '',
          contactNumber: data.contactNumber,
          email: data.email,
        });
      } catch (error) {
        setMessage('Error fetching employee details');
        console.error('Error fetching employee details:', error);
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Employee name is required';
    if (!formData.position.trim()) return 'Position is required';
    if (!formData.department) return 'Department must be selected';
    if (!formData.contactNumber.trim()) return 'Contact number is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Valid email is required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const response = await fetch(`/api/employee/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Employee updated successfully');
        setTimeout(() => navigate('/employee-manage'), 1000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while updating the employee');
    }
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
            <Link to="/employee-manage" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Manage Employees
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-employee" className="block py-2 px-4 rounded-lg hover:bg-purple-500">
              Add Employee
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">Update Employee</h2>

            {message && <p className="text-center text-red-500 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-600">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-purple-600">Position:</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-purple-600">Department:</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a department</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-purple-600">Contact Number:</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-600">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                Update Employee
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
