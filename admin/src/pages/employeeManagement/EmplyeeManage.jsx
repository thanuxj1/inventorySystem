import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

import logo from "../../images/logo.png"; // Import your logo image
import backgroundImage from "../../images/main.jpeg"; // Import your background image

export default function EmployeeManage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/employee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedEmployees = data.map((emp) => ({
          ...emp,
          othours: emp.othours || 0, // Initialize OT hours if not present
          otrate: emp.otrate || 0, // Initialize OT rate if not present
        }));
        setEmployees(updatedEmployees);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handleAddLeave = (employeeId) => {
    navigate(`/leaves/add/${employeeId}`);
  };

  const handleUpdate = (employeeId) => {
    navigate(`/employees/update/${employeeId}`);
  };

  const handleDelete = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      fetch(`/api/employee/delete/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setEmployees(employees.filter((emp) => emp._id !== employeeId));
          } else {
            console.error("Error deleting employee:", res.statusText);
          }
        })
        .catch((err) => console.error("Error deleting employee:", err));
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const name = employee.name || ""; // Ensure name is defined
    const matchesSearchTerm = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition
      ? employee.position === selectedPosition
      : true;
    return matchesSearchTerm && matchesPosition;
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 160, 10, 40, 30);
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Employee Report", 14, 25);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Mobile: +1 234 567 890", 14, 35);
    doc.text("Email: info@daniya-flora.com", 14, 42);
    doc.setDrawColor(0, 102, 204);
    doc.line(14, 50, 196, 50);
    doc.autoTable({
      startY: 60,
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableLineColor: [0, 102, 204],
      tableLineWidth: 0.1,
      head: [
        [
          "Name",
          "Email",
          "Position",
          "Salary",
          "OT Hours",
          "OT Rate",
          "Total Salary",
        ],
      ],
      body: filteredEmployees.map((employee) => [
        employee.name,
        employee.email,
        employee.position,
        employee.salary,
        employee.othours,
        employee.otrate,
        employee.salary + employee.othours * employee.otrate,
      ]),
    });

    // Add page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${totalPages}`, 200 - 20, 287, null, null, "right");
    }

    doc.save("employee_report.pdf");
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
             Manage Admin
            </Link>

          
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <div className="flex flex-col items-center min-h-screen pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">
              Manage Admin
            </h2>

            <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Positions</option>
                <option value="Florist">Florist</option>
                <option value="Event Decorator">Event Decorator</option>
                <option value="Wedding Coordinator">Wedding Coordinator</option>
                <option value="Customer Service Manager">
                 Admin
                </option>
                <option value="Delivery Manager">Delivery Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Warehouse Supervisor">Warehouse Supervisor</option>
              </select>

              {/* Report Button */}
              <button
                onClick={generatePDF}
                className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                Generate Report
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Name
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Email
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Position
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Salary
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        OT Hours
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        OT Rate
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Total Salary
                      </th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td className="border p-2">{employee.name}</td>
                        <td className="border p-2">{employee.email}</td>
                        <td className="border p-2">{employee.mobile}</td>
                        <td className="border p-2">{employee.position}</td>
                        <td className="border p-2">{employee.salary}</td>
                        <td className="border p-2">{employee.othours}</td>
                        <td className="border p-2">{employee.otrate}</td>
                        <td className="border p-2">
                          {employee.salary + employee.othours * employee.otrate}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleAddLeave(employee._id)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 mx-1"
                          >
                            Add Leave
                          </button>
                          <button
                            onClick={() => handleUpdate(employee._id)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 mx-1"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 mx-1"
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
}
