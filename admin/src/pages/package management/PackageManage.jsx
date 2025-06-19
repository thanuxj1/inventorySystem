import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import backgroundImage from "../../images/main.jpeg";

import logo from '../../images/logo.png';

export default function PackageManage() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPackages, setFilteredPackages] = useState([]);

  // Fetch all packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/package');
        const data = await response.json();
        setPackages(data);
        setFilteredPackages(data); // Initialize filtered packages with full list
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterPackages(e.target.value, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterPackages(searchTerm, e.target.value);
  };

  // Filter packages based on search term and selected category
  const filterPackages = (searchTerm, category) => {
    const filtered = packages.filter((pkg) => {
      const matchesName = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === '' || pkg.category === category;
      return matchesName && matchesCategory;
    });
    setFilteredPackages(filtered);
  };

  // Delete a package
  const deletePackage = async (id) => {
    try {
      const response = await fetch(`/api/package/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPackages(packages.filter((pkg) => pkg._id !== id));
        setFilteredPackages(filteredPackages.filter((pkg) => pkg._id !== id));
      } else {
        console.error('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  // Navigate to update form (assuming a different route for updating)
  const updatePackage = (id) => {
    window.location.href = `/package/update/${id}`; // Example of page redirection
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add logo centered to the right of the report title
    doc.addImage(logo, 'PNG', 160, 10, 40, 30); // Positioned on the right side
  
    // Add report title
    doc.setFontSize(18);
    doc.setTextColor(0); // Black for report title
    doc.text('Packages Report', 14, 25);
  
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
      head: [['Package Name', 'Price', 'Description', 'Expire Date', 'Category']],
      body: filteredPackages.map((pkg) => [
        pkg.name,
        pkg.price,
        pkg.description,
        new Date(pkg.expireDate).toLocaleDateString(),
        pkg.category,
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
    doc.save('packages-report.pdf');
  };
  
  


  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <nav className="w-64 bg-purple-300 text-white h-auto p-6 z-10">
        <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>
        <ul>
          <li className="mb-4">
            <a href="/main-admin-dashboard" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Main Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="/package-manage" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Manage Packages</a>
          </li>
          <li className="mb-4">
            <a href="/add-package" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Add Package</a>
          </li>
          <li className="mb-4">
            <a href="/show-notCompleted" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Add Items</a>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center min-h-screen pt-20 ">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">Package List</h2>

          {/* Search bar and category filter */}
          <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by package name"
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
              <option value="Engagements">Engagements</option>
              <option value="Birthdays">Birthdays</option>
              <option value="Home Decor">Home Decor</option>
            </select>
            <button
              onClick={generatePDF}
              className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
            >
              Generate Report
            </button>
          </div>

          {/* Table displaying packages */}
          <div className="overflow-x-visible">
            <table className="w-full border border-purple-300">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Package Name</th>
                  <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                  <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                  <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Expire Date</th>
                  <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg._id} className="border-t">
                      <td className="border p-2">{pkg.name}</td>
                      <td className="border p-2">{pkg.price}</td>
                      <td className="border p-2">
  {pkg.description.length > 50 ? pkg.description.slice(0, 50) + '...' : pkg.description}
</td>
                      <td className="border p-2">{new Date(pkg.expireDate).toLocaleDateString()}</td>
                      <td className="border p-2">{pkg.category}</td>
                      <td className="border p-2 space-x-2">
                        <button
                          onClick={() => updatePackage(pkg._id)}
                          className="bg-purple-400 text-white px-4 py-1 rounded-lg hover:bg-purple-500"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deletePackage(pkg._id)}
                          className="bg-purple-400 text-white px-4 py-1 rounded-lg hover:bg-purple-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">No packages found</td>
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
