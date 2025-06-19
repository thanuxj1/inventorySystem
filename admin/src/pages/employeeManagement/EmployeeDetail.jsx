import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For generating tables in PDFs

import logo from "../../images/logo.png";
import backgroundImage from "../../images/main.jpeg";

export default function EmployeeDetail() {
  const { employeeId } = useParams(); // Get employeeId from URL
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    position: "",
    salary: 0,
  });

  const [leaveData, setLeaveData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    salary: 0,
    othours: 0,
    otrate: 0,
    mobile: "",
  });

  useEffect(() => {
    // Fetch employee details
    fetch(`/api/employee/${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployeeData(data);
        setFormData({
          name: data.name,
          email: data.email,
          position: data.position || "",
          salary: data.salary || 0,
          othours: data.othours || 0,
          otrate: data.otrate || 0,
          mobile: data.mobile || "",
        });
      })
      .catch((err) => console.error("Error fetching employee data:", err));

    // Fetch leave details for this employee
    fetch(`/api/leave/${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaveData(data);
      })
      .catch((err) => console.error("Error fetching leave data:", err));
  }, [employeeId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Save the OT hours and OT rate along with the rest of the employee data
    const updatedFormData = {
      name: formData.name,
      email: formData.email,
      position: formData.position,
      salary: formData.salary,
      othours: formData.othours,
      otrate: formData.otrate,
      mobile: formData.mobile,
    };

    fetch(`/api/employee/${employeeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployeeData(data);
        navigate("/employee-manage"); // Navigate back to employee list after update
      })
      .catch((err) => console.error("Error updating employee data:", err));
  };

  const handleLeaveUpdate = (leaveId) => {
    navigate(`/leaves/update/${leaveId}`);
  };

  const handleDeleteLeave = (leaveId) => {
    if (window.confirm("Are you sure you want to delete this leave?")) {
      fetch(`/api/leave/${leaveId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          // Remove the deleted leave from the leaveData state
          setLeaveData(leaveData.filter((leave) => leave._id !== leaveId));
        })
        .catch((err) => console.error("Error deleting leave:", err));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add logo
    doc.addImage(logo, 'PNG', 160, 10, 40, 30);
  
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0); // Black for the title
    doc.text('Employee Leave Report', 14, 25);
  
    // Add contact details
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);
  
    // Draw a horizontal line under the header
    doc.setDrawColor(0, 102, 204); // Blue line
    doc.line(14, 50, 196, 50); // Horizontal line
  
    // Table columns and data
    const tableColumn = ["Leave Type", "Start Date", "End Date", "Reason"];
    const tableRows = leaveData.map((leave) => [
      leave.leaveType,
      new Date(leave.startDate).toLocaleDateString(),
      new Date(leave.endDate).toLocaleDateString(),
      leave.reason,
    ]);
  
    // Add table with custom styles
    doc.autoTable({
      startY: 60, // Start after the title and line
      head: [tableColumn],
      body: tableRows,
      headStyles: {
        fillColor: [0, 102, 204], // Blue header background
        textColor: [255, 255, 255], // White text for header
        fontSize: 12,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
      tableLineColor: [0, 102, 204], // Blue table borders
      tableLineWidth: 0.1,
    });
  
    // Add page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${totalPages}`, 200 - 20, 287, null, null, "right");
    }
  
    // Save the PDF
    doc.save("employee_leave_report.pdf");
  };
  
  return (
    <div className="flex min-h-screen relative ">
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
        <div className="flex flex-col items-center min-h-screen pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h2 className="text-3xl font-semibold text-purple-600 mb-6">
              Employee Profile
            </h2>

            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              />
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              >
                <option value="">Select Position</option>
                <option value="Florist">Florist</option>
                <option value="Event Decorator">Event Decorator</option>
                <option value="Wedding Coordinator">Wedding Coordinator</option>
                <option value="Customer Service Manager">
                  Customer Service Manager
                </option>
                <option value="Delivery Manager">Delivery Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Sales Representative">
                  Sales Representative
                </option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Warehouse Supervisor">
                  Warehouse Supervisor
                </option>
              </select>

              <input
                type="number"
                name="salary"
                placeholder="Basic Salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              />

              <input
                type="number"
                name="othours"
                placeholder="OT Hours"
                value={formData.othours}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              />

              <input
                type="number"
                name="otrate"
                placeholder="OT Rate"
                value={formData.otrate}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded mb-4"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-1/3 bg-purple-400 text-white py-2 rounded hover:bg-purple-500"
                >
                  Update Employee
                </button>
              </div>
            </form>
          </div>

          <div className="bg-purple-200 my-10 p-8 rounded-lg shadow-lg w-full max-w-6xl">

            <h3 className="text-3xl font-semibold text-purple-600 mb-6">
              Leave Details
            </h3>
            <div className="text-center mb-6">
              <p className="text-lg text-purple-600 mb-4">
                Total Leave Count: {leaveData.length}
              </p>
              <button
                onClick={generatePDF}
                className="bg-purple-400 text-white py-2 px-4 rounded hover:bg-purple-500"
              >
                Generate Leave Report (PDF)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-purple-300">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="py-2 px-4 border-b">Leave Type</th>
                    <th className="py-2 px-4 border-b">Start Date</th>
                    <th className="py-2 px-4 border-b">End Date</th>
                    <th className="py-2 px-4 border-b">Reason</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.map((leave) => (
                    <tr key={leave._id}>
                      <td className="py-2 px-4 border-b">{leave.leaveType}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">{leave.reason}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleLeaveUpdate(leave._id)}
                          className="bg-purple-400 text-white py-1 px-2 rounded hover:bg-purple-500 mr-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteLeave(leave._id)}
                          className="bg-purple-400 text-white py-1 px-2 rounded hover:bg-purple-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
