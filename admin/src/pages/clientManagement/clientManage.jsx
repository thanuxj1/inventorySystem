import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import backgroundImage from "../../images/main.jpeg";
import logo from '../../images/logo.png';
import { Link } from 'react-router-dom';

export default function ClientManage() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/client');
        const data = await response.json();
        setClients(data);
        setFilteredClients(data); // Initialize filtered clients with full list
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterClients(e.target.value, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterClients(searchTerm, e.target.value);
  };

  // Filter clients based on search term and selected category
  const filterClients = (searchTerm, category) => {
    const filtered = clients.filter((client) => {
      const matchesName = client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === '' || client.category === category; // Adjust this if needed
      return matchesName && matchesCategory;
    });
    setFilteredClients(filtered);
  };

  // Delete a client
  const deleteClient = async (id) => {
    try {
      const response = await fetch(`/api/client/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter((client) => client._id !== id));
        setFilteredClients(filteredClients.filter((client) => client._id !== id));
      } else {
        console.error('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Navigate to update form
  const updateClient = (id) => {
    window.location.href = `/client/update/${id}`; // Example of page redirection
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add logo centered to the right of the report title
    doc.addImage(logo, 'PNG', 160, 10, 40, 30); // Positioned on the right side

    // Add report title
    doc.setFontSize(18);
    doc.setTextColor(0); // Black for report title
    doc.text('Clients Report', 14, 25);

    // Add mobile number and email
    doc.setFontSize(12);
    doc.setTextColor(100); // Gray for contact details
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@example.com', 14, 42);

    // Draw a line under the header
    doc.setDrawColor(0, 102, 204); // Blue line
    doc.line(14, 50, 196, 50); // Horizontal line

    // Generate table with custom styles
    doc.autoTable({
      startY: 60, // Start after the header
      headStyles: {
        fillColor: [0, 102, 204], // Blue header background
        textColor: [255, 255, 255], // White text for header
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
      tableLineColor: [0, 102, 204], // Blue table borders
      tableLineWidth: 0.1,
      head: [['First Name', 'Last Name', 'Contact Number', 'Email', 'Address']],
      body: filteredClients.map((client) => [
        client.firstName,
        client.lastName,
        client.phoneNumber,
        client.email,
        client.address,
        client.category,
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
    doc.save('clients-report.pdf');
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <nav className="w-64 bg-purple-300 text-white h-auto p-6 z-10">
        <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>
        <ul>
          <li className="mb-4">
            <Link to="/main-admin-dashboard" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Main Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/client/manage" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Manage Clients</Link>
          </li>
          <li className="mb-4">
            <Link to="/client/add" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Add Client</Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center min-h-screen pt-20 ">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">Client List</h2>

            {/* Search bar and category filter */}
            <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a category</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Corporate">Corporate</option>
                <option value="New">New</option>
              </select>
              <button
                onClick={generatePDF}
                className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                Generate Report
              </button>
            </div>

            {/* Table displaying clients */}
            <div className="overflow-x-visible">
              <table className="w-full border border-purple-300">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">First Name</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Last Name</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Contact Number</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client._id} className="border-t">
                        <td className="border p-2">{client.firstName}</td>
                        <td className="border p-2">{client.lastName}</td>
                        <td className="border p-2">{client.phoneNumber}</td>
                        <td className="border p-2">{client.email}</td>
                        <td className="border p-2">{client.address}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => updateClient(client._id)}
                            className="bg-purple-400 text-white px-2 py-1 rounded hover:bg-purple-400 mr-2"
                          >
                            Update
                          </button>
                          <br />
                          <button
                            onClick={() => deleteClient(client._id)}
                            className="bg-purple-400 text-white px-2 py-1 rounded hover:bg-purple-400"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border p-2 text-center">No clients found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
