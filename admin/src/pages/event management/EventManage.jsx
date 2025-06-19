import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../images/logo.png';

import backgroundImage from "../../images/main.jpeg";

export default function EventManage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(['Weddings', 'Engagements','Birthdays','Home Decor']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/event/event');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError('Error fetching events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    (event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory ? event.category === selectedCategory : true)
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/event/event/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete event');
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        setError('Error deleting event');
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`/api/event/event/${id}/complete`, { method: 'PATCH' });
      if (!response.ok) throw new Error('Failed to update event status');
      const updatedEvent = await response.json();
      setEvents(events.map(event => event._id === id ? updatedEvent : event));
    } catch (error) {
      setError('Error updating event status');
      console.error('Error updating event status:', error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 160, 10, 40, 30);
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Event Report', 14, 25);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@daniya-flora.com', 14, 42);
    doc.setDrawColor(0, 102, 204);
    doc.line(14, 50, 196, 50);
    doc.autoTable({
      startY: 60,
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableLineColor: [0, 102, 204],
      tableLineWidth: 0.1,
      head: [['Title', 'Date', 'Time', 'Location', 'Category', 'Status']],
      body: filteredEvents.map(event => [
        event.title,
        new Date(event.date).toLocaleDateString(),
        event.time,
        event.location,
        event.category,
        event.status,
      ]),
    });
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }
    doc.save('event-report.pdf');
  };

  const generateEventReport = async (event) => {
    try {
      // Fetch event details from the backend using the event ID
      const response = await fetch(`/api/event/event/${event._id}`);
      if (!response.ok) throw new Error('Failed to fetch event details');
      
      // Parse the response to get the event data
      const eventData = await response.json();
  
      // Create a new PDF document
      const doc = new jsPDF();
      // Add the logo image to the PDF
      doc.addImage(logo, 'PNG', 160, 10, 40, 30);
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text('Event Details Report', 14, 25);
      doc.setFontSize(12);
  
      // Add event details to the PDF
      doc.text(`Title: ${eventData.title}`, 14, 35);
      doc.text(`Date: ${new Date(eventData.date).toLocaleDateString()}`, 14, 42);
      doc.text(`Time: ${eventData.time}`, 14, 49);
      doc.text(`Location: ${eventData.location}`, 14, 56);
      doc.text(`Category: ${eventData.category}`, 14, 63);
      doc.text(`Status: ${eventData.status}`, 14, 70);
      
      // If there's a description, include it in the report
      if (eventData.description) {
        doc.text(`Description: ${eventData.description}`, 14, 77);
      }
  
      // If the event has a package ID, fetch and display package details
     
        doc.text(`Package: ${eventData.packageId.name}`, 14, 84);
  
      // Save the generated PDF with the event title as the filename
      doc.save(`${eventData.title}-report.pdf`);
    } catch (error) {
      console.error('Error generating event report:', error);
    }
  };
  
  

  const handleUpdate = (id) => {
    navigate(`/update-event/${id}`);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <nav className="w-64 bg-purple-300 text-white h-screen p-6 z-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>
      <ul>
        <li className="mb-4">
          <Link to="/main-admin-dashboard" className="block py-2 px-4 rounded-lg hover:bg-purple-400">
            Main Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/event-manage" className="block py-2 px-4 rounded-lg hover:bg-purple-400">
            Manage Events
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/add-event" className="block py-2 px-4 rounded-lg hover:bg-purple-400">
            Add Event
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/event-calendar" className="block py-2 px-4 rounded-lg hover:bg-purple-400">
            Event Calendar
          </Link>
        </li>
      </ul>
    </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center min-h-screen pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">Event List</h2>

            {/* Search bar and category filter */}
            <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by event name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                onClick={generateReport}
                className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                Generate Report
              </button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Loading indicator */}
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map(event => (
                      <tr key={event._id} className="border-b">
                        <td className="border p-2">{event.title}</td>
                        <td className="border p-2">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="border p-2">{event.time}</td>
                        <td className="border p-2">{event.location}</td>
                        <td className="border p-2">{event.category}</td>
                        <td className="border p-2">{event.status}</td>
                        <td className="border p-2 flex space-x-2">
                          <button
                            onClick={() => handleUpdate(event._id)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                          >
                            Delete
                          </button>
                          <button
                                onClick={() => handleComplete(event._id)}
                                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                              >
                                Complete
                              </button>
                          <button
                            onClick={() => generateEventReport(event)}
                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                          >
                            Report
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
