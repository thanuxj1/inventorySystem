import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../images/logo.png';

import backgroundImage from "../../images/main.jpeg";

const ShowNotCompletedEventStockside = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchNotCompletedEvents = async () => {
      try {
        const response = await axios.get('/api/event/event?status=Not Completed'); // Adjust the API endpoint as needed
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch not completed events:", error);
      }
    };

    fetchNotCompletedEvents();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearchTerm = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.addImage(logo, 'PNG', 160, 10, 40, 30); // Positioned on the right side
  
    // Add report title
    doc.setFontSize(18);
    doc.setTextColor(0); // Black for report title
    doc.text('Not Completed Events Report', 14, 25);
  
    // Add mobile number and email
    doc.setFontSize(12);
    doc.setTextColor(100); // Gray for contact details
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);
  
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
      head: [['Title', 'Date', 'Time', 'Location', 'Items']],
      body: filteredEvents.map((event) => [
        event.title,
        new Date(event.date).toLocaleDateString(),
        event.time,
        event.location,
        event.items.join(', ') || 'No items added',
      ]),
    });
  
    doc.save("not_completed_events_report.pdf");
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
        <div className="flex flex-col items-center min-h-screen  pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h1 className="text-3xl font-semibold text-center text-purple-600 mb-6">Not Completed Events</h1>
            <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by title"
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
                <option value="Weddings">Weddings</option>
                <option value="Birthdays">Birthdays</option>
                <option value="Gifts">Gifts</option>
                <option value="Home Decor">Home Decor</option>
              </select>
              <button
                onClick={generatePDF}
                className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                Generate Report
              </button>
            </div>
            <div className="overflow-x-visible">
              <table className="w-full border border-purple-300">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="border-t">
                      <td className="border p-2">{event.title}</td>
                      <td className="border p-2">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="border p-2">{event.time}</td>
                      <td className="border p-2">{event.location}</td>
                      <td className="border p-2 space-x-2">
                        <ul>
                          {event.items && event.items.length > 0 ? (
                            event.items.map((item, index) => <li key={index}>{item}</li>)
                          ) : (
                            <li>No items added</li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">No events found</td>
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
};

export default ShowNotCompletedEventStockside;
